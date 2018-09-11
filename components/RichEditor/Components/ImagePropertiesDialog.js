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
            this._imageWidth.setValue(size.width, undefined, !size.width);
            this._imageWidth.setTooltip(pixelSize.width);
            this._imageHeight.setValue(size.height, undefined, !size.height);
            this._imageHeight.setTooltip(pixelSize.height);
            this._valueType.setValue(isPercents ? 'per' : 'pix');
         }.bind(this));

         this.subscribeTo(this._applyButton, 'onActivated', function () {
            if (this._imageWidth.validate() && this._imageHeight.validate()) {
               this._options.result.callback({
                  width: this._imageWidth.getValue(),
                  height: this._imageHeight.getValue(),
                  valueType: this._valueType.getValue()
               });
               this._dialog.close();
            }
         }.bind(this));

         this.subscribeTo(this._imageWidth, 'onChange', this._onSizeChanged.bind(this, true));

         this.subscribeTo(this._imageHeight, 'onChange', this._onSizeChanged.bind(this, false));

         this.subscribeTo(this._valueType, 'onChange', function () {
            var options = this._options;
            var size;
            if (this._isPercents()) {
               var percentValue = this._getInitialPercentValue();
               size = {width:percentValue, height:percentValue};
            }
            else {
               size = options.pixelSize;
            }
            this._imageWidth.setValue(size.width);
            this._imageHeight.setValue(size.height);
         }.bind(this));
      },

      _onSizeChanged: function (useWidth) {
         var primary = useWidth ? this._imageWidth : this._imageHeight;
         var secondary = useWidth ? this._imageHeight : this._imageWidth;
         var value = primary.getValue();
         if (this._isPercents()) {
            if (100 < value) {
               value = 100;
               primary.setValue(value, undefined, false);
            }
            secondary.setValue(value, undefined, !value);
         }
         else {
            var options = this._options;
            var naturalSize = options.naturalSize;
            var aspect = useWidth ? naturalSize.height/naturalSize.width : naturalSize.width/naturalSize.height;
            var maxValue = useWidth ? options.editorWidth : options.editorWidth/aspect;
            if (maxValue < value) {
               value = maxValue;
               primary.setValue(value, undefined, false);
            }
            secondary.setValue(value ? value*aspect : null, undefined, !value);
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

      _isPercents: function () {
         return this._valueType.getValue() === 'per';
      }
   });

   moduleClass.title = rk('Свойства');
   moduleClass.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":260,"height":84};

   return moduleClass;
});