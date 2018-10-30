define('Controls/Input/Base',
   [
      'Core/Control',
      'Core/detection',
      'Core/constants',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'Core/helpers/Object/isEqual',
      'Controls/Utils/getTextWidth',
      'Controls/Input/Base/InputUtil',
      'Controls/Input/Base/ViewModel',
      'Controls/Utils/hasHorizontalScroll',

      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/Base/Field',
      'wml!Controls/Input/Base/ReadOnly',

      'css!Controls/Input/Base/Base'
   ],
   function(Control, detection, constants, descriptor, tmplNotify, isEqual, getTextWidth, InputUtil, ViewModel, hasHorizontalScroll, template, fieldTemplate, readOnlyFieldTemplate) {

      'use strict';

      var _private = {

         /**
          * @type {Number} The width of the native cursor in the field measured in pixels.
          * @private
          */
         widthCursor: 1,

         /**
          * @param {Controls/Input/Base} self Control instance.
          * @param {Object} options View model options.
          * @param {String} value View model value.
          */
         initViewModel: function(self, options, value) {
            self._viewModel = new self._viewModel(options, value);
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          */
         initField: function(self) {
            /**
             * When you mount a field in the DOM, the browser can auto fill the field.
             * Then the displayed value in the model will not match the value in the field.
             * In this case, you change the displayed value in the model to the value in the field and
             * must tell the parent that the value in the field has changed.
             */
            if (_private.hasAutoFillField(self)) {
               self._viewModel.displayValue = self._getField().value;
               _private.notifyValueChanged(self);
            }
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
          * @param {Controls/Input/Base} self Control instance.
          * @param {String} value The value to be set in the field.
          * @param {Controls/Input/Base/Types/Selection.typedef} selection The selection to be set in the field.
          */
         updateField: function(self, value, selection) {
            var field = self._getField();

            if (field.value !== value) {
               field.value = value;
            }

            /**
             * After calling setSelectionRange, the select event is fired. Then will come the preservation of the selection in the model.
             * We only need to do this with user actions. Therefore cancel this action through _skipSavingSelectionOnce.
             */
            if (_private.hasSelectionChanged(field, selection)) {
               self._skipSavingSelectionOnce = true;
               field.setSelectionRange(selection.start, selection.end);
            }
         },

         /**
          * Determines whether the value of the selection in the field with the checked value is equal.
          * @param {Node} field Field to check.
          * @param {Controls/Input/Base/Types/Selection.typedef} selection The checked value.
          * @return {boolean}
          */
         hasSelectionChanged: function(field, selection) {
            return field.selectionStart !== selection.start || field.selectionEnd !== selection.end;
         },

         /**
          * Determinate whether the field has been auto fill.
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
          * Determines whether the field in focus.
          * @param {Node} field Field to check.
          * @return {boolean}
          */
         hasFieldFocus: function(field) {
            return document.activeElement === field;
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
          * @param {Controls/Input/Base} self Control instance.
          * @param splitValue Parsed value after user input.
          * @param inputType Type of user input.
          */
         handleInput: function(self, splitValue, inputType) {
            if (self._viewModel.handleInput(splitValue, inputType)) {
               _private.notifyValueChanged(self);
            }
         },

         /**
          * Calculate what type of input was carried out by the user.
          * @param {Controls/Input/Base} self Control instance.
          * @param {String} oldValue The value of the field before user input.
          * @param {String} newValue The value of the field after user input.
          * @param {Number} position The caret position of the field after user input.
          * @param {Controls/Input/Base/Types/Selection.typedef} selection The selection of the field before user input.
          * @param {Controls/Input/Base/Types/NativeInputType.typedef} [nativeInputType] The value of the type property in the handle of the native input event.
          * @return {Controls/Input/Base/Types/InputType.typedef}
          */
         calculateInputType: function(self, oldValue, newValue, position, selection, nativeInputType) {
            var inputType;

            /**
             * On Android if you have enabled spell check and there is a deletion of the last character
             * then the type of event equal insertCompositionText. However, in this case, the event type must be deleteContentBackward.
             * Therefore, we will calculate the event type.
             */
            if (self._isMobileAndroid && nativeInputType === 'insertCompositionText') {
               inputType = InputUtil.getInputType(oldValue, newValue, position, selection);
            } else {
               inputType = nativeInputType
                  ? InputUtil.getAdaptiveInputType(nativeInputType, selection)
                  : InputUtil.getInputType(oldValue, newValue, position, selection);
            }

            return inputType;
         },

         /**
          * @param {String} pastedText
          * @param {String} displayedText
          * @param {Controls/Input/Base/Types/Selection.typedef} selection
          * @return {Controls/Input/Base/Types/SplitValue.typedef}
          */
         calculateSplitValueToPaste: function(pastedText, displayedText, selection) {
            return {
               before: displayedText.substring(0, selection.start),
               insert: pastedText,
               delete: displayedText.substring(selection.start, selection.end),
               after: displayedText.substring(selection.end)
            };
         },

         /**
          * Change the location of the visible area of the field so that the cursor is visible.
          * If the cursor is visible, the location is not changed. Otherwise, the new location will be such that
          * the cursor is visible in the middle of the area.
          * @param {Node} field
          * @param {String} value
          * @param {Controls/Input/Base/Types/Selection.typedef} selection
          */
         recalculateLocationVisibleArea: function(field, value, selection) {
            var textWidthBeforeCursor = getTextWidth(value.substring(0, selection.end));

            var positionCursor = textWidthBeforeCursor + _private.widthCursor;
            var sizeVisibleArea = field.clientWidth;
            var beginningVisibleArea = field.scrollLeft;
            var endingVisibleArea = field.scrollLeft + sizeVisibleArea;

            /**
             * The cursor is visible if its position is between the beginning and the end of the visible area.
             */
            var hasVisibilityCursor = beginningVisibleArea < positionCursor && positionCursor < endingVisibleArea;

            if (!hasVisibilityCursor) {
               field.scrollLeft = positionCursor - sizeVisibleArea / 2;
            }
         }
      };

      /**
       * Base controls that allows user to enter text.
       *
       * @class Controls/Input/Base
       * @extends Core/Control
       *
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputBase
       * @mixes Controls/Input/interface/IInputPlaceholder
       *
       * @private
       * @demo Controls-demo/Input/Base/Base
       *
       * @author Журавлев М.С.
       */

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
         _field: null,

         /**
          * @type {DisplayingControl} Input field in read mode.
          * @private
          */
         _readOnlyField: null,

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

         /**
          * @type {Boolean} Determines whether to skip once save the current field selection to the model.
          * @private
          */
         _skipSavingSelectionOnce: false,

         _ieVersion: detection.IEVersion,

         _isMobileAndroid: detection.isMobileAndroid,

         _beforeMount: function(options) {
            var viewModelOptions = this._getViewModelOptions(options);

            this._initProperties(this);
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
         },

         _afterMount: function() {
            _private.initField(this);
         },

         _beforeUpdate: function(newOptions) {
            var newViewModelOptions = this._getViewModelOptions(newOptions);

            _private.updateViewModel(this, newViewModelOptions, newOptions.value);
         },

         /**
          * @param {Controls/Input/Base} self Control instance.
          * @private
          */
         _initProperties: function() {
            this._field = {
               template: fieldTemplate,
               scope: {
                  calculateValueForTemplate: this._calculateValueForTemplate.bind(this)
               }
            };
            this._readOnlyField = {
               template: readOnlyFieldTemplate,
               scope: {}
            };
         },

         /**
          * Event handler mouseenter.
          * @private
          */
         _mouseEnterHandler: function() {
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
            if (keyCode >= constants.key.end && keyCode <= constants.key.down) {
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
            if (this._skipSavingSelectionOnce) {
               this._skipSavingSelectionOnce = false;
            } else {
               this._viewModel.selection = this._getFieldSelection();
            }
         },

         _inputHandler: function(event) {
            var field = this._getField();
            var model = this._viewModel;
            var value = model.oldDisplayValue;
            var selection = model.oldSelection;
            var newValue = field.value;
            var position = field.selectionEnd;

            var inputType = _private.calculateInputType(this, value, newValue, position, selection, event.nativeEvent.inputType);
            var splitValue = InputUtil.splitValue(value, newValue, position, selection, inputType);

            _private.handleInput(this, splitValue, inputType);

            /**
             * The field is displayed according to the control options. When user enters data,the display changes and does not match the options.
             * Therefore, return the field to the state before entering.
             */
            _private.updateField(this, value, selection);
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

         _focusOutHandler: function() {
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
          * @return {Controls/Input/Base/Types/Selection.typedef}
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
               _private.updateField(this, model.displayValue, model.selection);
               model.changesHaveBeenApplied();

               if (_private.hasFieldFocus(field)) {
                  _private.recalculateLocationVisibleArea(field, model.displayValue, model.selection);
               }
            }

            return model.displayValue;
         },

         paste: function(text) {
            var splitValue = _private.calculateSplitValueToPaste(text, this._viewModel.displayValue, this._viewModel.selection);

            _private.handleInput(this, splitValue, 'insert');
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

            /**
             * https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421
             * placeholder: descriptor(String|Function),
             */
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
