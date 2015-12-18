/**
 * Created by as.avramenko on 02.10.2015.
 */
define('js!SBIS3.CONTROLS.Image.EditDialog', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Image.EditDialog',
   'js!SBIS3.CONTROLS.Image.CropPlugin',
   'js!SBIS3.CONTROLS.Utils.ImageUtil',
   'js!SBIS3.CONTROLS.Button'
], function(CompoundControl, dotTplFn, CropPlugin, ImageUtil) {
   /**
    * SBIS3.CONTROLS.Image.EditDialog
    * @class SBIS3.CONTROLS.Image.EditDialog
    * @extends $ws.proto.CompoundControl
    */
   var EditDialog = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Image.EditDialog.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Object} Связанный источник данных
             */
            dataSource: undefined,
            /**
             * @cfg {Object} Фильтр данных
             */
            filter: {},
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
         },
         _image: undefined,
         _imageUrl: undefined,
         _cropPlugin: undefined
      },
      $constructor: function() {
         var
            self = this;
         this._publish('onBeginSave', 'onEndSave');
         this._image = this._container.find('.controls-EditDialog__image');
         this._image.load(function() {
            this.getTopParent().setSize(ImageUtil.getDimensions(this._image[0]));
            this._cropPlugin = new CropPlugin(
               {
                  dataSource: this._options.dataSource,
                  cropAspectRatio: this._options.cropAspectRatio,
                  cropAutoSelectionMode: this._options.cropAutoSelectionMode,
                  cropSelection: this._options.cropSelection,
                  image: this._image,
                  handlers: {
                     onBeginSave: function(event, sendObject) {
                        event.setResult(self._notify('onBeginSave', sendObject));
                     },
                     onEndSave: function(event, result) {
                        event.setResult(self._notify('onEndSave', result));
                        self.sendCommand('close');
                     }
                  }
               });
            this._cropPlugin.startCrop();
         }.bind(this));
         this._imageUrl = $ws.helpers.prepareGetRPCInvocationURL(this._options.dataSource.getResource(),
            this._options.dataSource.getReadMethodName(), this._options.filter, $ws.proto.BLObject.RETURN_TYPE_ASIS);
         $ws.helpers.reloadImage(this._image, this._imageUrl);
      },
      onActivateSaveButton: function() {
         this.getParent()._cropPlugin.makeCrop();
      },
      destroy: function() {
         if (this._cropPlugin) {
            this._cropPlugin.destroy();
         }
         EditDialog.superclass.destroy.apply(this, arguments);
      }
   });
   EditDialog.dimensions = {
      autoWidth: false,
      autoHeight: false,
      resizable: false
   };
   return EditDialog;
});