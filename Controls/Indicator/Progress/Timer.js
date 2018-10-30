define(
   'Controls/Indicator/Progress/Timer',
   [
      'Core/Control',
      'wml!Controls/Indicator/Progress/Timer/Timer',
      'WS.Data/Type/descriptor',

      'css!Controls/Indicator/Progress/Timer/Timer'
   ],
   function(
      Control,
      template,
      typeDescriptor
   ) {
      'use strict';

      /**
       * Timer control for progress bar
       *
       * @class Controls/Indicator/Progress/Timer
       * @extends Core/Control
       *
       * @public
       *
       * @author Baranov M.A.
       */


      /**
       * @name Controls/Indicator/Progress/Timer#value
       * @cfg {Number} Timer value in seconds
       */


      /**
       * @name Controls/Indicator/Progress/Timer#autoTick
       * @cfg {Boolean} Does the timer need to be automatically incremented
       */

      var
         _private = {

            /**
             * Converts time from seconds to mm:ss
             * @param time (seconds)
             */
            getDisplayTime: function(time) {
               var minutes = Math.floor(time / 60);
               var seconds = time - minutes * 60;

               var result = (minutes < 10 ? '0' + minutes : minutes);
               result += ':' + (seconds < 10 ? '0' + seconds : seconds);
               return result;
            }
         };

      var
         Timer = Control.extend({
            _template: template,

            _beforeMount: function(options) {
               this._time = options.value;
            },

            _afterMount: function() {
               if (this._options.autoTick) {
                  this._time += 1;
                  this._forceUpdate();
               }
            },

            _afterUpdate: function() {
               if (this._options.autoTick) {
                  var
                     self = this;

                  this._time += 1;

                  setTimeout(function() {
                     self._forceUpdate();
                  }, 1000);
               }
            },

            /**
             * Returns time to display
             * @return {*}
             * @private
             */
            _getDisplayTime: function() {
               return _private.getDisplayTime(this._time);
            }
         });

      Timer.getOptionTypes = function() {
         return {
            value: typeDescriptor(Number).required(),
            autoTick: typeDescriptor(Boolean)
         };
      };

      Timer.getDefaultOptions = function() {
         return {
            value: 0
         };
      };

      return Timer;
   }
);
