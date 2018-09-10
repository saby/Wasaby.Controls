define('Controls/Input/Phone',
   [
      'Core/Control',
      'Controls/Input/Phone/ViewModel',
      'wml!Controls/Input/Mask/Mask'
   ],
   function(Control, ViewModel, template) {

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
       * @author Зайцев А.С.
       */

      var Phone = Control.extend({
         _template: template,

         _viewModel: null,

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

         _focusinHandler: function() {}
      });

      Phone.getDefaultOptions = function() {
         return {
            value: ''
         };
      };
      
      return Phone;
   }
);
