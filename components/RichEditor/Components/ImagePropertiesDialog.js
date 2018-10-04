define('SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/RichEditor/Components/ImagePropertiesDialog/ImagePropertiesDialog'
], function (CompoundControl, dotTplFn) {


   /**
    * Константа - обрабатываемые события ввода
    * @type {string}
    */
   var INPUT_EVENTS = 'keydown keyup input';

   var ImageSizeDialog = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         /*_options: {
         }*/
         _dialog: null,
         _applyButton: null,
         _sizes: {},
         _inputs: {},
         _valueType: null
      },

      _modifyOptions: function () {
         var options = ImageSizeDialog.superclass._modifyOptions.apply(this, arguments);
         var naturalSize = options.naturalSize;
         options.aspect = naturalSize.height/naturalSize.width;
         options.maxSizes = {
            width: options.editorWidth,
            height: Math.round(options.editorWidth*options.aspect)
         };
         return options;
      },

      init: function () {
         ImageSizeDialog.superclass.init.call(this);

         this._dialog = this.getParent();
         this._applyButton = this.getChildControlByName('applyButton');
         this._sizes.width = this.getChildControlByName('imageWidth');
         this._sizes.height = this.getChildControlByName('imageHeight');
         this._valueType = this.getChildControlByName('valueType');
         this._inputs.width = this._sizes.width.getContainer().find('input');
         this._inputs.height = this._sizes.height.getContainer().find('input');

         var validators = [{
            validator: function () {
               var value = this.getNumericValue();
               return value && value !== 0;
            },
            errorMessage: 'Значение не может быть равно нулю!'
         }];
         this._sizes.width.setValidators(validators);
         this._sizes.height.setValidators(validators);

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
            this._sizes.width.setPlaceholder(isPercents ? '100' : options.maxSizes.width);
            this._sizes.width.setText(size.width);
            this._sizes.width.setTooltip(pixelSize.width);
            this._sizes.height.setPlaceholder(isPercents ? '100' : options.maxSizes.height);
            this._sizes.height.setText(size.height);
            this._sizes.height.setTooltip(pixelSize.height);
            this._valueType.setSelectedKeys([isPercents ? 'per' : 'pix']);

            // Так как события onTextChange и onPropertyChanged происходят в TextBox-е и при вводе пользователем, и при установке значений из кода,
            // то они не подходят. Нужно реагировать только на пользовательский ввод, поэтому подписываемся на события input-ов непосредственно
            // Пользователь может печатать с клавиатуры (keydown/keyup), вставлять текст из клипборда (paste и следом input) или перетащить и бросить текст (drop и следом input)
            this._inputs.width.on(INPUT_EVENTS, this._onWidthChanged = this._onSizeChanged.bind(this, true));
            this._inputs.height.on(INPUT_EVENTS, this._onHeightChanged = this._onSizeChanged.bind(this, false));
         }.bind(this));

         this.subscribeTo(this._applyButton, 'onActivated', function () {
            if (this._sizes.width.validate() && this._sizes.height.validate()) {
               this._options.result.callback({
                  width: this._sizes.width.getNumericValue(),
                  height: this._sizes.height.getNumericValue(),
                  valueType: this._getValueType()
               });
               this._dialog.close();
            }
         }.bind(this));

         this.subscribeTo(this._valueType, 'onSelectedItemsChange', function () {
            var options = this._options;
            var size;
            var isPercents = this._getValueType() === 'per';
            if (isPercents) {
               var percentValue = this._getInitialPercentValue();
               size = {width:percentValue, height:percentValue};
            }
            else {
               size = options.pixelSize;
            }
            this._sizes.width.setPlaceholder(isPercents ? '100' : options.maxSizes.width);
            this._sizes.width.setText(size.width);
            this._sizes.height.setPlaceholder(isPercents ? '100' : options.maxSizes.height);
            this._sizes.height.setText(size.height);
         }.bind(this));
      },

      _onSizeChanged: function (useWidth) {
         var primaryName = useWidth ? 'width' : 'height';
         var primary = this._sizes[primaryName];
         var secondary = this._sizes[useWidth ? 'height' : 'width'];
         var primaryValue = primary.getNumericValue();
         var secondaryValue;
         var needResetPrimary;
         if (this._getValueType() === 'per') {
            needResetPrimary = 100 < primaryValue;
            if (needResetPrimary) {
               primaryValue = 100;
            }
            secondaryValue = primaryValue;
         }
         else {
            var options = this._options;
            var maxValue = options.maxSizes[primaryName];
            needResetPrimary = maxValue < primaryValue;
            if (needResetPrimary) {
               primaryValue = maxValue;
            }
            secondaryValue = Math.round(useWidth ? primaryValue*options.aspect : primaryValue/options.aspect);
         }
         if (needResetPrimary) {
            var input = this._inputs[primaryName];
            setTimeout(function () {
               input.val(primaryValue);
               primary.setText(primaryValue);
            }, 1);
         }
         secondary.setText(secondaryValue || '');
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
         this._inputs.width.off(INPUT_EVENTS, this._onWidthChanged);
         this._inputs.height.off(INPUT_EVENTS, this._onHeightChanged);
         ImageSizeDialog.superclass.destroy.apply(this, arguments);
      }
   });

   ImageSizeDialog.title = rk('Свойства');
   ImageSizeDialog.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":218,"height":84};

   return ImageSizeDialog;
});