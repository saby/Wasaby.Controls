define('Controls/Input/Base',
   [
      'Core/Control',
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
   function(Control, descriptor, tmplNotify, isEqual, InputUtil, ViewModel, hasHorizontalScroll, template, fieldTemplate, readOnlyFieldTemplate) {
      
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
         initViewModel: function(self, options, value) {
            self._viewModel = new (self._viewModel)(options);

            self._viewModel.value = value;
         },

         updateViewModel: function(self, newOptions, value) {
            if (!isEqual(self._viewModel.options, newOptions)) {
               self._viewModel.options = newOptions;
            }

            if (self._viewModel.value !== value) {
               self._viewModel.value = value;
            }
         },

         initField: function(self) {
            /**
             * If there is a value in the field, when mounting, then browser use auto-complete.
             * In this case, you change the displayed value in the model to the value in the field and
             * must tell the parent that the value in the field has changed.
             * In read mode, the field does not exist.
             */
            if (!self._options.readOnly) {
               var fieldValue = self._getField().value;

               if (fieldValue) {
                  self._viewModel.displayValue = fieldValue;
                  _private.notifyValueChanged(self);
               }
            }
         },

         notifyValueChanged: function(self) {
            self._notify('valueChanged', [self._viewModel.value, self._viewModel.displayValue]);
         },

         notifyInputCompleted: function(self) {
            self._notify('inputCompleted', [self._viewModel.value, self._viewModel.displayValue]);
         },

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
          * @type {Function} The template for input field in edit mode.
          * @private
          */
         _fieldTemplate: fieldTemplate,

         /**
          * @type {Function} The template for input field in read mode.
          * @private
          */
         _readOnlyFieldTemplate: readOnlyFieldTemplate,

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

         _beforeMount: function(options) {
            var viewModelOptions = this._getViewModelOptions(options);

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
            this._viewModel.changesHaveBeenApplied();
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
            this._viewModel.selection = this._getFieldSelection();
         },

         _inputHandler: function(event) {
            var field = this._getField();
            var model = this._viewModel;
            var value = model.oldDisplayValue;
            var selection = model.oldSelection;
            var newValue = field.value;
            var position = field.selectionEnd;

            /**
             * У android есть баг/фича: при включённом spellcheck удаление последнего символа в textarea возвращает
             * inputType == 'insertCompositionText', вместо 'deleteContentBackward'.
             * Соответственно доверять ему мы не можем и нужно вызвать метод RenderHelper.getInputType
             */
            var inputType = event.nativeEvent.inputType && event.nativeEvent.inputType !== 'insertCompositionText'
               ? InputUtil.getAdaptiveInputType(event.nativeEvent.inputType, selection)
               : InputUtil.getInputType(value, newValue, position, selection);

            var splitValue = InputUtil.splitValue(value, newValue, position, selection, inputType);

            if (model.handleInput(splitValue, inputType)) {
               this._notify('valueChanged', [model.value, model.displayValue]);
            }

            field.value = model.displayValue;
            field.setSelectionRange(model.selection.start, model.selection.end);
         },

         _changeHandler: function() {
            _private.notifyInputCompleted(this);
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

         paste: function(text) {
            var splitValue = _private.calculateSplitValueToPaste(text, this._viewModel.displayValue, this._viewModel.selection);

            this._viewModel.handleInput(splitValue, 'insert');

            _private.notifyValueChanged(this);
         }
      });
      
      Base.getDefaultOptions = function() {
         return {
            style: 'info',
            textAlign: 'left',
            fontStyle: 'default'
         };
      };
      
      Base.getDefaultTypes = function() {
         return {
            value: descriptor(String),
            tooltip: descriptor(String),
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
