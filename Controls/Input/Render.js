define('Controls/Input/Render',
   [
      'Core/Control',
      'Controls/Input/resources/RenderHelper',

      'wml!Controls/Input/Render/Render'
   ],
   function(Control, RenderHelper, template) {

      'use strict';

      var Render = Control.extend({
         _template: template,

         _inputHandler: function(event) {
            var model = this._options.viewModel;
            var value = model.displayValue;
            var selection = model.selection;
            var newValue = event.target.value;
            var position = event.target.selectionEnd;

            /**
             * У android есть баг/фича: при включённом spellcheck удаление последнего символа в textarea возвращает
             * inputType == 'insertCompositionText', вместо 'deleteContentBackward'.
             * Соответственно доверять ему мы не можем и нужно вызвать метод RenderHelper.getInputType
             */
            var inputType = event.nativeEvent.inputType && event.nativeEvent.inputType !== 'insertCompositionText'
               ? RenderHelper.getAdaptiveInputType(event.nativeEvent.inputType, selection)
               : RenderHelper.getInputType(value, newValue, position, selection);

            var splitValue = RenderHelper.getSplitInputValue(value, newValue, position, selection, inputType);

            if (model.handleInput(splitValue, inputType)) {
               this._notify('valueChanged', model.value, model.displayValue);
            }

            event.target.value = value;
            event.target.selectionStart = selection.start;
            event.target.selectionEnd = selection.end;
         },

         _inputCompletedHandler: function() {
            var model = this._options.viewModel;

            this._notify('inputCompleted', [model.value, model.displayValue]);
         },

         _isShowPlaceholder: function() {
            return !(this._options.viewModel.displayValue || this._options.readOnly);
         }
      });

      return Render;
   }
);
