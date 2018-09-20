define('SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog/ImagePropertiesDialog'
], function (CompoundControl, dotTplFn) {


   var ImageSizeDialog = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         /*_options: {
         }*/
         _dialog: null,
         _applyButton: null,
         _imageHeight: null,
         _imageWidth: null,
         _valueType: null
      },
      /*$constructor: function () {
      },*/

      init: function () {
         ImageSizeDialog.superclass.init.call(this);

         this._dialog = this.getParent();
         this._applyButton = this.getChildControlByName('applyButton');
         this._imageHeight = this.getChildControlByName('imageHeight');
         this._imageWidth = this.getChildControlByName('imageWidth');
         this._valueType = this.getChildControlByName('valueType');

         var validators = [{
            validator: function () {
               var value = this.getNumericValue();
               return value && value !== 0;
            },
            errorMessage: 'Значение не может быть равно нулю!'
         }];
         this._imageWidth.setValidators(validators);
         this._imageHeight.setValidators(validators);

         this._bindEvents();
      },

      _bindEvents: function () {
         this.subscribeTo(this._dialog, 'onBeforeShow', function () {
            var options = this._options;
            var pixelSize = options.pixelSize;
            var isPercents = this._isInitialUsedPercents();
            var size;
            if (isPercents) {
               var percentValue = this._getInitialPercentValue();
               size = {width:percentValue, height:percentValue};
            }
            else {
               size = pixelSize;
            }
            this._imageWidth.setText(size.width);
            this._imageWidth.setTooltip(pixelSize.width);
            this._imageHeight.setText(size.height);
            this._imageHeight.setTooltip(pixelSize.height);
            this._valueType.setSelectedKeys([isPercents ? 'per' : 'pix']);

            // Так как события onTextChange и onPropertyChanged происходят в TextBox-е и при вводе пользователем, и при установке значений из кода,
            // то они не подходят. Нужно реагировать только на пользовательский ввод, поэтому подписываемся на события input-ов непосредственно
            this._imageWidth.getContainer().find('input').on('keyup paste', this._onWidthChanged = this._onSizeChanged.bind(this, true));
            this._imageHeight.getContainer().find('input').on('keyup paste', this._onHeightChanged = this._onSizeChanged.bind(this, false));
         }.bind(this));

         this.subscribeTo(this._applyButton, 'onActivated', function () {
            if (this._imageWidth.validate() && this._imageHeight.validate()) {
               this._options.result.callback({
                  width: this._imageWidth.getNumericValue(),
                  height: this._imageHeight.getNumericValue(),
                  valueType: this._getValueType()
               });
               this._dialog.close();
            }
         }.bind(this));

         this.subscribeTo(this._valueType, 'onSelectedItemsChange', function () {
            var options = this._options;
            var size;
            if (this._getValueType() === 'per') {
               var percentValue = this._getInitialPercentValue();
               size = {width:percentValue, height:percentValue};
            }
            else {
               size = options.pixelSize;
            }
            this._imageWidth.setText(size.width);
            this._imageHeight.setText(size.height);
         }.bind(this));
      },

      _onSizeChanged: function (useWidth) {
         var primary = useWidth ? this._imageWidth : this._imageHeight;
         var secondary = useWidth ? this._imageHeight : this._imageWidth;
         var value = primary.getNumericValue();
         if (this._getValueType() === 'per') {
            if (100 < value) {
               value = 100;
               setTimeout(primary.setText.bind(primary, value), 1);
            }
            secondary.setText(value);
         }
         else {
            var options = this._options;
            var naturalSize = options.naturalSize;
            var aspect = useWidth ? naturalSize.height/naturalSize.width : naturalSize.width/naturalSize.height;
            var maxValue = useWidth ? options.editorWidth : options.editorWidth/aspect;
            if (maxValue < value) {
               value = maxValue;
               setTimeout(primary.setText.bind(primary, value), 1);
            }
            secondary.setText(value ? Math.round(value*aspect) : '');
         }
      },

      _isInitialUsedPercents: function () {
         var cssSize = this._options.cssSize;
         return cssSize.height.indexOf('%') !== -1 || cssSize.width.indexOf('%') !== -1;
      },

      _getInitialPercentValue: function () {
         var options = this._options;
         if (this._isInitialUsedPercents()) {
            var cssSize = options.cssSize;
            return parseInt(cssSize.height.indexOf('%') !== -1 ? cssSize.height : cssSize.width);
         }
         else {
            return 100*options.pixelSize.width/options.editorWidth;
         }
      },

      _getValueType: function () {
         var keys = this._valueType.getSelectedKeys();
         return keys && keys.length ? keys[0] : undefined;
      },

      destroy: function () {
         ImageSizeDialog.superclass.destroy.apply(this, arguments);

         this._imageWidth.getContainer().find('input').off('keyup paste', this._onWidthChanged);
         this._imageHeight.getContainer().find('input').off('keyup paste', this._onHeightChanged);
      }
   });

   ImageSizeDialog.title = rk('Свойства');
   ImageSizeDialog.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":218,"height":84};

   return ImageSizeDialog;
});