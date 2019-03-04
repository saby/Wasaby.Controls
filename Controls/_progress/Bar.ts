import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_progress/Bar/Bar');

var
   Bar = Control.extend({
      _template: template
   });

   Bar.getOptionTypes = function() {
      return {
         value: entity.descriptor(Number).required()
      };
   };

   Bar.getDefaultOptions = function() {
      return {      
         theme: "default",
         value: 0
      };
   };

export default Bar;