import cClone = require('Core/core-clone');
import Base = require('Controls/_popup/Opener/BaseOpener');
import PreviewerController = require('Controls/_popup/Opener/Previewer/PreviewerController');


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

            myCfg.closeOnOutsideClick = true;
            myCfg.className = 'controls-PreviewerController';
            Previewer.superclass.open.call(self, myCfg, PreviewerController);
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
               Previewer.superclass.close.call(this);
               this._popupIds = [];
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

      Previewer.getDefaultOptions = function() {
         var baseOptions = Base.getDefaultOptions();
         baseOptions._vdomOnOldPage = true;
         return baseOptions;
      };

      export = Previewer;

