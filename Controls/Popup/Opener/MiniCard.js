define('Controls/Popup/Opener/MiniCard',
   [
      'Core/core-clone',
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/MiniCard/MiniCardController'
   ],
   function(cClone, Base, Controller) {

      'use strict';

      var _private = {
         target: null,

         openingTimerId: null,

         closingTimerId: null,

         displayDuration: 1500,

         animationDuration: 500,

         cleatTimeout: function(type) {
            var nameTimer = type + 'TimerId';

            if (_private[nameTimer]) {
               clearTimeout(_private[nameTimer]);
               _private[nameTimer] = null;
            }
         },

         open: function(self, cfg) {
            var myCfg = cClone(cfg);

            myCfg.className = 'controls-MiniCardController controls-MiniCardController_close';
            MiniCard.superclass.open.call(self, myCfg, Controller);

            this.target = myCfg.target;
         }
      };

      var MiniCard = Base.extend({
         open: function(cfg, type) {
            var
               self = this,
               duration = 0;

            /**
             * You need to finish opening the previous mini card.
             */
            _private.cleatTimeout('opening');

            /**
             * If the previous mini card is open, then it must be closed before opening a new mini card.
             */
            if (this.isOpened()) {
               this.close(type);
               duration += _private.animationDuration;
            }

            if (type === 'hover') {
               duration += _private.displayDuration;
            }

            if (duration) {
               _private.openingTimerId = setTimeout(function() {
                  _private.openingTimerId = null;

                  _private.open(self, cfg);
               }, duration);
            } else {
               _private.open(self, cfg);
            }
         },
         
         close: function(type) {
            _private.target = null;

            if (type === 'hover') {
               _private.closingTimerId = setTimeout(function() {
                  _private.closingTimerId = null;

                  MiniCard.superclass.close.call(this);
               }, _private.displayDuration);
            }
         }
      });

      return MiniCard;
   });