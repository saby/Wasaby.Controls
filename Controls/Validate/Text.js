define('js!Controls/Validate/Text',
   [
      'js!Controls/Validate/Controller',
      'tmpl!Controls/Validate/Text'
   ],
   function(
      Controller,
      template
   ){
      'use strict';

      var Validate = Controller.extend({
         _template: template,

         constructor: function(cfg) {
            Validate.superclass.constructor.call(this, cfg);

            this._focusOutHandler = function() {
               this._shouldValidate = true;
               this._forceUpdate();
            }.bind(this);
            this._cleanValid = function() {
               this.setValidationResult(null);
            }.bind(this);
         },
         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         },
      });
      return Validate;
   }
);