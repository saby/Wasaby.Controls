import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/Selection');
      

      export = Controller.extend({
         _template: template,
         _deactivatedHandler: function() {
            this._shouldValidate = true;
            this._forceUpdate();
         },
         _selectedKeysChangedHandler: function(event, value) {
            this._notify('selectedKeysChanged', [value]);
            this._cleanValid();
         },

         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
   
