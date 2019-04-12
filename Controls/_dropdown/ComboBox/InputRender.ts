import input = require('Controls/input');
   

   var SuggestInputRender = input.Base.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);
         
         this._afterFieldWrapper.template = options.afterFieldWrapper;
         this._field.scope.readOnly = true;
      }
   });

   export = SuggestInputRender;

