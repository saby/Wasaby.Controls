define('SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog/ImagePropertiesDialog',
   'Deprecated/Controls/Button/Button',
   'Deprecated/Controls/FieldInteger/FieldInteger',
   'Deprecated/Controls/FieldDropdown/FieldDropdown',
   'Deprecated/Controls/FieldLabel/FieldLabel'
], function (CompoundControl, dotTplFn) {


   var moduleClass = CompoundControl.extend({
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
         moduleClass.superclass.init.call(this);

         this._dialog = this.getParent();
         this._applyButton = this.getChildControlByName('applyButton');
         this._imageHeight = this.getChildControlByName('imageHeight');
         this._imageWidth = this.getChildControlByName('imageWidth');
         this._valueType = this.getChildControlByName('valueType');

         var validators = [{
            validator: function () {
               var value = this.getValue();
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
         }.bind(this));

         this.subscribeTo(this._applyButton, 'onActivated', function () {
            if (this._imageWidth.validate() && this._imageHeight.validate()) {
               this._options.result.callback({
                  width: this._imageWidth.getValue(),
                  height: this._imageHeight.getValue(),
                  valueType: this._getValueType()
               });
               this._dialog.close();
            }
         }.bind(this));

         this.subscribeTo(this._dialog, 'onShow', function () {
            this.subscribeTo(this._imageWidth, 'onTextChange', this._onSizeChanged.bind(this, true));
            this.subscribeTo(this._imageHeight, 'onTextChange', this._onSizeChanged.bind(this, false));
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
            this._imageWidth.isSilent = true;
            this._imageWidth.setText(size.width);
            this._imageHeight.isSilent = true;
            this._imageHeight.setText(size.height);
         }.bind(this));
      },

      _onSizeChanged: function (useWidth, evt, val) {
         var primary = useWidth ? this._imageWidth : this._imageHeight;
         var secondary = useWidth ? this._imageHeight : this._imageWidth;
         if (primary.isSilent) {
            primary.isSilent = undefined;
            return;
         }
         var value = primary.getValue();
         if (this._getValueType() === 'per') {
            if (100 < value) {
               value = 100;
               primary.isSilent = true;
               primary.setText(value);
            }
            secondary.isSilent = true;
            secondary.setText(value);
         }
         else {
            var options = this._options;
            var naturalSize = options.naturalSize;
            var aspect = useWidth ? naturalSize.height/naturalSize.width : naturalSize.width/naturalSize.height;
            var maxValue = useWidth ? options.editorWidth : options.editorWidth/aspect;
            if (maxValue < value) {
               value = maxValue;
               primary.isSilent = true;
               primary.setText(value);
            }
            secondary.isSilent = true;
            secondary.setText(value ? value*aspect : null);
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
      }
   });

   moduleClass.title = rk('Свойства');
   moduleClass.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":218,"height":84};

   return moduleClass;
});