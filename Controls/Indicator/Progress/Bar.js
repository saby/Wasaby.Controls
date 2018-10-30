define(
   'Controls/Indicator/Progress/Bar',
   [
      'Core/Control',
      'wml!Controls/Indicator/Progress/Bar/Bar',
      'WS.Data/Type/descriptor',

      'css!Controls/Indicator/Progress/Bar/Bar'
   ],
   function(
      Control,
      template,
      typeDescriptor
   ) {
      'use strict';

      /**
       * Control that renders progress bar
       *
       * @class Controls/Indicator/Progress/Bar
       * @extends Core/Control
       *
       * @public
       *
       * @author Baranov M.A.
       */


      /**
       * @name Controls/Indicator/Progress/Bar#percentValue
       * @cfg {Number} Progress in percents (ratio of the filled part)
       */


      /**
       * @name Controls/Indicator/Progress/Bar#smoothFill
       * @cfg {Boolean} Determines whether the bar fills smoothly
       */

      var
         Bar = Control.extend({
            _template: template
         });

      Bar.getOptionTypes = function() {
         return {
            percentValue: typeDescriptor(Number).required(),
            smoothFill: typeDescriptor(Boolean)
         };
      };

      Bar.getDefaultOptions = function() {
         return {
            percentValue: 0
         };
      };

      return Bar;
   }
);
