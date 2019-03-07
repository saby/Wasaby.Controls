/// <amd-module name="Controls/_progress/Bar" />
 /**
   * Control that renders progress bar
   * @class Controls/_progress/Bar 
   * @extends Core/Control
   * @author Колесов В.А.
   *
   * @public 
   *
   * @demo Controls-demo/Indicator/ProgressBar/ProgressBar
   *
   * @css @color-ProgressBar__bar Progress bar background color
   * @css @height-ProgressBar_bar Progress bar height
   * @css @color-ProgressBar__progress Progress bar fill color
   */

   /**
   * @name Controls/Indicator/Progress/Bar#value
   * @cfg {Number} Progress in percents (ratio of the filled part)
   */

import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_progress/Bar/Bar');

var
   _private = {
      getWidth: function(val){
        return (val > 0 ? Math.min(val,100)+'%' : '0px');
      }
   },
   Bar = Control.extend({
      _template: template,
      _width: '0px',

      _beforeMount: function(opts){
         this._width = _private.getWidth(opts.value);
      },
      _beforeUpdate: function(opts){
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
         /**
          * @cfg {Number} Progress in percents (ratio of the filled part)
          */
         value: 0
      };
   };

Bar._theme = ['Controls/_progress/progress'];
Bar._private = _private;
export default Bar;