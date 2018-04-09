define('Controls/Input/Phone',
   [
      'Core/Control',
      'Controls/Input/Phone/ViewModel',
      'tmpl!Controls/Input/Mask/Mask'
   ],
   function(Control, ViewModel, template) {

      'use strict';

      /**
       * Поле ввода телефонного номера.
       * @class Controls/Input/Phone
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       */

      var Phone = Control.extend({
         _template: template,

         _viewModel: null,

         constructor: function(options) {
            Phone.superclass.constructor.call(this, options);

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

      return Phone;
   }
);
