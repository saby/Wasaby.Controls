/**
 * Created by as.avramenko on 02.10.2015.
 */
define('js!SBIS3.CONTROLS.Image.CropPlugin',
   [
      'js!SBIS3.CONTROLS.Data.Source.SbisService',
      "is!browser?js!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min",
      "css!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min"
   ], function(SbisService) {
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
                * @cfg {Object} Связанный источник данных
                */
               dataSource: undefined,
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
               image: undefined
            },
            _cropCoords: undefined,
            _imageProperties: undefined
         },
         $constructor: function () {
            this._publish('onBeginSave', 'onEndSave', 'onChangeCrop');
            if (this._options.cropSelection) {
               this._options.cropSelection = (this._options.cropSelection + '').split(',');
            }
         },
         _storeCropCoords: function(coords) {
            this._cropCoords = coords;
            this._notify('onChangeCrop', coords);
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
               filter,
               dataSource = this.getDataSource(),
               beginCropResult;
            //Если не заданы координаты - выходим и нотифицируем onCropFinished со значением false
            if(!coords || coords.x >= coords.x2 || coords.y >= coords.y2) {
               this._notify('onEndSave', false);
               return false;
            }
            filter = {
               left: coords.x,
               top: coords.y,
               width: coords.w,
               height: coords.h,
               realWidth: this._imageProperties.realWidth,
               realHeight: this._imageProperties.realHeight,
               coefficient: this._imageProperties.coefficient
            };
            beginCropResult = this._notify('onBeginSave', filter);
            //todo Удалить, временная опция для поддержки смены логотипа компании
            if (beginCropResult !== false) {
               if (beginCropResult && beginCropResult.dataSource instanceof SbisService) {
                  dataSource = beginCropResult.dataSource;
                  filter = beginCropResult.filter;
               } else if (beginCropResult) {
                  filter = beginCropResult;
               }
               new $ws.proto.BLObject(dataSource.getResource())
                  .call(dataSource.getUpdateMethodName(), filter, $ws.proto.BLObject.RETURN_TYPE_ASIS).addBoth(function(result) {
                     self.finishCrop();
                     self._notify('onEndSave', result);
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
         },
         /* ------------------------------------------------------------------------------------------------------------------------------------
          todo: Используется для работы с DataSource и Filter. Будет полностью удалено, когда появится базовый миксин для работы с DataSource.
          ------------------------------------------------------------------------------------------------------------------------------------ */
         setDataSource: function(dataSource) {
            if (dataSource instanceof SbisService) {
               this._options.dataSource = dataSource;
            }
         },
         getDataSource: function() {
            return this._options.dataSource;
         }
      });
   return CropPlugin;
});
