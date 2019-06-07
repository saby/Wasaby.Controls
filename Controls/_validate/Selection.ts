import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/Selection');

/**
 * The control that regulates the validation of his content. Uses in controls that supports the IMultiselect interface.
 * @class Controls/_validate/Selection
 * @extends Controls/_validate/Controller
 * @control
 * @public
 * @author Красильников А.С.
 */

      

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
   
