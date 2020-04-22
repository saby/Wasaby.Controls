import input = require('Controls/input');


   var SuggestInputRender = input.Base.extend({
      _initProperties: function(options) {
         SuggestInputRender.superclass._initProperties.call(this, options);

         this._rightFieldWrapper.template = options.rightFieldWrapper;
         this._field.scope.readOnly = true;

         this._field.scope.controlName = 'ComboBox';
      }
   });

   export = SuggestInputRender;

