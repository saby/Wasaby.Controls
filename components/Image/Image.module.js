/**
 * Created by ps.borisov on 30.09.2015.
 */
define('js!SBIS3.CONTROLS.Image',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.Data.Source.SbisService',
      'html!SBIS3.CONTROLS.Image',
      'js!SBIS3.CORE.FileLoader',
      'js!SBIS3.CORE.Dialog',
      'js!SBIS3.CONTROLS.Link'
   ], function(CompoundControl, SbisService, dotTplFn, FileLoader, Dialog) {
      'use strict';
      var
         //Продолжительность анимации при отображения панели изображения
         ANIMATION_DURATION = 300,
         /**
          * Контрол "Изображение". Позволяет отображать и редактировать изображение
          * @class SBIS3.CONTROLS.Image
          * @extends $ws.proto.CompoundControl
          * @public
          * @control
          * @category Decorate
          * @ignoreOptions validators
          * @initial
          * <component data-component='SBIS3.CONTROLS.Image' style='width: 100px; height: 100px'>
          * </component>
          */
         Image = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Image.prototype */{
            /**
             * @event onBeginLoad Возникает перед началом загрузки изображения
             * <wiTag group="Загрузка изображения">
             * — Обработка результата:
             * False – отмена загрузки файла.
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @example
             * <pre>
             *    Image.subscribe('onBeginLoad', function(event){
             *       event.setResult(false); // Отменим загрузку изображения
             *    });
             * </pre>
             */
            /**
             * @event onEndLoad Возникает по завершению загружки изображения
             * <wiTag group="Загрузка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @example
             * <pre>
             *    Image.subscribe('onEndLoad', function(event) {
             *       $ws.helpers.alert('Изображение загружено.');
             *    });
             * </pre>
             */
            /**
             * @event onErrorLoad Возникает при ошибке загрузки изображения
             * <wiTag group="Загрузка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @example
             * <pre>
             *    Image.subscribe('onErrorLoad', function(event) {
             *       $ws.helpers.alert('Произошла ошибка при загрузке изображения.');
             *    });
             * </pre>
             */
            /**
             * @event onChangeImage Возникает при смене изображения
             * <wiTag group="Загрузка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @param {String} image Выбранное изображение
             * @example
             * <pre>
             *    Image.subscribe('onChangeImage', function(event, image) {
             *       $ws.helpers.alert('Изображение обновлено на ' + image);
             *    });
             * </pre>
             */
             /**
             * @event onResetImage Возникает при сбросе изображения
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @example
             * <pre>
             *    Image.subscribe('onResetImage', function(event) {
             *       var
             *          deferred = new $ws.proto.Deferred();
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
             */
            /**
             * @event onShowEdit Возникает при отображении диалога редактирования изображения
             * <wiTag group="Обрезка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             */
            /**
             * @event onBeginSave Возникает при сохранении изображения
             * Позволяет динамически формировать параметры обрезки изображения
             * <wiTag group="Обрезка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             * @param {Object} sendObject Параметры обрезки изображения
             * @example
             * <pre>
             * onBeginSave: function(event, filter) {
             *    delete filter.realHeight;
             *    delete filter.realWidth;
             *    event.setResult(filter);
             * }
             * </pre>
             */
            /**
             * @event onEndSave Возникает после обрезки изображения
             * <wiTag group="Обрезка изображения">
             * @param {$ws.proto.EventObject} eventObject Дескриптор события описание в классе $ws.proto.Abstract
             */
            _dotTplFn : dotTplFn,
            $protected: {
               _options: {
                  /**
                   * @cfg {Boolean} Использовать панель работы с изображением
                   * @example
                   * <pre>
                   *     <option name="imageBar">true</option>
                   * </pre>
                   */
                  imageBar: true,
                  /**
                   * @cfg {Boolean} Включить режим обрезки изображения.
                   * Диалог обрезки изображения отображается при загрузке нового изображения и при нажатии на кнопку редактирования изображения
                   * @example
                   * <pre>
                   *    <option name="enabled">true</option>
                   * </pre>
                   */
                  edit: false,
                  /**
                   * @cfg {Object} Параметры диалога редактирования изображения
                   * @example
                   * <pre>
                   *    <option name="editConfig">
                   *       <option name="title">Редактирование фото</option>
                   *    </option>
                   * </pre>
                   * @translatable title
                   */
                  editConfig: {
                     title: 'Редактирование изображения'
                  },
                  /**
                   * @cfg {Number} Соотношение сторон в выделяемой области
                   * @example
                   * <pre>
                   *    <option name="cropAspectRatio">0.75</option>
                   * </pre>
                   */
                  cropAspectRatio: undefined,
                  /**
                   * @cfg {Boolean} Режим автоматического маскимального расширения и центрирования области выделения
                   * Если установлено в false - выделение будет установлено в соотстветствии с параметром cropSelection
                   * @example
                   * <pre>
                   *     <option name="cropAutoSelectionMode">true</option>
                   * </pre>
                   */
                  cropAutoSelectionMode: true,
                  /**
                   * @cfg {Array} Координаты начального выделения
                   * @example
                   * <pre>
                   *     <options name="cropSelection" type="array">
                   *        <option>50</option>
                   *        <option>50</option>
                   *        <option>200</option>
                   *        <option>200</option>
                   *     </options>
                   * </pre>
                   */
                  cropSelection: undefined,
                  /**
                   * @cfg {String} Указывает способ отображения изображения в контейнере.
                   * @variant normal Изображение размещается в верхнем левом углу. Изображение располагается в центре, если размер контейнера больше, чем размер изображения.
                   * @variant stretch Изображение вытягивается или сужается, чтобы в точности соответствовать размеру контейнера.
                   * @example
                   * <pre>
                   *     <option name="stretch">true</option>
                   * </pre>
                   */
                  sizeMode: 'normal',
                  /**
                   * @cfg {String} Изображение, используемое по умолчанию
                   * @example
                   * <pre>
                   *     <option name="defaultImage">/sbis3-controls/components/Image/resources/default-image.png</option>
                   * </pre>
                   */
                  defaultImage: $ws.helpers.processImagePath('js!SBIS3.CONTROLS.Image/resources/default-image.png'),
                  /**
                   * @cfg {Object} Связанный источник данных
                   */
                  dataSource: undefined,
                  /**
                   * @cfg {Object} Фильтр данных
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
               _boundEvents: undefined,
               _firstLoaded: false
            },
            $constructor: function() {
               this._publish('onBeginLoad', 'onEndLoad', 'onErrorLoad', 'onChangeImage', 'onResetImage', 'onShowEdit', 'onBeginSave', 'onEndSave');
               $ws.single.CommandDispatcher.declareCommand(this, 'uploadImage', this._uploadImage);
               $ws.single.CommandDispatcher.declareCommand(this, 'editImage', this._editImage);
               $ws.single.CommandDispatcher.declareCommand(this, 'resetImage', this._resetImage);
               if (this._options.imageBar) {
                  this._imageBar = this._container.find('.controls-image__image-bar');
               }
               this._image = this._container.find('.controls-image__image');
            },
            init: function() {
               var
                  dataSource = this.getDataSource();
                Image.superclass.init.call(this);
               //Находим компоненты, необходимые для работы (если нужно)
               if (this._options.imageBar) {
                  this._buttonEdit = this.getChildControlByName('ButtonEdit');
                  this._buttonReset = this.getChildControlByName('ButtonReset');
                  this._fileLoader = this.getChildControlByName('FileLoader');
                  //todo Удалить, временная опция для поддержки смены логотипа компании
                  if (dataSource) {
                     this._fileLoader.setMethod((this._options.linkedObject || dataSource.getResource()) + '.' + dataSource.getCreateMethodName());
                  }
                  this._bindEvens();
               }
               this.reload();
            },
            /* ------------------------------------------------------------
               Блок публичных методов
               ------------------------------------------------------------ */
            /**
             * Метод перезагрузки данных.
             */
            reload: function() {
               var
                  dataSource = this.getDataSource();
               if (dataSource) {
                  this._setImage($ws.helpers.prepareGetRPCInvocationURL(dataSource.getResource(),
                     dataSource.getReadMethodName(), this._options.filter, $ws.proto.BLObject.RETURN_TYPE_ASIS));
               } else {
                  this._setImage(this._options.defaultImage);
               }
            },
            /**
             * Установить способ отображения изображения в контейнере
             * @param {String} Способ отображения
             */
            setSizeMode: function(sizeMode, noReload) {
               this._options.sizeMode = sizeMode;
               if (!noReload) {
                  this.reload();
               }
            },
            /**
             * Получить текущий способ отображения изображения в контейнере
             * @returns {String}
             */
            getSizeMode: function() {
               return this._options.sizeMode;
            },
            /* ------------------------------------------------------------
               Блок приватных методов
               ------------------------------------------------------------ */
            _bindEvens: function() {
               this._boundEvents = {
                  onImageMouseEnter: this._onImageMouseEnter.bind(this),
                  onImageMouseLeave: this._onImageMouseLeave.bind(this),
                  onImageBarMouseLeave: this._onImageBarMouseLeave.bind(this),
                  onChangeImage: this._onChangeImage.bind(this),
                  onErrorLoad: this._onErrorLoad.bind(this)
               };
               this._image.mouseenter(this._boundEvents.onImageMouseEnter);
               this._image.mouseleave(this._boundEvents.onImageMouseLeave);
               this._imageBar.mouseleave(this._boundEvents.onImageBarMouseLeave);
               this._image.load(this._boundEvents.onChangeImage);
               this._image.error(this._boundEvents.onErrorLoad);
            },
            _onBeginLoad: function(event) {
               var
                  imageInstance = this.getParent(),
                  result = imageInstance._notify('onBeginLoad', this);
               event.setResult(result);
               if (result !== false) {
                  $ws.helpers.toggleLocalIndicator(imageInstance._container, true);
               }
            },
            _onEndLoad: function(event, response) {
               var
                  imageInstance = this.getParent();
               if (response.hasOwnProperty('error')) {
                  $ws.helpers.toggleLocalIndicator(imageInstance._container, false);
                  imageInstance._boundEvents.onErrorLoad(response.error);
               } else {
                  imageInstance._notify('onEndLoad');
                  if (imageInstance._options.edit) {
                     imageInstance._showEditDialog('new');
                  } else {
                     imageInstance.reload();
                     $ws.helpers.toggleLocalIndicator(imageInstance._container, false);
                  }
               }
            },
            _onChangeImage: function() {
               var
                  image = this._image.get(0),
                  showButtons = this._imageUrl !== this._options.defaultImage;
               if (this._options.sizeMode === 'stretch') {
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'height': 'width', '100%');
               }
               //По готовности изображения пересчитываем высоту image-bar (даже если его не нужно показывать - потом пригодится!)
               this._recalculateImageBar();
               if (this._options.imageBar) {
                  this._buttonReset.toggle(showButtons);
                  this._buttonEdit.toggle(this._options.edit && showButtons);
               }
               if (!this._firstLoaded) {
                  this._firstLoaded = true;
               } else {
                  this._notify('onChangeImage', this._imageUrl);
               }
            },
            _onErrorLoad: function(error) {
               this._notify('onErrorLoad', error);
               if (this._imageUrl !== this._options.defaultImage) {
                  this._setImage(this._options.defaultImage);
               }
            },
            _onImageMouseEnter: function() {
               if (this._canDisplayImageBar()) {
                  this._imageBar.fadeIn(ANIMATION_DURATION);
               }
            },
            _onImageMouseLeave: function(event) {
               if (this._canDisplayImageBar() && event.relatedTarget !== this._imageBar[0]) {
                  this._imageBar.hide();
               }
            },
            _onImageBarMouseLeave: function(event) {
               if (this._canDisplayImageBar() && event.relatedTarget !== this._image[0]) {
                  this._imageBar.hide();
               }
            },
            _canDisplayImageBar: function() {
               return this.isEnabled();
            },
            _setImage: function(url) {
               //Из-за проблем, связанных с кэшированием - перезагружаем картинку специальным хелпером
               $ws.helpers.reloadImage(this._image, url, this._boundEvents.onErrorLoad);
               this._imageUrl = url;
            },
            _recalculateImageBar: function(){
               var
                  position =  this._image.position();
               this._imageBar.css({
                  height:  this._image.height(),
                  width:  this._image.width(),
                  left: position.left,
                  top: position.top
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
                  template: 'js!SBIS3.CONTROLS.Image.EditDialog',
                  opener: this,
                  visible: false,
                  minWidth: 315,
                  componentOptions: $ws.core.merge({
                     dataSource: dataSource,
                     filter: filter,
                     cropAspectRatio: this._options.cropAspectRatio,
                     cropAutoSelectionMode: this._options.cropAutoSelectionMode,
                     cropSelection: this._options.cropSelection,
                     handlers: {
                        onBeginSave: function (event, sendObject) {
                           event.setResult(self._notify('onBeginSave', sendObject));
                        },
                        onEndSave: function (event, result) {
                           event.setResult(self._notify('onEndSave', result));
                           self.reload();
                        }
                     }
                  }, this._options.editConfig),
                  handlers: {
                     onAfterClose: function() {
                        $ws.helpers.toggleLocalIndicator(self._container, false);
                     }
                  }
               });
            },
            /* ------------------------------------------------------------
               Блок обработчиков команд
               ------------------------------------------------------------ */
            _uploadImage: function(originalEvent) {
               if (this.getDataSource()) {
                  this._fileLoader.selectFile(originalEvent, false);
               }
            },
            _editImage: function() {
               $ws.helpers.toggleLocalIndicator(this.getContainer(), true);
               this._showEditDialog('current');
            },
            _resetImage: function() {
               var
                  self = this,
                  imageResetResult = this._notify('onResetImage'),
                  callDestroy = function(filter) {
                     var
                        dataSource = self.getDataSource(),
                        sendFilter = filter && Object.prototype.toString.call(filter) === '[object Object]' ? filter : self.getFilter();
                     new $ws.proto.BLObject(dataSource.getResource())
                        .call(dataSource.getDestroyMethodName(), sendFilter, $ws.proto.BLObject.RETURN_TYPE_ASIS)
                        .addBoth(function() {
                           self._setImage(self._options.defaultImage);
                        });
                  };
               if (imageResetResult !== false) {
                  if (imageResetResult instanceof $ws.proto.Deferred) {
                     imageResetResult.addCallback(function(result) {
                        if (result !== false) {
                           callDestroy(result);
                        }
                     }.bind(this));
                  } else {
                     callDestroy(imageResetResult);
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
             * Установить источник данных
             * @param {Object} dataSource
             * @param {Boolean} noReload установить фильтр без перезагрузки данных
             */
            setDataSource: function(dataSource, noReload) {
               if (dataSource instanceof SbisService) {
                  this._options.dataSource = dataSource;
                  if (this._options.imageBar) {
                     //todo Удалить, временная опция для поддержки смены логотипа компании
                     this._fileLoader.setMethod((this._options.linkedObject || dataSource.getResource()) + '.' + dataSource.getCreateMethodName());
                  }
                  if (!noReload) {
                     this.reload();
                  }
               }
            },
            /**
             * Получить текущий источник данных
             * @returns {Object}
             */
            getDataSource: function() {
               return this._options.dataSource;
            },
            /**
             * Установить фильтр
             * @param {Object} filter
             * @param {Boolean} noReload установить фильтр без перезагрузки данных
             */
            setFilter: function(filter, noReload) {
               this._options.filter = filter;
               if (!noReload) {
                  this.reload();
               }
            },
            /**
             * Получить текущий фильтр
             * @returns {Object}
             */
            getFilter: function() {
               return this._options.filter;
            }
         });
      return Image;
   });
