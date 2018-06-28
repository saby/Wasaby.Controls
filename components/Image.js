/**
 * Created by ps.borisov on 30.09.2015.
 */
define('SBIS3.CONTROLS/Image',
   [
      'SBIS3.CONTROLS/Utils/ImageUtil',
      'Core/helpers/vital/processImagePath',
      'Core/Indicator',
      'Core/core-merge',
      'Core/CommandDispatcher',
      'Core/Deferred',
      'Lib/Control/CompoundControl/CompoundControl',
      'WS.Data/Source/SbisService',
      'tmpl!SBIS3.CONTROLS/Image/Image',
      'Core/Indicator',
      'Core/helpers/Hcontrol/toggleLocalIndicator',
      'Transport/prepareGetRPCInvocationURL',
      'SBIS3.CONTROLS/Utils/SourceUtil',
      'SBIS3.CONTROLS/ControlHierarchyManager',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'Core/helpers/Function/debounce',
      'WS.Data/Di',
      'SBIS3.CONTROLS/Link',
      'SBIS3.CONTROLS/Menu/MenuLink',
      'i18n!SBIS3.CONTROLS/Image',
      'css!SBIS3.CONTROLS/Image/Image'
   ], function(
      ImageUtil,
      processImagePath,
      cIndicator, cMerge,
      CommandDispatcher,
      Deferred,
      CompoundControl,
      SbisService,
      dotTplFn,
      Indicator,
      toggleLocalIndicator,
      prepareGetRPCInvocationURL,
      SourceUtil,
      ControlHierarchyManager,
      InformationPopupManager,
      debounce,
      Di
   ) {
      'use strict';

      //TODO: Избавится от дублирования
      var

         //Продолжительность анимации при отображения панели изображения
         ANIMATION_DURATION = 300,

         /**
          * Класс контрол "Изображение". Позволяет отображать и редактировать изображения, полученные из источника данных.
          * В качестве источника данных допускается использовать только {@link WS.Data/Source/SbisService}.
          * @class SBIS3.CONTROLS/Image
          * @extends Lib/Control/CompoundControl/CompoundControl
          * @author Борисов П.С.
          *
          * @ignoreOptions validators
          * @ignoreEvents onAfterLoad onChange onStateChange
          * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
          *
          * @public
          * @control
          * @category Decorate
          * @initial
          * <component data-component='SBIS3.CONTROLS/Image' style='width: 100px; height: 100px'>
          * </component>
          */
         Image = CompoundControl.extend(/** @lends SBIS3.CONTROLS/Image.prototype */{
            /**
             * @event onBeginLoad Происходит перед началом загрузки изображения в компоненте.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {SBIS3.CONTROL.Image} control Экземпляр класса контрола, для которого произошло событие.
             * @returns {Boolean} В случае если из обработчика события возвращается результат false, то загрузка изображения отменяется.
             * @example
             * <pre>
             *    Image.subscribe('onBeginLoad', function(eventObject, control) {
             *
             *       // отмена загрузки изображения
             *       event.setResult(false);
             *    });
             * </pre>
             */
            /**
             * @event onEndLoad Происходит после загрузки изображения в компоненте.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {Object} response Ответ бизнес-логики.
             */
            /**
             * @event onErrorLoad Происходит в случае ошибки при загрузке изображения.
             * @remark
             * Ошибка может происходит, если сервер не отвечает либо переданы неверные параметры при вызове метода бизнес-логики.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {Object} error Описание ошибки, которое получено от бизнес-логики.
             */
            /**
             * @event onChangeImage Происходит при смене изображения.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {String} image Адрес изображения.
             */
            /**
             * @event onDataLoaded Происходит при загрузке изображения в компонент.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {String} imageUrl Адрес изображения.
             * @param {Boolean} firstload Первый ли раз прошла загрузка: false - первый, true- не первый.
             */
            /**
             * @event onResetImage Происходит при сбросе изображения.
             * @remark
             * Происходит при вызове команды {@link resetImage}.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @see resetImage
             */
            /**
             * @event onShowEdit Происходит при отображении диалога редактирования изображения.
             * @remark
             * Происходит при вызове команды {@link editImage}.
             * @param {Core/EventObject} eventObject Дескриптор события.
             * @param {String} imageType Тип изображения: 'current' - текущее, 'new' - новое.
             * @see editImage
             */
            /**
             * @event onBeginSave Возникает при сохранении изображения
             * Позволяет динамически формировать параметры обрезки изображения
             * @param {Core/EventObject} eventObject Дескриптор события описание в классе Core/Abstract
             * @param {Object} sendObject Параметры обрезки изображения
             * @example
             * <pre>
             * onBeginSave: function(eventObject, sendObject) {
             *    delete sendObject.realHeight;
             *    delete sendObject.realWidth;
             *    event.setResult(sendObject);
             * }
             * </pre>
             * @see onEndSave
             */
            /**
             * @event onEndSave Возникает после обрезки изображения
             * @param {Core/EventObject} eventObject Дескриптор события описание в классе Core/Abstract
             * @param {Object} response Ответ бизнес-логики.
             * @see onBeginSave
             */
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {

                  /**
                   * @cfg {Boolean} Устанавливает использование панели для работы с изображением: кнопки загрузить, редактировать и удалить.
                   * @example
                   * <pre>
                   *     <option name="imageBar">true</option>
                   * </pre>
                   */
                  imageBar: true,

                  /**
                   * @cfg {Boolean} Включает диалог редактирования изображения.
                   * @remark
                   * Диалог отображается при загрузке нового изображения и при нажатии на кнопку "Редактировать".
                   * @example
                   * <pre>
                   *    <option name="enabled">true</option>
                   * </pre>
                   * @see editConfig
                   * @see cropAspectRatio
                   */
                  edit: false,

                  /**
                   * @cfg {Object} Устанавливает параметры диалога редактирования изображения.
                   * @example
                   * <pre>
                   *    <option name="editConfig">
                   *       <option name="title">Редактирование фото</option>
                   *    </option>
                   * </pre>
                   * @see edit
                   * @see cropAspectRatio
                   * @see cropAutoSelectionMode
                   * @see cropSelection
                   * @translatable title
                   */
                  editConfig: {
                     title: rk('Редактирование изображения')
                  },

                  /**
                   * @cfg {Number} Устанавливает соотношение сторон в выделяемой области.
                   * @remark
                   * Применяется для диалога редактирования изображения.
                   * @example
                   * <pre>
                   *    <option name="cropAspectRatio">0.75</option>
                   * </pre>
                   * @see edit
                   * @see editConfig
                   * @see cropAutoSelectionMode
                   * @see cropSelection
                   */
                  cropAspectRatio: undefined,

                  /**
                   * @cfg {Boolean} Устанавливает режим автоматического маскимального расширения и центрирования области выделения.
                   * @remark
                   * false - выделение будет установлено в соотстветствии с параметром {@link cropSelection}.
                   * @example
                   * <pre>
                   *     <option name="cropAutoSelectionMode">true</option>
                   * </pre>
                   * @see cropAspectRatio
                   * @see cropSelection
                   */
                  cropAutoSelectionMode: true,

                  /**
                   * @cfg {Array} Устанавливает координаты начального выделения при редактировании изображения.
                   * @example
                   * <pre>
                   *     <options name="cropSelection" type="array">
                   *        <option>50</option>
                   *        <option>50</option>
                   *        <option>200</option>
                   *        <option>200</option>
                   *     </options>
                   * </pre>
                   * @see cropAspectRatio
                   * @see cropAutoSelectionMode
                   */
                  cropSelection: undefined,

                  /**
                   * @cfg {String} Устанавливает способ отображения изображения в контейнере.
                   * @variant normal Изображение размещается в верхнем левом углу. Изображение располагается в центре, если размер контейнера больше, чем размер изображения.
                   * @variant stretch Изображение вытягивается или сужается, чтобы в точности соответствовать размеру контейнера.
                   * @example
                   * <pre>
                   *     <option name="sizeMode" type="string">stretch</option>
                   * </pre>
                   * @see setSizeMode
                   * @see getSizeMode
                   */
                  sizeMode: 'normal',

                  /**
                   * @cfg {String} Устанавливает изображение, используемое по умолчанию.
                   * @example
                   * <pre>
                   *     <option name="defaultImage">/resources/SBIS3.CONTROLS/components/Image/resources/default-image.png</option>
                   * </pre>
                   */
                  defaultImage: processImagePath('SBIS3.CONTROLS/Image/resources/default-image.png'),

                  /**
                   * @cfg {Object} Устанавливает связанный источник данных - {@link WS.Data/Source/SbisService}.
                   * @remark
                   * Обязательная для конфигурации опция. Если опция не установлена, то контрол не будет отображён.
                   * Для работы с изображениями (чтение и запись в БД) применются <a href='/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/blfile/'>методы БЛ для работы с файлами</a>.
                   * @example
                   * Конфигурация источника через JS-код:
                   * <pre>
                   *     var mySource = new SbisService({
                   *        endpoint: 'Goods',
                   *        binding: {
                   *           read: 'ReadImage'
                   *        }
                   *     });
                   *     image.SetDataSource(mySource);
                   * </pre>
                   * Если задать источник данных через вёрстку, то контрол постороится с проставленным адресом в scr атрибуте тега img
                   * Конфигурация источника данных контрола "Изображение" через вёрстку:
                   * <pre>
                   *     <options name="dataSource">
                   *        <option name="module" value="WS.Data/Source/SbisService"></option>
                   *        <options name="options">
                   *            <options name="endpoint">
                   *                <option name="contract" value="Контрагент"></option>
                   *            </options>
                   *            <options name="binding">
                   *                <option name="read">ПрочитатьИзображение</option>
                   *            </options>
                   *        </options>
                   *     </options>
                   * </pre>
                   * @see setDataSource
                   * @see getDataSource
                   */
                  dataSource: undefined,

                  /**
                   * @cfg {Object} Устанавливает фильтр данных.
                   * @remark
                   * Как правило, опция применяется, чтобы установить значение параметров для методов источника данных (см. {@link dataSource}).
                   * Например, метод чтения файла принимает аргумент: либо идентификатор записи, либо идентификатор файла, которые используются для получения файла изображения (см. <a href='/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/blfile/read/'>Прочитать. Read file method</a>.)
                   * @example
                   * Для изображение установлено, что из контекста из поля"record/@Товар" будет получено значение параметра Идо, который используется для метода получения избражения.
                   * <pre>
                   *    <component data-component="SBIS3.CONTROLS/Image">
                   *       ...
                   *       <options name="filter">
                   *          <option name="ИдО" bind="record/@Товар" value=""/>
                   *       </options>
                   *    </component>
                   * </pre>
                   * @see setFilter
                   * @see getFilter
                   */
                  filter: {},

                  /**
                   * todo Удалить, временная опция для поддержки смены логотипа компании
                   * @deprecated
                   * @noshow
                   */
                  linkedObject: '',

                  /**
                   * @cfg {Boolean} Устанавливает использование web-камеры для загрузки изображения
                   * @example
                   * <pre>
                   *     <option name="webCam">true</option>
                   * </pre>
                   */
                  webCam: true,

                  /**
                   * @cfg {Boolean} Устанавливает способ установки src в тег img,
                   *    установка данной опции в false обеспечит более быструю смену изображения,
                   *    но возлагает на прикладного программиста ответственность за кеширование изображений
                   * @example
                   * <pre>
                   *     <option name="avoidCache">false</option>
                   * </pre>
                   */
                  avoidCache: true
               },
               _imageBar: undefined,
               _imageUrl: '',
               _image: undefined,
               _buttonReset: undefined,
               _attach: undefined,
               _uploadParams: undefined,
               _buttonEdit: undefined,
               _buttonUpload: undefined,
               _boundEvents: undefined,
               _saveIndicator: undefined,
               _saveIndicatorState: undefined,
               _firstLoaded: false,
               _pickerIsOpen: false,
               _cursorInside: false,
               _fistToolbarShow: true
            },
            _modifyOptions: function(options) {
               options = Image.superclass._modifyOptions.apply(this, arguments);
               if (options.dataSource) {
                  options.dataSource = SourceUtil.prepareSource(options.dataSource);
               }

               //если источник данных задан из вёрстки, то необходимо построить теш Img с уже заданным src атрибутом
               options._templateImage = this._getSourceUrl(options);
               return options;
            },
            $constructor: function() {
               this._publish('onBeginLoad', 'onEndLoad', 'onErrorLoad', 'onChangeImage', 'onResetImage', 'onShowEdit', 'onBeginSave', 'onEndSave', 'onDataLoaded');

               //Debounce перебиваем в конструкторе, чтобы не было debounce на прототипе, тк если несколько инстансов сработает только для одного
               //Оборачиваем именно в debounce, т.к. могут последовательно задать filter, dataSource и тогда изображения загрузка произойдет дважды.
               //Опция avoidCache = false означает что если нет изщображения то setDS будет вызываться с reload = false следоватьельно debounce не нужен
               if (this._options.avoidCache) {
                  this._setImage = debounce(this._setImage, 0);
               }
               CommandDispatcher.declareCommand(this, 'uploadImage', this._uploadImage);
               CommandDispatcher.declareCommand(this, 'uploadFileCam', this._uploadFileCam);
               CommandDispatcher.declareCommand(this, 'editImage', this._editImage);
               CommandDispatcher.declareCommand(this, 'resetImage', this.resetImage);
               CommandDispatcher.declareCommand(this, 'pickerOpen', this._pickerOpenHandler);
               CommandDispatcher.declareCommand(this, 'pickerClose', this._pickerCloseHandler);
               if (this._options.imageBar) {
                  this._imageBar = this._container.find('.controls-image__image-bar');
               }
               this._image = this._container.find('.controls-image__image');
            },
            init: function() {
               Image.superclass.init.call(this);

               //Находим компоненты, необходимые для работы (если нужно)
               if (this._options.imageBar) {
                  var
                     pickerContainer;
                  this._buttonEdit = this.getChildControlByName('ButtonEdit');
                  this._buttonUpload = this.getChildControlByName('ButtonUpload');
                  this._buttonReset = this.getChildControlByName('ButtonReset');
                  this._bindToolbarEvents();
                  if (this._options.webCam) {
                     this._buttonUpload.once('onPickerOpen', function() {
                        pickerContainer = this._buttonUpload.getPicker().getContainer();
                        pickerContainer.mouseenter(function() {
                           this._cursorInside = true;
                        }.bind(this));
                        pickerContainer.mouseleave(function() {
                           this._cursorInside = false;
                        }.bind(this));
                     }.bind(this));
                  }
               }

               //Если задан источник данных и изображение не загрузилось то перезагружаем его.
               //Например у сотрудника не загружено фото, метод возвращает null.
               //Определяем битое изображение по https://stackoverflow.com/questions/92720/jquery-javascript-to-replace-broken-images
               if (this.getDataSource() && (typeof this._image[0].naturalWidth === 'undefined' || this._image[0].naturalWidth === 0)) {
                  this.reload();
               }
            },

            /* ------------------------------------------------------------
               Блок публичных методов
               ------------------------------------------------------------ */
            /**
             * Метод перезагрузки данных.
             */
            reload: function() {
               var
                  url = this._getSourceUrl();
               if (url !== '') {
                  this._loadImage(url);
               }
            },

            /**
             * Устанавливает способ отображения изображения в контейнере.
             * @param {String} sizeMode Способ отображения. Варианты значений:
             * <ul>
             *    <li> normal Изображение размещается в верхнем левом углу. Изображение располагается в центре, если размер контейнера больше, чем размер изображения.</li>
             *    <li> stretch Изображение вытягивается или сужается, чтобы в точности соответствовать размеру контейнера.</li>
             * </ul>
             * @param {Boolean} noReload true - не производить перезагрузку данных.
             * @see sizeMode
             * @see getSizeMode
             */
            setSizeMode: function(sizeMode, noReload) {
               this._options.sizeMode = sizeMode;
               if (!noReload) {
                  this.reload();
               }
               this._container.toggleClass('controls-image__normal', sizeMode == 'normal');
            },

            /**
             * Возвращает текущий способ отображения изображения в контейнере.
             * @returns {String} Варианты значений:
             * <ul>
             *    <li> normal Изображение размещается в верхнем левом углу. Изображение располагается в центре, если размер контейнера больше, чем размер изображения.</li>
             *    <li> stretch Изображение вытягивается или сужается, чтобы в точности соответствовать размеру контейнера.</li>
             * </ul>
             * @see sizeMode
             * @see setSizeMode
             */
            getSizeMode: function() {
               return this._options.sizeMode;
            },

            /* ------------------------------------------------------------
               Блок приватных методов
               ------------------------------------------------------------ */
            _recalcUploadCaption: function() {
               var
                  width = this._container.width(),
                  uploadWidth,
                  resetWidth,
                  minToolbar,
                  resetVisible = this._buttonReset.isVisible();
               if (width !== 0) {
                  this._imageBar.show();//показываем, чтобы можно было вычислить размеры
                  this._buttonReset.toggle(true);//показываем, чтобы можно было вычислить размеры
                  uploadWidth = this._buttonUpload._container[0].clientWidth + (+this._buttonUpload._container.css('margin-left').replace('px', '')),
                  resetWidth = this._buttonReset._container[0].clientWidth,
                  minToolbar = uploadWidth + resetWidth + (this._options.edit ? resetWidth : 0) + 4;
                  this._imageBar.hide();//скрываем после вычисления размеров
                  this._buttonReset.toggle(resetVisible);//скрываем после вычисления размеров
                  if ((width < minToolbar)) {
                     this._buttonUpload.setCaption('');
                     this._buttonUpload.setTooltip(rk('Загрузить', 'Image'));
                  }
               }
            },
            _getSourceUrl: function(options) {
               options = options ? options : this._options;
               if (options.dataSource) {
                  return prepareGetRPCInvocationURL(options.dataSource.getEndpoint().contract,
                     options.dataSource.getBinding().read, options.filter);
               } else {
                  return options.defaultImage;
               }
            },
            _bindToolbarEvents: function() {
               this._boundEvents = {
                  onImageMouseEnter: this._onImageMouseEnter.bind(this),
                  onImageMouseLeave: this._onImageMouseLeave.bind(this)
               };
               this._container.mouseenter(this._boundEvents.onImageMouseEnter);
               this._container.mouseleave(this._boundEvents.onImageMouseLeave);
            },
            _onBeginLoad: function() {
               var result = this._notify('onBeginLoad', this);
               Indicator.setMessage(rk('Загрузка...'));
               if (result !== false) {
                  toggleLocalIndicator(this._container, true);
               }
               return result;
            },
            _onEndLoad: function(response) {
               var imageInstance = this;
               if (response instanceof Error) {
                  return this._onLoadedError(response);
               }
               imageInstance._notify('onEndLoad', {result: response.getRawData()});
               if (imageInstance._options.edit) {
                  imageInstance._showEditDialog('new');
               } else {
                  imageInstance._setImage(imageInstance._getSourceUrl());
                  toggleLocalIndicator(imageInstance._container, false);
                  Indicator.hide();
               }
            },

            /**
             * @param {Error} error
             * @private
             */
            _onLoadedError: function(error) {
               toggleLocalIndicator(this._container, false);
               Indicator.hide();

               // игнорируем HTTPError офлайна, если они обработаны
               if (!(error._isOfflineMode && error.processed) && !(error.canceled)) {
                  var
                     config = error._isOfflineMode ? {
                        message: 'Отсутствует соединение с интернет',
                        details: 'Подключите интернет и повторите попытку.',
                        status: 'error'
                     } : {
                        status: 'error',
                        details: error.message,
                        message: 'При загрузке изображения возникла ошибка'
                     };
                  InformationPopupManager.showMessageDialog(config);
               }
               return this._onErrorLoad(error, true);
            },
            _onChangeImage: function() {
               var
                  image = this._image.get(0),
                  showButtons = this._imageUrl !== this._options.defaultImage;
               if (this._options.sizeMode === 'stretch') {
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'width' : 'height', '');
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'height' : 'width', '100%');
               }
               if (this._options.imageBar) {
                  this._buttonReset.toggle(showButtons);
                  this._buttonEdit.toggle(this._options.edit && showButtons);
               }
               this._notify('onDataLoaded', this._imageUrl, this._firstLoaded);
               if (!this._firstLoaded) {
                  this._firstLoaded = true;
               } else {
                  this._notify('onChangeImage', this._imageUrl);
               }
            },
            _onErrorLoad: function(error, withoutReload) {
               this._notify('onErrorLoad', error);
               if (!withoutReload && this._imageUrl !== this._options.defaultImage) {
                  this._setImage(this._options.defaultImage);
               }
            },
            _onImageMouseEnter: function() {
               this._cursorInside = true;
               if (this._canDisplayImageBar()) {
                  if (this._fistToolbarShow) {
                     this._recalcUploadCaption();
                     this._fistToolbarShow = false;
                  }
                  this._imageBar.fadeIn(ANIMATION_DURATION);
               }
            },
            _onImageMouseLeave: function(event) {
               if (!this._pickerIsOpen && !ControlHierarchyManager.checkInclusion(this, $(event.toElement)) && this._canDisplayImageBar()) {
                  this._imageBar.hide();
               }
               this._cursorInside = false;
            },
            _canDisplayImageBar: function() {
               return this.isEnabled();
            },
            _setImage: function(url) {
               if (url !== '') {
                  this._loadImage(url);
                  this._imageUrl = url;
               }
            },
            _loadImage: function(url) {
               var
                  self = this;
               if (this._options.avoidCache) {
                  //Из-за проблем, связанных с кэшированием - перезагружаем картинку специальным хелпером
                  ImageUtil.reloadImage(this._image, url)
                     .addCallback(function() {
                        self._image.hasClass('ws-hidden') && self._image.removeClass('ws-hidden');
                        self._onChangeImage();
                     })
                     .addErrback(function() {
                        self._onErrorLoad();
                     });
               } else {
                  var
                     img = this._image[0],
                     onLoadHandler = function() {
                        self._image.hasClass('ws-hidden') && self._image.removeClass('ws-hidden');
                        self._onChangeImage();
                        img.removeEventListener('load', onLoadHandler);
                        img.removeEventListener('error', onErrorHandler);
                     },
                     onErrorHandler = function() {
                        self._onErrorLoad();
                        img.removeEventListener('error', onErrorHandler);
                        img.removeEventListener('load', onLoadHandler);
                     };
                  img.addEventListener('load', onLoadHandler);
                  img.addEventListener('error', onErrorHandler);
                  img.setAttribute('src', url);
               }
            },
            _showEditDialog: function(imageType) {
               var
                  self = this,
                  showCropResult = this._notify('onShowEdit', imageType),
                  dataSource = this.getDataSource(),
                  filter = this.getFilter();

               //todo Удалить, временная опция для поддержки смены логотипа компании
               if (showCropResult && showCropResult.dataSource instanceof SbisService) {
                  dataSource = showCropResult.dataSource;
                  filter = showCropResult.filter;
               } else if (showCropResult) {
                  filter = showCropResult;
               }
               require(['Lib/Control/Dialog/Dialog'], function(Dialog) {
                  new Dialog({
                     animatedWindows: false,
                     template: 'SBIS3.CONTROLS/Image/resources/EditDialog/EditDialog',
                     opener: self,
                     visible: false,
                     minWidth: 390,
                     cssClassName: 'controls-EditDialog__template',
                     componentOptions: cMerge({
                        dataSource: dataSource,
                        filter: filter,
                        cropAspectRatio: self._options.cropAspectRatio,
                        cropAutoSelectionMode: self._options.cropAutoSelectionMode,
                        cropSelection: self._options.cropSelection,
                        handlers: {
                           onBeginSave: function(event, sendObject) {
                              event.setResult(self._notify('onBeginSave', sendObject));
                              self._toggleSaveIndicator(true);
                           },
                           onEndSave: function(event, result) {
                              event.setResult(self._notify('onEndSave', result));
                              self._toggleSaveIndicator(false);
                              self._setImage(self._getSourceUrl());
                           },
                           onOpenError: function(event) {
                              toggleLocalIndicator(self._container, false);
                              cIndicator.hide();
                              InformationPopupManager.showMessageDialog({
                                 status: 'error',
                                 message: rk('При открытии изображения возникла ошибка')
                              });
                              self._onErrorLoad(event, true);
                           }
                        }
                     }, self._options.editConfig),
                     handlers: {
                        onAfterClose: function() {
                           toggleLocalIndicator(self._container, false);
                        },
                        onBeforeControlsLoad: function() {
                           cIndicator.setMessage(rk('Открытие диалога редактирования') + '...');
                        },
                        onAfterShow: function() {
                           cIndicator.hide();
                        }
                     }
                  });
               });
            },

            /**
             * Показать/скрыть индикатор сохранения изображения
             */
            _toggleSaveIndicator: function(state) {
               this._saveIndicatorState = state;
               if (state) {
                  if (!this._saveIndicator) {
                     require(['Lib/Control/LoadingIndicator/LoadingIndicator'], function(LoadingIndicator) {
                        this._saveIndicator = new LoadingIndicator({
                           'message': rk('Сохранение'),
                           'name': 'ws-load-indicator'
                        });
                        if (!this._saveIndicatorState) {
                           this._saveIndicator.hide();
                        }
                     }.bind(this));
                  } else {
                     this._saveIndicator.show();
                  }
               } else if (this._saveIndicator) {
                  this._saveIndicator.hide();
               }
            },

            /* ------------------------------------------------------------
               Блок обработчиков команд
               ------------------------------------------------------------ */
            /**
              * Иниицирует вызов диалога для выбора загружаемого изображения.
              * @remark
              * Для контрола должен быть установлен {@link dataSource источник данных}.
              * @param {*} [originalEvent] Тип события, которое инициирует вызов диалога.
              * @command uploadImage
              * @see editImage
              * @see resetImage
              */
            _uploadImage: function() {
               var self = this;
               self._getAttach().choose('FileSystem').addCallback(function() {
                  self._upload();
               });
            },

            _uploadFileCam: function() {
               var self = this;
               self._getAttach().choose('PhotoCam').addCallbacks(function() {
                  self._upload();
               }, function(error) {
                  self._onEndLoad(error);
               });
            },

            /**
              * Инициирует вызов диалога редактирования изображения.
              * @remark
              * При открытии диалога происходит событие {@link onShowEdit}.
              * @command editImage
              * @see onShowEdit
              * @see uploadImage
              * @see resetImage
              */
            _editImage: function() {
               toggleLocalIndicator(this.getContainer(), true);
               this._showEditDialog('current');
            },

            /**
              * Инициирует сбор изображения.
              * @remark
              * При сбросе изображения происходит вызов метода удаления из опции destroy (см. {@link dataSource}), а в контрол будет установлено изображение по умолчанию {@link defaultImage}.
              * Если опция не установлена, что производится перезагрузка {@link reload}.
              * При вызове команды происходит событие {@link onResetImage}.
              * @command resetImage
              * @see uploadImage
              * @see editImage
              */
            resetImage: function(onlyClient) {
               var
                  self = this,
                  imageResetResult,
                  callDestroy = function(filter) {
                     var
                        dataSource = self.getDataSource(),
                        sendFilter = filter && Object.prototype.toString.call(filter) === '[object Object]' ? filter : self.getFilter();
                     new SbisService({
                        endpoint: dataSource.getEndpoint().contract
                     }).call(dataSource.getBinding().destroy, sendFilter)
                        .addBoth(function() {
                           self._setImage(self._options.defaultImage);
                           if (self._options.defaultImage === '') {
                              self.reload();
                           }
                        });
                  };
               if (onlyClient) {
                  self._setImage(self._options.defaultImage);
                  if (self._options.defaultImage === '') {
                     self.reload();
                  }
               } else {
                  imageResetResult = this._notify('onResetImage');
                  if (imageResetResult !== false) {
                     if (imageResetResult instanceof Deferred) {
                        imageResetResult.addCallback(function(result) {
                           if (result !== false) {
                              callDestroy(result);
                           }
                        });
                     } else {
                        callDestroy(imageResetResult);
                     }
                  }
               }
            },

            /* ------------------------------------------------------------
               Блок обработчиков кнопок imageBar
               ------------------------------------------------------------ */
            _buttonUploadClick: function(event, key, originalEvent) {
               if (key == 'fromWebCam') {
                  this.sendCommand('uploadFileCam', originalEvent);
               } else {
                  this.sendCommand('uploadImage', originalEvent);
               }
            },
            _pickerOpen: function() {
               this.sendCommand('pickerOpen');
            },
            _pickerClose: function() {
               this.sendCommand('pickerClose');
            },

            _pickerOpenHandler: function() {
               this._pickerIsOpen = true;
            },
            _pickerCloseHandler: function() {
               if (!this._cursorInside && this._canDisplayImageBar()) {
                  this._imageBar.hide();
               }
               this._pickerIsOpen = false;
            },

            /* ------------------------------------------------------------------------------------------------------------------------------------
               todo: Используется для работы с DataSource и Filter. Будет полностью удалено, когда появится базовый миксин для работы с DataSource.
               Задача в разработку от 17.12.2015 №1212750
               Необходимо разработать миксин, предоставляющий стандартные методы для работы с DataSource. Это:- ...
               https://inside.tensor.ru/opendoc.html?guid=427908a9-1e9e-4e7f-92f0-db5b27c1a631
               ------------------------------------------------------------------------------------------------------------------------------------ */
            /**
             * Устанавливает источник данных.
             * @param {WS.Data/Source/SbisService} dataSource Экземпляр класса с конфигурацией источника.
             * @param {Boolean} noReload true - не перезагружать изображение после установки источника данных.
             * @see dataSource
             * @see getDataSource
             */
            setDataSource: function(dataSource, noReload) {
               if (dataSource instanceof SbisService) {
                  this._options.dataSource = dataSource;
                  if (!noReload) {
                     this._setImage(this._getSourceUrl());
                  }
               }
            },

            /**
             * Возвращает текущий источник данных.
             * @returns {WS.Data/Source/SbisService} Экземпляр класса с конфигурацией источника.
             * @see dataSource
             * @see setDataSource
             */
            getDataSource: function() {
               return this._options.dataSource;
            },

            /**
             * Устанавливает фильтр.
             * @param {Object} filter Фильтр контрола.
             * @param {Boolean} noReload true - не перезагружать изображение после установки фильтра.
             * @see filter
             * @see getFilter
             */
            setFilter: function(filter, noReload) {
               this._options.filter = filter;
               if (!noReload) {
                  this._setImage(this._getSourceUrl());
               }
            },

            /**
             * Возвращает установленный фильтр.
             * @returns {Object} Фильтр контрола.
             * @see filter
             * @see setFilter
             */
            getFilter: function() {
               return this._options.filter;
            },

            /**
              * Возвращает загрузчик
              * @return {File/Attach/Lazy}
              * @private
              */
            _getAttach: function () {
               if (this._attach) {
                  return this._attach;
               }
               var dataSource = this.getDataSource();
               this._attach = Di.create('ImageAttachGetter', {
                  opener: this,
                  element: this.getContainer()[0],
                  //todo Удалить, временная опция для поддержки смены логотипа компании
                  contract: this._options.linkedObject || dataSource.getEndpoint().contract,
                  binding: dataSource.getBinding()
               });
               return this._attach;
            },

            /**
             * Загрузка выбранного изображения
             * @private
             */
            _upload: function() {
               var self = this;
               if (this._options.imageBar && this._canDisplayImageBar()) {
                  this._imageBar.hide();
               }
               if (!this.getDataSource()) {
                  Indicator.hide();
                  return;
               }
               var attach = self._getAttach();
               if (this._onBeginLoad() === false) {
                  Indicator.hide();
                  return;
               }
               attach.upload(this._uploadParams || {}).addCallbacks(function(results) {
                  results.forEach(function(result) {
                     self._onEndLoad(result);
                  });
               }, function(result) {
                  self._onEndLoad(result);
               });
            },

            /**
             * Устанавливает параметры при загрузке файла
             *
             * Аналог метода из FileLoaderAbstract, который раньше прокидывался в onBeginLoad
             * и там докидывались параметры загрузки
             * Сейчас в событие не отправляем внутрености компонента, а шлём себя, и сами разруливаем параметризацию загрузки
             *
             * @param {Object} params Объект с параметрами
             */
            setUploadParams: function(params) {
               this._uploadParams = params;
            }
         });

      return Image;
   });
