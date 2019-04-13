define('Controls/Input/Suggest/InputRender', [
   'Controls/input'
], function(input) {
   'use strict';

   var SuggestInputRender = input.Text.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);
         this._afterFieldWrapper.template = options.afterFieldWrapper;
      }
   });

   return SuggestInputRender;
});
