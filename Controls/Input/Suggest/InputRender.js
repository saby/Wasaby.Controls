define('Controls/Input/Suggest/InputRender', [
   'Controls/Input/Text'
], function(InputText) {
   'use strict';

   var SuggestInputRender = InputText.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);
         this._afterFieldWrapper.template = options.afterFieldWrapper;
      }
   });

   return SuggestInputRender;
});
