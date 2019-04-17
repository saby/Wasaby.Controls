import Control = require('Core/Control');
import template = require('wml!Controls/_masterDetail/List/List');
   export = Control.extend({
      _template: template,
      _markedKeyChangedHandler: function(event, key) {
         this._notify('selectedMasterValueChanged', [key], {bubbling: true});
      }
   });

