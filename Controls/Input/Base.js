define('Controls/Input/Base', 
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Base/ViewModel',
      'Controls/Utils/hasHorizontalScroll',

      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/Base/Field',
      'wml!Controls/Input/Base/ReadOnly'
   ],
   function(Control, descriptor, isEqual, ViewModel, hasHorizontalScroll, template, fieldTemplate, readOnlyTemplate) {
      
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
      var Base = Control.extend({
         _template: template,

         _fieldTemplate: fieldTemplate,

         _readOnlyTemplate: readOnlyTemplate,

         _viewModel: ViewModel,

         /**
          * @type {String} Text of the tooltip shown when the control is hovered over.
          * @private
          */
         _tooltip: '',

         /**
          * @type {String} Value of the type attribute in the native field.
          * @private
          */
         _type: 'text',

         /**
          * @type {String} Value of the name attribute in the native field.
          * @private
          */
         _fieldName: 'input',

         _beforeMount: function(options) {
            /**
             * Browsers use autocomplete to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            if ('name' in options) {
               this._fieldName = options.name;
            }

            this._viewModel = new (this._viewModel)(this._getViewModelOptions(options));

            this._viewModel.value = options.value;
         },

         _afterMount: function() {
            var fieldValue = this._getField().value;

            /**
             * If the browser automatically filled in the field, we believe that value has changed.
             */
            if (fieldValue) {
               this._viewModel.displayValue = fieldValue;
               this._notify('valueChanged', [this._viewModel.value, fieldValue]);
            } else {
               this._synchronizeFieldWithModel();
            }
         },

         _beforeUpdate: function(newOptions) {
            var newViewModelOptions = this._getViewModelOptions(newOptions);

            if (!isEqual(this._viewModel.options, newViewModelOptions)) {
               this._viewModel.options = newViewModelOptions;
            }

            this._viewModel.value = newOptions.value;

            this._synchronizeFieldWithModel();
         },

         _mouseenterHandler: function() {
            this._tooltip = hasHorizontalScroll(this._getField()) ? this._viewModel.displayValue : this._options.tooltip;
         },

         _keyUpHandler: function(event) {
            var keyCode = event.nativeEvent.keyCode;

            /**
             * Clicking the arrows moves the cursor.
             */
            if (keyCode > 36 && keyCode < 41) {
               this._viewModel.selection = this._getFieldSelection();
            }
         },

         _clickHandler: function() {
            this._viewModel.selection = this._getFieldSelection();
         },

         _selectionHandler: function() {
            this._viewModel.selection = this._getFieldSelection();
         },

         _getField: function() {
            return this._children[this._fieldName];
         },

         _getFieldSelection: function() {
            var field = this._getField();
            var selection;

            if (field.selectionStart === field.selectionEnd) {
               selection = field.selectionStart;
            } else {
               selection = {
                  start: field.selectionStart,
                  end: field.selectionEnd
               };
            }

            return selection;
         },

         _getViewModelOptions: function() {
            return {};
         },

         _synchronizeFieldWithModel: function() {
            if (this._viewModel.shouldBeChanged) {
               var field = this._getField();

               field.value = this._viewModel.displayValue;
               field.selectionStart = this._viewModel.selection.start;
               field.selectionEnd = this._viewModel.selection.end;

               this._viewModel.changesHaveBeenApplied();
            }
         },

         paste: function(text) {
            var value = this._viewModel.displayValue;
            var selection = this._viewModel.selection;

            this._viewModel.handleInput({
               before: value.substring(0, selection.start),
               insert: text,
               delete: value.substring(selection.start, selection.end),
               after: value.substring(selection.end)
            }, 'insert');
         }
      });
      
      Base.getDefaultOptions = function() {
         return {
            value: '',
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
