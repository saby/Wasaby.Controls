define('Controls/Popup/Opener/Previewer',
   [
      'Core/core-clone',
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(cClone, Base) {

      'use strict';

      var _private = {
         displayDuration: 1000,

         clearOpeningTimeout: function(self) {
            var id = self._openingTimerId;

            if (id) {
               clearTimeout(id);
               self._openingTimerId = null;
            }
         },

         clearClosingTimeout: function(self) {
            var id = self._closingTimerId;

            if (id) {
               clearTimeout(id);
               self._closingTimerId = null;
            }
         },

         open: function(self, cfg) {
            var myCfg = cClone(cfg);

            myCfg.closeByExternalClick = true;
            myCfg.className = 'controls-PreviewerController';
            Previewer.superclass.open.call(self, myCfg, 'Controls/Popup/Opener/Previewer/PreviewerController');
         }
      };

      var Previewer = Base.extend({
         _openingTimerId: null,

         _closingTimerId: null,

         open: function(cfg, type) {
            var self = this;

            _private.clearClosingTimeout(this);

            // Previewer - singleton
            this.close();

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

            _private.clearOpeningTimeout(this);

            if (type === 'hover') {
               this._closingTimerId = setTimeout(function() {
                  self.closingTimerId = null;

                  Previewer.superclass.close.call(self);
               }, _private.displayDuration);
            } else {
               this._popupIds = [];
               Previewer.superclass.close.call(this);
            }
         },

         /**
          * Cancel a delay in opening or closing.
          * @param {String} action Action to be undone.
          * @variant opening
          * @variant closing
          */
         cancel: function(action) {
            switch (action) {
               case 'opening':
                  _private.clearOpeningTimeout(this);
                  break;
               case 'closing':
                  _private.clearClosingTimeout(this);
                  break;
            }
         }
      });

      return Previewer;
   });
