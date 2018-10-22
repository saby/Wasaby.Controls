define(
   'Controls/Indicator/Progress/Percentage',
   [
      'Core/Control',
      'wml!Controls/Indicator/Progress/Percentage/Percentage',
      'WS.Data/Type/descriptor',

      'css!Controls/Indicator/Progress/Percentage/Percentage'
   ],
   function(
      Control,
      template,
      typeDescriptor
   ) {
      'use strict';

      /**
       * Control for progress bar that renders percentage
       *
       * @class Controls/Indicator/Progress/Percentage
       * @extends Core/Control
       *
       * @public
       *
       * @author Baranov M.A.
       */


      /**
       * @name Controls/Indicator/Progress/Percentage#value
       * @cfg {Number} Display value
       */

      var
         Percentage = Control.extend({
            _template: template
         });

      Percentage.getOptionTypes = function() {
         return {
            value: typeDescriptor(Number).required()
         };
      };

      Percentage.getDefaultOptions = function() {
         return {
            value: 0
         };
      };

      return Percentage;
   }
);
