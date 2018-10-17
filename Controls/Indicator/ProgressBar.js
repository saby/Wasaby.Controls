define(
   'Controls/Indicator/ProgressBar',
   [
      'Core/Control',
      'wml!Controls/Indicator/ProgressBar/ProgressBar',
      'WS.Data/Type/descriptor',

      'css!Controls/Indicator/ProgressBar/ProgressBar'
   ],
   function(
      Control,
      template,
      typeDescriptor
   ) {
      'use strict';

      var MAX_PERCENT = 100;
      var MIN_PERCENT = 0;

      var _private = {

         /**
          * Calculates percentage based on total and current value
          * @param currentValue
          * @param totalValue
          * @return {number}
          */
         calcProgressPercent: function(currentValue, totalValue) {
            var
               calculatedPercent = Math.round(currentValue / (totalValue / 100));

            return calculatedPercent < MAX_PERCENT ? calculatedPercent : MAX_PERCENT;
         },

         /**
          * Calculates step size per synchronization cycle. Used only when smooth motion is on
          * @param diff
          * @return {number}
          */
         calcStepSize: function(diff) {
            if (diff > 0 && diff <= 10) {
               return 1;
            } else if (diff > 10 && diff <= 20) {
               return 3;
            } else {
               return 7;
            }
         },

         /**
          * Calculates bar movement direction. Used only when smooth motion is on
          * @param oldValue
          * @param newValue
          * @return {number} 1 for increasing, -1 for decreasing
          */
         calcMovementDirection: function(oldValue, newValue) {
            if (newValue > oldValue) {
               return 1;
            } else if (newValue < oldValue) {
               return -1;
            } else {
               return 0;
            }
         }
      };

      var
         ProgressBar = Control.extend({
            _template: template,

            _progressPercent: 0,

            _direction: undefined,

            _beforeMount: function(options) {
               this._progressPercent = _private.calcProgressPercent(options.currentValue, options.totalValue);
            },

            _beforeUpdate: function(newOptions) {
               // If barSmoothMotion option is on, then change the percentage step by step
               if (newOptions.barSmoothMotion) {
                  var
                     newProgressPercent = _private.calcProgressPercent(newOptions.currentValue, newOptions.totalValue);

                  this._progressPercent = this._getProgressPercentNextStepValue(newProgressPercent);

                  if (this._progressPercent >= MIN_PERCENT && this._progressPercent <= MAX_PERCENT) {
                     this._forceUpdate();
                  }
               } else {
                  this._progressPercent = _private.calcProgressPercent(newOptions.currentValue, newOptions.totalValue);
               }
            },

            /**
             * Calculates percentage value for the next step.
             * @param newProgressPercent
             * @return {number}
             * @private
             */
            _getProgressPercentNextStepValue: function(newProgressPercent) {
               var
                  step = _private.calcStepSize(Math.abs(newProgressPercent - this._progressPercent));

               this._direction = _private.calcMovementDirection(this._progressPercent, newProgressPercent);

               return this._progressPercent + (this._direction * step);
            }
         });

      ProgressBar.getOptionTypes = function() {
         return {
            currentValue: typeDescriptor(Number).required(),
            totalValue: typeDescriptor(Number).required(),
            smoothMotion: typeDescriptor(Boolean)
         };
      };

      return ProgressBar;
   }
);
