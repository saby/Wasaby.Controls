define('Controls/Input/ComboBox/InputRender', [
   'Controls/input'
], function(input) {
   'use strict';

   var SuggestInputRender = input.Base.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);
         
         this._afterFieldWrapper.template = options.afterFieldWrapper;
         this._field.scope.readOnly = true;
      }
   });

   return SuggestInputRender;
});
