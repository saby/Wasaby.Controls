define('Controls/Popup/Opener/MiniCard',
   [
      'Core/core-clone',
      'Controls/Popup/Opener/BaseOpener',
      'Controls/Popup/Opener/MiniCard/MiniCardController'
   ],
   function(cClone, Base, Controller) {

      'use strict';

      var _private = {
         displayDuration: 1500,

         cleatTimeout: function(self, type) {
            var nameTimer = '_' + type + 'TimerId';

            if (self[nameTimer]) {
               clearTimeout(self[nameTimer]);
               self[nameTimer] = null;
            }
         },

         open: function(self, cfg) {
            var myCfg = cClone(cfg);

            myCfg.closeByExternalClick = true;
            myCfg.className = 'controls-MiniCardController';
            MiniCard.superclass.open.call(self, myCfg, Controller);
         }
      };

      var MiniCard = Base.extend({
         _openingTimerId: null,

         _closingTimerId: null,

         open: function(cfg, type) {
            var self = this;

            _private.cleatTimeout(this, 'closing');

            if (type === 'hover') {
               this._openingTimerId = setTimeout(function() {
                  self.openingTimerId = null;

                  _private.open(self, cfg);
               }, _private.displayDuration);
            } else {
               _private.open(self, cfg);
            }
         },
         
         close: function(type) {
            var self = this;

            _private.cleatTimeout(this, 'opening');

            if (type === 'hover') {
               this._closingTimerId = setTimeout(function() {
                  self.closingTimerId = null;

                  MiniCard.superclass.close.call(self);
               }, _private.displayDuration);
            } else {
               MiniCard.superclass.close.call(this);
            }
         },

         /**
          * Cancel a delay in opening or closing.
          * @param {String} action Action to be undone.
          * @variant opening
          * @variant closing
          */
         cancel: function(action) {
            _private.cleatTimeout(this, action);
         }
      });

      return MiniCard;
   });
