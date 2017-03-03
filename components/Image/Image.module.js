/**
 * Created by ps.borisov on 30.09.2015.
 */
define('js!SBIS3.CONTROLS.Image',
   [
   "Transport/BLObject",
   "Core/helpers/helpers",
   "Core/Indicator",
   "Core/core-merge",
   "Core/CommandDispatcher",
   "Core/Deferred",
   "js!SBIS3.CORE.CompoundControl",
   "js!WS.Data/Source/SbisService",
   "html!SBIS3.CONTROLS.Image",
   "js!SBIS3.CORE.Dialog",
   "js!SBIS3.CORE.FileLoader",
   "js!SBIS3.CORE.LoadingIndicator",
   "Core/core-instance",
   "Core/helpers/fast-control-helpers",
   "Core/helpers/transport-helpers",
   "js!SBIS3.CONTROLS.Link",
   "i18n!SBIS3.CONTROLS.Image",
   'css!SBIS3.CONTROLS.Image'
], function( BLObject, cHelpers, cIndicator, cMerge, CommandDispatcher, Deferred,CompoundControl, SbisService, dotTplFn, Dialog, FileLoader, LoadingIndicator, cInstance, fcHelpers, transHelpers) {
      'use strict';
      var
         //Продолжительность анимации при отображения панели изображения
         ANIMATION_DURATION = 300,
         MIN_TOOLBAR_WIDTH = 125, //минимальный размер тулбара для которого убирается  напись "загрузить" и кнопка "удалить"
         MIN_TOOLBAR_WIDTH_WITH_EDIT = 155,// минимальный размер тулбара для которого убирается  напись "загрузить" и все оставльные кнопки
         /**
          * Класс контрол "Изображение". Позволяет отображать и редактировать изображения, полученные из источника данных.
          * В качестве источника данных допускается использовать только {@link WS.Data/Source/SbisService}.
          * @class SBIS3.CONTROLS.Image
          * @extends $ws.proto.CompoundControl
          * @author Крайнов Дмитрий Олегович
          *
          * @ignoreOptions validators
          * @ignoreEvents onAfterLoad onChange onStateChange
          * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
          *
          * @public
          * @control
          * @category Decorate
          * @initial
          * <component data-component='SBIS3.CONTROLS.Image' style='width: 100px; height: 100px'>
          * </component>
          */
         Image = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Image.prototype */{
            /**
             * @event onBeginLoad Происходит перед началом загрузки изображения в компоненте.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
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
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {Object} response Ответ бизнес-логики.
             * @example
             * <pre>
             *    Image.subscribe('onEndLoad', function(eventObject, response) {
             *       $ws.helpers.alert('Изображение загружено.');
             *    });
             * </pre>
             */
            /**
             * @event onErrorLoad Происходит в случае ошибки при загрузке изображения.
             * @remark
             * Ошибка может происходит, если сервер не отвечает либо переданы неверные параметры при вызове метода бизнес-логики.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {Object} error Описание ошибки, которое получено от бизнес-логики.
             * @example
             * <pre>
             *    Image.subscribe('onErrorLoad', function(eventObject, error) {
             *       $ws.helpers.alert('Произошла ошибка при загрузке изображения.');
             *    });
             * </pre>
             */
            /**
             * @event onChangeImage Происходит при смене изображения.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {String} image Адрес изображения.
             * @example
             * <pre>
             *    Image.subscribe('onChangeImage', function(eventObject, image) {
             *       $ws.helpers.alert('Изображение обновлено на ' + image);
             *    });
             * </pre>
             */
             /**
             * @event onDataLoaded Происходит при загрузке изображения в компонент.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {String} imageUrl Адрес изображения.
             * @param {Boolean} firstload Первый ли раз прошла загрузка: false - первый, true- не первый.
             * @example
             * <pre>
             *    Image.subscribe('onDataLoaded', function(eventObject, image) {
             *       $ws.helpers.alert('Изображение обновлено на ' + image);
             *    });
             * </pre>
             */
             /**
             * @event onResetImage Происходит при сбросе изображения.
             * @remark
             * Происходит при вызове команды {@link resetImage}.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @example
             * <pre>
             *    Image.subscribe('onResetImage', function(event) {
             *       var
             *          deferred = new Deferred();
             *       $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', {
             *          message: 'Действительно удалить изображение?',
             *          handlers: {
             *             onConfirm: function(event, result) {
             *                deferred.callback(result);
             *             }
             *          }
             *       });
             *       event.setResult(deferred);
             *    });
             * </pre>
             * @see resetImage
             */
            /**
             * @event onShowEdit Происходит при отображении диалога редактирования изображения.
             * @remark
             * Происходит при вызове команды {@link editImage}.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события.
             * @param {String} imageType Тип изображения: 'current' - текущее, 'new' - новое.
             * @see editImage
             */
            /**
             * @event onBeginSave Возникает при сохранении изображения
             * Позволяет динамически формировать параметры обрезки изображения
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
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
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @param {Object} response Ответ бизнес-логики.
             * @see onBeginSave
             */
            _dotTplFn : dotTplFn,
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
                   *     <option name="stretch">true</option>
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
                  defaultImage: cHelpers.processImagePath('js!SBIS3.CONTROLS.Image/resources/default-image.png'),
                  /**
                   * @cfg {Object} Устанавливает связанный источник данных - {@link WS.Data/Source/SbisService}.
                   * @remark
                   * Обязательная для конфигурации опция. Если опция не установлена, то контрол не будет отображён.
                   * Для работы с изображениями (чтение и запись в БД) применются <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/blfile/'>методы БЛ для работы с файлами</a>.
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
                   * Конфигурация источника данных контрола "Изображение" через вёрстку:
                   * <pre>
                   *     <options name="dataSource">
                   *        <option name="module" value="js!WS.Data/Source/SbisService"></option>
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
                   * Например, метод чтения файла принимает аргумент: либо идентификатор записи, либо идентификатор файла, которые используются для получения файла изображения (см. <a href='https://wi.sbis.ru/doc/platform/developmentapl/workdata/logicworkapl/objects/blmethods/blfile/read/'>Прочитать. Read file method</a>.)
                   * @example
                   * Для изображение установлено, что из контекста из поля"record/@Товар" будет получено значение параметра Идо, который используется для метода получения избражения.
                   * <pre>
                   *    <component data-component="SBIS3.CONTROLS.Image">
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
                   * todo Удалить, временная опция для поддержки смены логотипа компании (используется в FileLoader)
                   * @deprecated
                   * @noshow
                   */
                  linkedObject: ''
               },
               _imageBar: undefined,
               _imageUrl: '',
               _image: undefined,
               _fileLoader: undefined,
               _buttonReset: undefined,
               _buttonEdit: undefined,
               _buttonUpload: undefined,
               _boundEvents: undefined,
               _saveIndicator: undefined,
               _firstLoaded: false
            },
            $constructor: function() {
               this._publish('onBeginLoad', 'onEndLoad', 'onErrorLoad', 'onChangeImage', 'onResetImage', 'onShowEdit', 'onBeginSave', 'onEndSave', 'onDataLoaded');
               //Debounce перебиваем в конструкторе, чтобы не было debounce на прототипе, тк если несколько инстансов сработает только для одного
               //Оборачиваем именно в debounce, т.к. могут последовательно задать filter, dataSource и тогда изображения загрузка произойдет дважды.
               this._setImage = this._setImage.debounce(0);
               CommandDispatcher.declareCommand(this, 'uploadImage', this._uploadImage);
               CommandDispatcher.declareCommand(this, 'editImage', this._editImage);
               CommandDispatcher.declareCommand(this, 'resetImage', this.resetImage);
               if (this._options.imageBar) {
                  this._imageBar = this._container.find('.controls-image__image-bar');
               }
               this._image = this._container.find('.controls-image__image');
               if (this._options.dataSource) {
                  this._options.dataSource = this._prepareSource(this._options.dataSource);
               }
            },
            init: function() {
               var
                  dataSource = this.getDataSource(),
                  width = this._container.width();
               Image.superclass.init.call(this);
               //Находим компоненты, необходимые для работы (если нужно)
               if (this._options.imageBar) {
                  this._buttonEdit = this.getChildControlByName('ButtonEdit');
                  this._buttonUpload = this.getChildControlByName('ButtonUpload');
                  this._buttonReset = this.getChildControlByName('ButtonReset');
                  if (width !==0 &&((width < MIN_TOOLBAR_WIDTH && !this._options.edit )||(this._options.edit && width < MIN_TOOLBAR_WIDTH_WITH_EDIT ))){
                     this._buttonUpload.setCaption('');
                     this._buttonUpload.setTooltip('Загрузить');
                  }
                  this._bindToolbarEvents();
               }
               if (this.getDataSource()) {
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
            _prepareSource: function(sourceOpt) {
               var result;
               switch (typeof sourceOpt) {
                  case 'function':
                     result = sourceOpt.call(this);
                     break;
                  case 'object':
                     if (cInstance.instanceOfMixin(sourceOpt, 'WS.Data/Source/ISource')) {
                        result = sourceOpt;
                     }
                     if ('module' in sourceOpt) {
                        var DataSourceConstructor = require(sourceOpt.module);
                        result = new DataSourceConstructor(sourceOpt.options || {});
                     }
                     break;
               }
               return result;
            },
            _getSourceUrl: function() {
               var
                  dataSource = this.getDataSource();
               if (dataSource) {
                  return transHelpers.prepareGetRPCInvocationURL(dataSource.getEndpoint().contract,
                     dataSource.getBinding().read, this._options.filter, BLObject.RETURN_TYPE_ASIS);
               } else {
                  return this._options.defaultImage;
               }
            },
            _bindToolbarEvents: function(){
               this._boundEvents = {
                  onImageMouseEnter: this._onImageMouseEnter.bind(this),
                  onImageMouseLeave: this._onImageMouseLeave.bind(this)
               };
               this._container.mouseenter(this._boundEvents.onImageMouseEnter);
               this._container.mouseleave(this._boundEvents.onImageMouseLeave);
            },
            _onBeginLoad: function(event) {
               var
                  imageInstance = this.getParent(),
                  result = imageInstance._notify('onBeginLoad', this);
               this._showIndicator();
               event.setResult(result);
               if (result !== false) {
                  fcHelpers.toggleLocalIndicator(imageInstance._container, true);
               }
            },
            _onEndLoad: function(event, response) {
               var
                  imageInstance = this.getParent();
               if (response instanceof Error) {
                  fcHelpers.toggleLocalIndicator(imageInstance._container, false);
                  this._hideIndicator();
                  // игнорируем HTTPError офлайна, если они обработаны
                  if (!(response._isOfflineMode && response.processed)){
                      fcHelpers.alert('При загрузке изображения возникла ошибка: ' + error.message);
                  }
                  return imageInstance._onErrorLoad(response, true);
               }
               imageInstance._notify('onEndLoad', response);
               if (imageInstance._options.edit) {
                  imageInstance._showEditDialog('new');
               } else {
                  imageInstance._setImage(imageInstance._getSourceUrl());
                  fcHelpers.toggleLocalIndicator(imageInstance._container, false);
                  this._hideIndicator();
               }
            },
            _onChangeImage: function() {
               var
                  image = this._image.get(0),
                  showButtons = this._imageUrl !== this._options.defaultImage;
               if (this._options.sizeMode === 'stretch') {
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'width': 'height', '');
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'height': 'width', '100%');
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
               if (this._canDisplayImageBar()) {
                  this._imageBar.fadeIn(ANIMATION_DURATION);
               }
            },
            _onImageMouseLeave: function() {
               if (this._canDisplayImageBar()) {
                  this._imageBar.hide();
               }
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
               //Из-за проблем, связанных с кэшированием - перезагружаем картинку специальным хелпером
               cHelpers.reloadImage(this._image, url)
                  .addCallback(function(){
                     self._image.hasClass('ws-hidden') && self._image.removeClass('ws-hidden');
                     self._onChangeImage();
                  })
                  .addErrback(function(){
                     self._onErrorLoad();
                  });
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
               new Dialog({
                  animatedWindows: false,
                  template: 'js!SBIS3.CONTROLS.Image.EditDialog',
                  opener: this,
                  visible: false,
                  minWidth: 390,
                  cssClassName: 'controls-EditDialog__template',
                  componentOptions: cMerge({
                     dataSource: dataSource,
                     filter: filter,
                     cropAspectRatio: this._options.cropAspectRatio,
                     cropAutoSelectionMode: this._options.cropAutoSelectionMode,
                     cropSelection: this._options.cropSelection,
                     handlers: {
                        onBeginSave: function (event, sendObject) {
                           event.setResult(self._notify('onBeginSave', sendObject));
                           self._toggleSaveIndicator(true);
                        },
                        onEndSave: function (event, result) {
                           event.setResult(self._notify('onEndSave', result));
                           self._toggleSaveIndicator(false);
                           self._setImage(self._getSourceUrl());
                        },
                        onOpenError: function(event){
                           fcHelpers.toggleLocalIndicator(self._container, false);
                           cIndicator.hide();
                           fcHelpers.alert('При открытии изображения возникла ошибка');
                           self._onErrorLoad(event, true);
                        }
                     }
                  }, this._options.editConfig),
                  handlers: {
                     onAfterClose: function() {
                        fcHelpers.toggleLocalIndicator(self._container, false);
                     },
                     onBeforeControlsLoad: function() {
                        cIndicator.setMessage('Открытие диалога редактирования...');
                     },
                     onAfterShow: function() {
                        cIndicator.hide();
                     }
                  }
               });
            },
            /**
             * Показать/скрыть индикатор сохранения изображения
             */
            _toggleSaveIndicator: function(state) {
               if (state) {
                  if (!this._saveIndicator) {
                     this._saveIndicator = new LoadingIndicator({
                        'message': rk('Сохранение'),
                        'name': 'ws-load-indicator'
                     });
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
            _uploadImage: function(originalEvent) {
               if (!this.getDataSource()) {
                  return;
               }
               this._getFileLoader().addCallback(function (loader){
                  loader.selectFile(originalEvent, false);
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
               fcHelpers.toggleLocalIndicator(this.getContainer(), true);
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
                     new BLObject(dataSource.getEndpoint().contract)
                        .call(dataSource.getBinding().destroy, sendFilter, BLObject.RETURN_TYPE_ASIS)
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
                        }.bind(this));
                     } else {
                        callDestroy(imageResetResult);
                     }
                  }
               }
            },
            /* ------------------------------------------------------------
               Блок обработчиков кнопок imageBar
               ------------------------------------------------------------ */
            _buttonUploadClick: function(event, originalEvent) {
               this.sendCommand('uploadImage', originalEvent);
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

                  //todo Удалить, временная опция для поддержки смены логотипа компании
                  var self = this;
                  if (this._fileLoader) {
                     this._fileLoader.setMethod(
                           (self._options.linkedObject || dataSource.getEndpoint().contract) +
                           '.' + dataSource.getBinding().create
                     );
                  }

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

            _getFileLoader: function() {
               return this._createFileLoader();
            },

            /**
             * Создание загрузчика файлов
             * @private
             */
            _createFileLoader: function() {
               if (this._fileLoader) {
                  return Deferred.success(this._fileLoader);
               }

               //NB! Вероятно хотим отредактировать.
               // Webkit не хочет открывать отрабатывать клик, если элемент создан из не загруженного скрипта
               var self = this;
               var cont = $('<div class="controls-image__file-loader"></div>');
               self.getContainer().append(cont);
               self._fileLoader = new FileLoader({
                  extensions: ['image'],
                  element: cont,
                  name: 'FileLoader',
                  parent: self,
                  showIndicator: false,
                  handlers: {
                     onLoadStarted: self._onBeginLoad,
                     onLoaded: self._onEndLoad
                  }
               });

               //todo Удалить, временная опция для поддержки смены логотипа компании
               var dataSource = self.getDataSource();
               if (dataSource) {
                  self._fileLoader.setMethod((
                     self._options.linkedObject || dataSource.getEndpoint().contract) +
                     '.' + dataSource.getBinding().create
                  );
               }

               return Deferred.success(self._fileLoader)
            }
         });

      return Image;
   });
