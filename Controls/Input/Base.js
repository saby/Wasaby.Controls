define('Controls/Input/Base',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'Core/helpers/Object/isEqual',
      'Controls/Input/Base/ViewModel',
      'Controls/Utils/hasHorizontalScroll',

      'wml!Controls/Input/Base/Base',
      'wml!Controls/Input/Base/Field',
      'wml!Controls/Input/Base/ReadOnly'
   ],
   function(Control, descriptor, tmplNotify, isEqual, ViewModel, hasHorizontalScroll, template, fieldTemplate, readOnlyTemplate) {
      
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
         _readOnlyTemplate: readOnlyTemplate,

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
            /**
             * Browsers use autocomplete to the fields with the previously stored name.
             * Therefore, if all of the fields will be one name, then AutoFill will apply to the first field.
             * To avoid this, we will translate the name of the control to the name of the <input> tag.
             * https://habr.com/company/mailru/blog/301840/
             */
            if ('name' in options) {
               this._fieldName = options.name;
            }

            this._viewModel = new (this._viewModel)(this._getViewModelOptions(options));

            this._viewModel.value = options.value;
         },

         _afterMount: function() {
            if (this._options.readOnly) {
               return;
            }

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

            /**
             * If you change from read mode to edit mode, a native field appears that you want to synchronize with the model.
             * The field in DOM will appear in _afterUpdate, so synchronization should be done there.
             */
            if (this._options.readOnly && !newOptions.readOnly) {
               this._shouldBeSyncAfterUpdate = true;
            } else if (!newOptions.readOnly) {
               this._synchronizeFieldWithModel();
            }
         },

         _afterUpdate: function() {
            if (this._shouldBeSyncAfterUpdate) {
               this._shouldBeSyncAfterUpdate = false;

               this._synchronizeFieldWithModel(true);
            }
         },

         /**
          * Event handler mouseenter.
          * @private
          */
         _mouseenterHandler: function() {
            this._tooltip = hasHorizontalScroll(this._getField()) ? this._viewModel.displayValue : this._options.tooltip;
         },

         /**
          * Event handler keyup in native field.
          * @param {Object} event Event descriptor.
          * @private
          */
         _keyUpHandler: function(event) {
            var keyCode = event.nativeEvent.keyCode;

            /**
             * Clicking the arrows moves the cursor.
             */
            if (keyCode > 36 && keyCode < 41) {
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
          * Event handler selection in native field.
          * @private
          */
         _selectionHandler: function() {
            this._viewModel.selection = this._getFieldSelection();
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
          * Synchronize data from the model with the native field.
          * @param {Boolean} [synchronize] Determined whether to perform synchronization regardless of model changes.
          * @variant true Synchronization will occur even if the model has not changed since the last synchronization.
          * @variant false Synchronization will occur only if the model has changed since the last synchronization.
          * @private
          */
         _synchronizeFieldWithModel: function(synchronize) {
            if (this._viewModel.shouldBeChanged || synchronize) {
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
