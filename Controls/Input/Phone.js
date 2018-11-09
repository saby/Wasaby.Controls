define('Controls/Input/Phone',
   [
      'Core/Control',
      'Controls/Utils/tmplNotify',
      'Controls/Input/Phone/ViewModel',
      'wml!Controls/Input/Phone/Phone'
   ],
   function(Control, tmplNotify, ViewModel, template) {

      'use strict';

      /**
       * A component for entering a phone number. Depending on the characters you enter, the phone number format changes.
       * This behavior is described in the {@link http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html standard}.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Phone
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputTag
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Phone/Phone
       *
       * @author Колесова П.С.
       */

      var Phone = Control.extend({
         _template: template,

         _viewModel: null,

         _firstClickActivateMode: true,
         _notifyHandler: tmplNotify,

         _beforeMount: function(options) {
            this._viewModel = new ViewModel({
               value: options.value
            });
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.value !== newOptions.value) {
               this._viewModel.updateOptions({
                  value: newOptions.value
               });
            }
         },

         _deactivatedHandler: function() {
            this._firstClickActivateMode = true;
         },

         _clickHandler: function() {
            /**
             * If we first clicked in the field, after deactivation, the user did not select anything
             * and the mask is not completely filled, then you need to move the cursor to the end.
             */
            if (!this._firstClickActivateMode) {
               return;
            }

            var input = this._children.input;

            if (!this._viewModel.isFilled() && input.selectionStart === input.selectionEnd) {
               var position = this._viewModel.getDisplayValue().length;

               input.selectionStart = position;
               input.selectionEnd = position;
            }

            this._firstClickActivateMode = false;
         }
      });

      Phone.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false
         };
      };

      return Phone;
   }
);
