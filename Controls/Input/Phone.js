define('Controls/Input/Phone',
   [
      'Core/Control',
      'Controls/Input/Phone/ViewModel',
      'tmpl!Controls/Input/Mask/Mask'
   ],
   function(Control, ViewModel, template) {

      'use strict';

      /**
       * Phone input.
       *
       * @class Controls/Input/Phone
       * @extends Core/Control
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Phone/Phone
       * @demo Controls-demo/Example/Input/Phone
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

      Phone.getDefaultOptions = function() {
         return {
            value: ''
         };
      };
      
      return Phone;
   }
);
