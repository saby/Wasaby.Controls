/**
 * Created by as.avramenko on 02.10.2015.
 */

define('js!SBIS3.CONTROLS.Image.CropPlugin',
   [
      "is!browser?js!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min",
      "css!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min"
   ], function() {

      'use strict';

      /**
       * Контрол, позволяющий обрезать произвольное изображение.
       * @class SBIS3.CONTROLS.Image.CropPlugin
       * @extends $ws.proto.Abstract
       * @control
       * @public
       */

      var CropPlugin = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.Image.CropPlugin.prototype */{
         $protected: {
            _options: {
               /**
                * @cfg {Number} Соотношение сторон в выделяемой области
                * @example
                * <pre>
                *     <option name="cropAspectRatio">0.75</option>
                * </pre>
                */
               cropMethodName: '',
               /**
                * @cfg {String} Название метода для обрезки изображения
                * @example
                * <pre>
                *     <option name="cropMethodName">Apply</option>
                * </pre>
                */
               linkedObjectName: '',
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
               cropSelection: undefined,
               /**
                * @cfg {Object} Редактируемое изображение (jQuery-элемент <img/>)
                */
               image: undefined,
               /**
                * @cfg {Function} Функция, вызываемая после изменения выделенного фрагмента изображения
                */
               onCropChange: undefined,
               /**
                * @cfg {Function} Функция, вызываемая перед началом обрезки изображения
                */
               onCropStarted: undefined,
               /**
                * @cfg {Function} Функция, вызываемая после завершения обрезки изображения
                */
               onCropFinished: undefined
            },
            _cropCoords: undefined,
            _imageProperties: undefined
         },

         $constructor: function () {
            if (this._options.cropSelection) {
               this._options.cropSelection = (this._options.cropSelection + '').split(',');
            }
         },

         _storeCropCoords: function(coords) {
            this._cropCoords = coords;
            if (typeof this._options.onCropChange === 'function') {
               this._options.onCropChange(coords);
            }
         },

         /**
          * <wiTag group="Управление">
          * Инициализирует crop, отображается рамка выделения рабочей области
          */
         startCrop: function() {
            var
               jCropObj,
               element,
               $image = this._options.image,
               image = $image.get(0),
               min,
               startSelection = this._options.cropSelection,
               storeCropCoords = this._storeCropCoords.bind(this);
            this._imageProperties = {
               height: $image.height(),
               width: $image.width()
            };
            this._imageProperties.realHeight = image.naturalHeight || image.height || this._imageProperties.height;
            this._imageProperties.realWidth = image.naturalWidth || image.width || this._imageProperties.width;
            this._imageProperties.coefficient = Math.max(this._imageProperties.realHeight / this._imageProperties.height, this._imageProperties.realWidth / this._imageProperties.width);
            if (this._options.cropAutoSelectionMode) {
               min = Math.min(this._imageProperties.width, this._imageProperties.height);
               startSelection = [(this._imageProperties.width - min) / 2, (this._imageProperties.height - min) / 2, min, min];
            }
            jCropObj = {
               aspectRatio: this._options.cropAspectRatio,
               setSelect: startSelection,
               onChange: storeCropCoords,
               onSelect: storeCropCoords
            };
            element = this._options.image.eq(0);
            if($ws._const.browser.isModernIE) {
               jQuery.Jcrop(element[0], jCropObj);
            } else {
               element.Jcrop(jCropObj);
            }
         },

         /**
          * <wiTag group="Управление">
          * Выполняет crop при наличии выделения, загружает измнения на сервер
          * Вызывает методы {@link onCropStarted} и {@link onCropFinished}.
          */
         makeCrop: function() {
            var
               self = this,
               coords = this._cropCoords,
               sendObject, result;

            //Если не заданы координаты - выходим и нотифицируем onCropFinished со значением false
            if(!coords || coords.x >= coords.x2 || coords.y >= coords.y2) {
               if (typeof this._options.onCropFinished === 'function') {
                  this._options.onCropFinished(false);
               }
               return;
            }

            sendObject = {
               left: coords.x,
               top: coords.y,
               width: coords.w,
               height: coords.h,
               realWidth: this._imageProperties.realWidth,
               realHeight: this._imageProperties.realHeight,
               coefficient: this._imageProperties.coefficient
            };

            if (typeof this._options.onCropStarted === 'function') {
               result = this._options.onCropStarted(sendObject);
            }

            if (result !== false) {
               if (result instanceof Object) {
                  sendObject = result;
               }
               new $ws.proto.BLObject(this._options.linkedObjectName)
                  .call(this._options.cropMethodName, sendObject, $ws.proto.BLObject.RETURN_TYPE_ASIS).addBoth(function(result){
                     self.finishCrop();
                     if (typeof self._options.onCropFinished === 'function') {
                        self._options.onCropFinished(result);
                     }
                     return result;
                  });
            }
         },

         /**
          * <wiTag group="Управление">
          * Завершает/отменяет возможность совершения crop'а
          */
         finishCrop: function() {
            this._dropCrop();
         },

         _dropCrop: function() {
            var jCropApi = this._options.image.data('Jcrop');
            if (jCropApi && jCropApi.destroy) {
               jCropApi.destroy();
            }
         },

         destroy: function() {
            this._dropCrop();
         }

      });
   return CropPlugin;
});