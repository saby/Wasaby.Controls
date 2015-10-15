/**
 * Created by as.avramenko on 02.10.2015.
 */

define('js!SBIS3.CONTROLS.Image.CropDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Image.CropDialog',
   'js!SBIS3.CONTROLS.Image.CropPlugin',
   'js!SBIS3.CONTROLS.Utils.ImageUtil',
   'css!SBIS3.CONTROLS.Image.CropDialog',
   'js!SBIS3.CONTROLS.Button'
], function(CompoundControl, dotTplFn, CropPlugin, ImageUtil) {

   /**
    * SBIS3.CONTROLS.Image.CropDialog
    * @class SBIS3.CONTROLS.Image.CropDialog
    * @extends $ws.proto.CompoundControl
    */
   var CropDialog = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Image.CropDialog.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * Всплывающая подсказка изображения
             */
            imageTitle: '',
            /**
             * @cfg {Object} Опции обрезки изображения
             */
            cropOptions: {},
            /**
             * @cfg {Function} Функция, вызываемая перед началом обрезки изображения
             */
            onCropStarted: undefined,
            /**
             * @cfg {Function} Функция, вызываемая после завершения обрезки изображения
             */
            onCropFinished: undefined
         },
         _image: undefined,
         _cropPlugin: undefined
      },
      $constructor: function() {
         this._image = this._container.find('.controls-CropDialog__image');
         this._image.load(function() {
            this.getTopParent().setSize(ImageUtil.getDimensions(this._image[0]));
            this._cropPlugin = new CropPlugin($ws.core.merge(
               this._options.cropOptions,
               {
                  image: this._image,
                  onCropStarted: function(sendObject) {
                     return typeof this._options.onCropStarted === 'function' ?
                        this._options.onCropStarted(sendObject) :
                        sendObject;
                  }.bind(this),
                  onCropFinished: function(result) {
                     if (typeof this._options.onCropFinished === 'function') {
                        this._options.onCropFinished(result);
                     }
                     this.getTopParent().close();
                  }.bind(this)
               }));
            this._cropPlugin.startCrop();
         }.bind(this));
         $ws.helpers.reloadImage(this._image, this._options.cropOptions.image);
      },

      init: function() {
         CropDialog.superclass.init.call(this);
      },

      onActivateSaveButton: function() {
         this.getParent()._cropPlugin.makeCrop();
      },

      destroy: function() {
         this._cropPlugin.destroy();
         CropDialog.superclass.destroy.apply(this, arguments);
      }
   });

   CropDialog.dimensions = {
      autoWidth: false,
      autoHeight: false,
      resizable: false
   };
   return CropDialog;
});