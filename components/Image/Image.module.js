/**
 * Created by ps.borisov on 30.09.2015.
 */

define('js!SBIS3.CONTROLS.Image',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Image',
      'js!SBIS3.CORE.FileLoader',
      'js!SBIS3.CORE.Dialog',
      'js!SBIS3.CONTROLS.Link'
   ], function(CompoundControl, dotTplFn, FileLoader, Dialog) {

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
         Image = CompoundControl.extend({/** @lends SBIS3.CONTROLS.Image.prototype */
            _dotTplFn : dotTplFn,
            $protected: {
               _options: {
                  /**
                   * @cfg {String} Текущее изображение
                   * @example
                   * <pre>
                   *     <option name="image">/service/sbis-rpc-service300.dll?id=0&method=CompanyLogo.Read&protocol=3&params=e30%3D</option>
                   * </pre>
                   */
                  image: '',
                  /**
                   * @cfg {Boolean} Использовать панель работы с изображением
                   * @example
                   * <pre>
                   *     <option name="imageBar">true</option>
                   * </pre>
                   */
                  imageBar: true,
                  /**
                   * @cfg {Boolean} При отображении вписывать изображение в контейнер (true) или использовать реальный размер указанного изображения (false)
                   * @example
                   * <pre>
                   *     <option name="expandImageOnContainer">true</option>
                   * </pre>
                   */
                  expandImageOnContainer: true,
                  /**
                   * @cfg {String} Изображение, используемое по умолчанию
                   * @example
                   * <pre>
                   *     <option name="defaultImage">/sbis3-controls/components/Image/resources/default-image.png</option>
                   * </pre>
                   */
                  defaultImage: '/sbis3-controls/components/Image/resources/default-image.png',
                  /**
                   * @cfg {String} Название метода бизнес логики для создания изображения
                   * @example
                   * <pre>
                   *     <option name="createMethodName">DraftCompanyLogo.Create</option>
                   * </pre>
                   */
                  createMethodName: '',
                  /**
                   * @cfg {Function} Функция, выполняемая при возникновении ошибки при работе с загружаемым изображением
                   * @example
                   * onError: function(error) {
                   *    $ws.helpers.alert('Произошла ошибка при загрузке изображения.');
                   * }
                   */
                  onError: undefined,
                  /**
                   * @cfg {Function} Функция, выполняемая при обновлении изображения в компоненте
                   * @deprecated Будет удалено с 3.7.3.20. Используйте подписку на изменение полей контекста.
                   * @example
                   * onImageUpdated: function(newImageURL) {
                   *    $ws.helpers.reloadImage(image, newImageURL);
                   * }
                   */
                  onImageUpdated: undefined, //todo Убрать в 3.7.3.20 и поправить в прикладном коде.
                  /**
                   * @cfg {Object} Опции обрезки изображения
                   */
                  cropOptions: {
                     /**
                      * @cfg {Boolean} Включить режим обрезки изображения.
                      * Диалог обрезки изображения отображается при загрузке нового изображения и при нажатии на кнопку редактирования изображения
                      * @example
                      * <pre>
                      *     <option name="enabled">true</option>
                      * </pre>
                      */
                     enabled: false,
                     /**
                      * @cfg {Function} Функция, выполняемая перед отображением диалога обрезки изображения.
                      * Позволяет динамически задавать опции обрезки (ссылку на изображение, координаты выделения, методы БЛ и т.д.)
                      * @example
                      * onBeforeShowCrop: function(config) {
                      *    config.image = '/service/?id=0&method=DraftCompanyLogo.Read&protocol=3&params=eyLQmNC00J4iOjF9';
                      *    config.cropSelection = [50, 50, 100, 100];
                      *    return config;
                      * }
                      */
                     onBeforeShowCrop: undefined,
                     /**
                      * @cfg {Function} Функция, выполняемая после завершения закрытия диалога обрезки изображения и выполнения самой обрезки.
                      * Позволяет динамически определять адрес, по которому будет хранится обрезанное (итоговое) изображение
                      * @example
                      * onAfterPerformCrop: function(imageUrl) {
                      *    return /service/?id=0&method=DraftCompanyLogo.Read&protocol=3&params=eyLQmNC00J4iOjF9;
                      * }
                      */
                     onAfterPerformCrop: undefined,
                     /**
                      * @cfg {Function} Функция, вызываемая перед началом обрезки изображения.
                      * Позволяет динамически формировать объект, передаваемый в метод бизнес-логики для обрезки изображения
                      * @example
                      * onCropStarted: function(sendObject) {
                      *    delete sendObject.realHeight;
                      *    delete sendObject.realWidth;
                      *    return sendObject;
                      * }
                      */
                     onCropStarted: undefined,
                     /**
                      * @cfg {String} Имя связанного объекта бизнес логики
                      * @example
                      * <pre>
                      *     <option name="linkedObjectName">CompanyLogo</option>
                      * </pre>
                      */
                     linkedObjectName: '',
                     /**
                      * @cfg {String} Название метода для обрезки изображения
                      * @example
                      * <pre>
                      *     <option name="cropMethodName">Apply</option>
                      * </pre>
                      */
                     cropMethodName: '',
                     /**
                      * @cfg {Number} Соотношение сторон в выделяемой области
                      * @example
                      * <pre>
                      *     <option name="cropAspectRatio">0.75</option>
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
                     cropSelection: undefined
                  }
               },
               _imageBar: undefined,
               _imageName: '',
               _image: undefined,
               _fileLoader: undefined,
               _deleteButton:undefined,
               _cropButton: undefined,
               _boundEvents: undefined,
               _firstLoaded: false
            },

            $constructor: function() {
               if (this._options.imageBar) {
                  this._imageBar = this._container.find('.controls-image__image-bar');
               }
               this._image = this._container.find('.controls-image__image');
            },

            init: function() {
               Image.superclass.init.call(this);

               //Устанавливаем начальное изображение
               if (!this._options.image) {
                  this._options.image = this._options.defaultImage;
               }

               //Находим/создаем компоненты, необходимые для работы (если нужно)
               if (this._options.imageBar) {
                  this._cropButton = this.getChildControlByName('ButtonCrop');
                  this._deleteButton = this.getChildControlByName('ButtonDelete');
                  this._fileLoader = this.getChildControlByName('FileLoader');
                  this._bindEvens();
               }
               this.setImage(this._options.image);
            },

            _bindEvens: function() {
               this._boundEvents = {
                  onImageMouseEnter: this._onImageMouseEnter.bind(this),
                  onImageMouseLeave: this._onImageMouseLeave.bind(this),
                  onImageBarMouseLeave: this._onImageBarMouseLeave.bind(this),
                  onImageLoad: this._onImageLoad.bind(this),
                  onImageLoadError: this._onImageLoadError.bind(this)
               };
               this._image.mouseenter(this._boundEvents.onImageMouseEnter);
               this._image.mouseleave(this._boundEvents.onImageMouseLeave);
               this._imageBar.mouseleave(this._boundEvents.onImageBarMouseLeave);
               this._image.load(this._boundEvents.onImageLoad);
               this._image.error(this._boundEvents.onImageLoadError);
            },

            _onChangeFile: function(event, fileName) {
               this.getParent()._imageName = fileName;
            },

            _onStartUpload: function() {
               $ws.helpers.toggleLocalIndicator(this.getParent()._container, true);
            },

            _onFinishUpload: function(event, response) {
               var imageInstance = this.getParent();
               if (response.hasOwnProperty('error')) {
                  $ws.helpers.toggleLocalIndicator(imageInstance._container, false);
                  this._boundEvents.onImageLoadError(response.error);
               } else {
                  if (imageInstance._options.cropOptions.enabled) {
                     $ws.helpers.toggleLocalIndicator(imageInstance._container, false);
                     imageInstance._showCropDialog(imageInstance._options.image, true);
                  } else {
                     imageInstance.setImage(imageInstance._options.image);
                  }
               }
            },

            _onImageLoad: function() {
               var
                  image = this._image.get(0);
               $ws.helpers.toggleLocalIndicator(this._container, false);
               if (this._options.expandImageOnContainer) {
                  this._image.css(image.naturalHeight > image.naturalWidth ? 'height': 'width', '100%');
               }
               //По говтовности изображения пересчитываем высоту image-bar (даже если его не нужно показывать - потом пригодится!)
               this._recalculateImageBar();
               if (!this._firstLoaded) {
                  this._firstLoaded = true;
               } else if (typeof this._options.onImageUpdated === 'function') {
                  this._options.onImageUpdated.call(this, this._options.image);
               }
            },

            _onImageLoadError: function(error) {
               if (typeof this._options.onError === 'function') {
                  this._options.onError(error);
               }
               if (this.getImage() !== this._options.defaultImage) {
                  this.setImage(this._options.defaultImage);
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

            /**
             * Метод возвращает текущее изображение
             * @returns {String} Текущее изображение
             */
            getImage: function() {
               return this._options.image;
            },

            /**
             * Метод устанавливает текущее изображение
             * @param url {String} Путь до устанавливаемого изображения
             */
            setImage: function(url) {
               var
                  showButtons = url && typeof url === 'string' && url !== this._options.defaultImage;
               if (this._options.imageBar) {
                  this._deleteButton.toggle(showButtons);
                  this._cropButton.toggle(this._options.cropOptions.enabled && showButtons);
               }
               if (!showButtons) {
                  url = this._options.defaultImage;
               }
               this._options.image = url;
               //Из-за проблем, связанных с кэшированием - перезагружаем картинку специальным хелпером
               $ws.helpers.reloadImage(this._image, url, this._boundEvents.onImageLoadError);
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

            _showCropDialog: function(image) {
               var
                  cropOptions = {
                     imageUrl: image,
                     cropMethodName: this._options.cropOptions.cropMethodName,
                     linkedObjectName: this._options.cropOptions.linkedObjectName,
                     cropAspectRatio: this._options.cropOptions.cropAspectRatio,
                     cropAutoSelectionMode: this._options.cropOptions.cropAutoSelectionMode,
                     cropSelection: this._options.cropOptions.cropSelection
                  };
               //Позволяем прикладным программистам самостоятельно переопределять опции обрезки изображения
               if (typeof this._options.cropOptions.onBeforeShowCrop === 'function') {
                  cropOptions = this._options.cropOptions.onBeforeShowCrop(cropOptions);
               }
               new Dialog({
                  template: 'js!SBIS3.CONTROLS.Image.CropDialog',
                  opener: this,
                  componentOptions: {
                     imageTitle: this._imageName,
                     cropOptions: cropOptions,
                     onCropStarted: function (sendObject) {
                        return typeof this._options.cropOptions.onCropStarted === 'function' ?
                           this._options.cropOptions.onCropStarted(sendObject) :
                           sendObject;
                     }.bind(this),
                     onCropFinished: function (result) {
                        var imageUrl = cropOptions.imageUrl;
                        if (typeof this._options.cropOptions.onAfterPerformCrop === 'function') {
                           imageUrl = this._options.cropOptions.onAfterPerformCrop(imageUrl);
                        }
                        this.setImage(imageUrl);
                        if (typeof this._options.cropOptions.onCropFinished === 'function') {
                           this._options.cropOptions.onCropFinished(result);
                        }
                     }.bind(this)
                  }
               });
            },

            _cropButtonClick: function() {
               this.getParent()._showCropDialog(this._options.image);
            },

            _uploadButtonClick: function(event, originalEvent) {
               this.getParent()._fileLoader.selectFile(originalEvent, false);
            },

            _deleteButtonClick: function() {
               var
                  imageInstance = this.getParent();
               imageInstance.setImage(imageInstance._options.defaultImage);
            }
      });

      return Image;
   });