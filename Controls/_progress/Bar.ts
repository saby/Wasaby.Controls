import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_progress/Bar/Bar');

var
   _private = {
      getWidth: function(val){
        return val > 0 ? val+'%' : '0px'
      }
   },
   Bar = Control.extend({
      _template: template,
      _width: '0px',

      _beforeMount: function(opts){
         this._width = _private.getWidth(opts.value);
      },
      _beforUpdate: function(opts){
         this._width = _private.getWidth(opts.value);
      },
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