define('Controls/Input/Base',
   [
      'Core/Control',
      'Core/detection',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Base/InputUtil',
      'Controls/Input/Base/ViewModel',
      'Controls/Utils/hasHorizontalScroll',

      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/Base/Field',
      'wml!Controls/Input/Base/ReadOnly',

      'css!Controls/Input/Base/Base'
   ],
   function(Control, detection, descriptor, tmplNotify, isEqual, InputUtil, ViewModel, hasHorizontalScroll, template, fieldTemplate, readOnlyFieldTemplate) {

      'use strict';

      /**
       * Base controls that allows user to enter text.
       *
       * @class Controls/Input/Base
       * @extends Core/Control
       *
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputBase
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       *
       * @private
       * @demo Controls-demo/Input/Base/Base
       *
       * @author Журавлев М.С.
       */
      var _private = {

         /**
          * @param {Controls/Input/Base} self Control instance.
          * @param {Object} options View model options.
          * @param {String} value View model value.
          */
         initViewModel: function(self, options, value) {
            self._viewModel = new (self._viewModel)(options);

            self._viewModel.value = value;
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          */
         initField: function(self) {
            /**
             * When you mount a field in the DOM, the browser can auto fill the field.
             * In this case, you change the displayed value in the model to the value in the field and
             * must tell the parent that the value in the field has changed.
             */
            if (_private.hasAutoFillField(self)) {
               self._viewModel.displayValue = self._getField().value;
               _private.notifyValueChanged(self);
            }
         },

         initProperties: function(self) {
            self._field.scope = {};
            self._readOnlyField.scope = {};
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          * @param {Object} newOptions New view model options.
          * @param {String} newValue New view model value.
          */
         updateViewModel: function(self, newOptions, newValue) {
            if (!isEqual(self._viewModel.options, newOptions)) {
               self._viewModel.options = newOptions;
            }

            if (self._viewModel.value !== newValue) {
               self._viewModel.value = newValue;
            }
         },

         /**
          *
          * @param {Controls/Input/Base} self Control instance.
          * @return {Boolean}
          */
         hasAutoFillField: function(self) {
            /**
             * In read mode, the field does not exist.
             */
            if (!self._options.readOnly) {
               return !!self._getField().value;
            }
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          */
         notifyValueChanged: function(self) {
            self._notify('valueChanged', [self._viewModel.value, self._viewModel.displayValue]);
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          */
         notifyInputCompleted: function(self) {
            self._notify('inputCompleted', [self._viewModel.value, self._viewModel.displayValue]);
         },

         /**
          * @param {String} pastedText
          * @param {String} displayedText
          * @param {Controls/Input/Base/Types/SelectionInField.typedef} selection
          * @return {Controls/Input/Base/Types/SplitValue.typedef}
          */
         calculateSplitValueToPaste: function(pastedText, displayedText, selection) {
            return {
               before: displayedText.substring(0, selection.start),
               insert: pastedText,
               delete: displayedText.substring(selection.start, selection.end),
               after: displayedText.substring(selection.end)
            };
         }
      };

      var Base = Control.extend({

         /**
          * @type {Function} Control display template.
          * @private
          */
         _template: template,

         /**
          * @type {DisplayingControl} Input field in edit mode.
          * @private
          */
         _field: {
            template: fieldTemplate
         },

         /**
          * @type {DisplayingControl} Input field in read mode.
          * @private
          */
         _readOnlyField: {
            template: readOnlyFieldTemplate
         },

         /**
          * @type {Controls/Input/Base/ViewModel} The display model of the input field.
          * @remark
          * On the prototype lie the constructor of the model. In _beforeMount you need to create an instance.
          * In this way, you can override the model in the inheritors without using an additional variable for the model constructor.
          * @private
          */
         _viewModel: ViewModel,

         /**
          * @type {Controls/Utils/tmplNotify}
          * @private
          */
         _notifyHandler: tmplNotify,

         /**
          * @type {Controls/Utils/hasHorizontalScroll}
          * @private
          */
         _hasHorizontalScroll: hasHorizontalScroll,

         /**
          * @type {String} Text of the tooltip shown when the control is hovered over.
          * @private
          */
         _tooltip: '',

         /**
          * @type {String} Value of the type attribute in the native field.
          * @remark
          * How an native field works varies considerably depending on the value of its {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types type attribute}.
          * @private
          */
         _type: 'text',

         /**
          * @type {String} Value of the name attribute in the native field.
          * @private
          */
         _fieldName: 'input',

         _saveSelection: true,

         _beforeMount: function(options) {
            var viewModelOptions = this._getViewModelOptions(options);

            _private.initProperties(this);
            _private.initViewModel(this, viewModelOptions, options.value);

            /**
             * Browsers use auto-complete to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the <input> tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            if ('name' in options) {
               this._fieldName = options.name;
            }

            this._field.scope._calculateValueForTemplate = this._calculateValueForTemplate.bind(this);
         },

         _afterMount: function() {
            _private.initField(this);
         },

         _beforeUpdate: function(newOptions) {
            var newViewModelOptions = this._getViewModelOptions(newOptions);

            _private.updateViewModel(this, newViewModelOptions, newOptions.value);
         },

         /**
          * Event handler mouseenter.
          * @private
          */
         _mouseenterHandler: function() {
            this._tooltip = this._getTooltip();
         },

         /**
          * Event handler keyup in native field.
          * @param {Object} event Event descriptor.
          * @private
          */
         _keyUpHandler: function(event) {
            var keyCode = event.nativeEvent.keyCode;

            /**
             * Clicking the arrows and keys home, end moves the cursor.
             */
            if (keyCode > 34 && keyCode < 41) {
               this._viewModel.selection = this._getFieldSelection();
            }
         },

         /**
          * Event handler click in native field.
          * @private
          */
         _clickHandler: function() {
            this._viewModel.selection = this._getFieldSelection();
         },

         /**
          * Event handler select in native field.
          * @private
          */
         _selectHandler: function() {
            if (this._saveSelection) {
               this._viewModel.selection = this._getFieldSelection();
            }

            this._saveSelection = true;
         },

         _inputHandler: function(event) {
            var field = this._getField();
            var model = this._viewModel;
            var value = model.oldDisplayValue;
            var selection = model.oldSelection;
            var newValue = field.value;
            var position = field.selectionEnd;
            var inputType;

            /**
             * У android есть баг/фича: при включённом spellcheck удаление последнего символа в textarea возвращает
             * inputType == 'insertCompositionText', вместо 'deleteContentBackward'.
             * Соответственно доверять ему мы не можем и нужно вызвать метод RenderHelper.getInputType
             */
            if (detection.isMobileAndroid && event.nativeEvent.inputType === 'insertCompositionText') {
               inputType = InputUtil.getInputType(value, newValue, position, selection);
            } else {
               inputType = event.nativeEvent.inputType
                  ? InputUtil.getAdaptiveInputType(event.nativeEvent.inputType, selection)
                  : InputUtil.getInputType(value, newValue, position, selection);
            }

            var splitValue = InputUtil.splitValue(value, newValue, position, selection, inputType);

            if (model.handleInput(splitValue, inputType)) {
               this._notify('valueChanged', [model.value, model.displayValue]);
            }

            this._saveSelection = false;
            field.value = value;
            field.setSelectionRange(selection.start, selection.end);
         },

         _changeHandler: function() {
            _private.notifyInputCompleted(this);
         },

         _clickInPlaceholderHandler: function() {
            /**
             * Placeholder is positioned above the input field. When clicking, the cursor should stand in the input field.
             * To do this, we ignore placeholder using the pointer-events property with none value.
             * The property is not supported in ie lower version 11. In ie 11, you sometimes need to switch versions in emulation to work.
             * Therefore, we ourselves will activate the field on click.
             * https://caniuse.com/#search=pointer-events
             */
            if (detection.IEVersion < 12) {
               this.activate();
            }
         },

         _deactivatedHandler: function() {
            this._getField().scrollLeft = 0;
         },

         /**
          * Get the native field.
          * @return {Node}
          * @private
          */
         _getField: function() {
            return this._children[this._fieldName];
         },

         /**
          * Get the beginning and end of the selected portion of the field's text.
          * @return {Controls/Input/Base/Types/SelectionInField.typedef}
          * @private
          */
         _getFieldSelection: function() {
            var field = this._getField();

            return {
               start: field.selectionStart,
               end: field.selectionEnd
            };
         },

         /**
          * Get the options for the view model.
          * @return {Object} View model options.
          * @private
          */
         _getViewModelOptions: function() {
            return {};
         },

         /**
          * Get the tooltip for field.
          * If the displayed value fits in the field, the tooltip option is returned. Otherwise the displayed value is returned.
          * @return {String} Tooltip.
          * @private
          */
         _getTooltip: function() {
            var hasFieldHorizontalScroll = this._hasHorizontalScroll(this._getField());

            return hasFieldHorizontalScroll ? this._viewModel.displayValue : this._options.tooltip;
         },

         _calculateValueForTemplate: function() {
            var model = this._viewModel;
            var field = this._getField();

            if (model.shouldBeChanged && field) {
               this._saveSelection = false;
               if (this._active) {
                  this._children.forFocusing.focus();
                  field.value = model.displayValue;
                  field.setSelectionRange(model.selection.start, model.selection.end);
                  field.focus();
               } else {
                  field.value = model.displayValue;
                  field.setSelectionRange(model.selection.start, model.selection.end);
               }

               this._viewModel.changesHaveBeenApplied();
            }

            return model.displayValue;
         },

         paste: function(text) {
            var model = this._viewModel;
            var splitValue = _private.calculateSplitValueToPaste(text, model.displayValue, model.selection);

            model.handleInput(splitValue, 'insert');

            _private.notifyValueChanged(this);
         }
      });

      Base.getDefaultOptions = function() {
         return {
            size: 'm',
            style: 'info',
            placeholder: '',
            textAlign: 'left',
            fontStyle: 'default'
         };
      };

      Base.getDefaultTypes = function() {
         return {
            value: descriptor(String),
            tooltip: descriptor(String),
            size: descriptor(String).oneOf([
               's',
               'm',
               'l'
            ]),
            fontStyle: descriptor(String).oneOf([
               'default',
               'primary'
            ]),
            textAlign: descriptor(String).oneOf([
               'left',
               'right'
            ]),
            style: descriptor(String).oneOf([
               'info',
               'danger',
               'invalid',
               'primary',
               'success',
               'warning'
            ]),
            tagStyle: descriptor(String).oneOf([
               'info',
               'danger',
               'primary',
               'success',
               'warning',
               'secondary'
            ])
         };
      };

      return Base;
   }
);
