import Control = require('Core/Control');
import entity = require('Types/entity');
import env = require('Env/Env');
import template = require('wml!Controls/_progress/Bar/Bar');

var
   _private = {
      getWidth: function(val) {
         if (val < 0 || val > 100) {
            env.IoC.resolve('ILogger').error('Bar', 'The value must be in range of [0..100]');
         }
         return (val > 0 ? Math.min(val,100)+'%' : '0px');
      }
   },
   Bar = Control.extend({
      _template: template,
      _width: '0px',

      _beforeMount: function(opts) {
         this._width = _private.getWidth(opts.value);
      },
      _beforeUpdate: function(opts) {
         this._width = _private.getWidth(opts.value);
      },
   });
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
 * @name Controls/_progress/Bar#value
 * @cfg {Number} Progress in percents (ratio of the filled part)
 * @remark
 * An integer from 1 to 100.
 */

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

Bar._theme = ['Controls/progress'];
Bar._private = _private;
export default Bar;
