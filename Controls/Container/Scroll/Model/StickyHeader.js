define('Controls/Container/Scroll/Model/StickyHeader',
   [
      'Core/core-simpleExtend'
   ],
   function(simpleExtend) {

      'use strict';

      /**
       * Stores and processes data about fixing the header. Only one header can be fixed at a time.
       * The order of notification about the status of the fixation is irrelevant.
       *
       * @extends Core/core-simpleExtend
       * @class Controls/Container/Scroll/Model/StickyHeader
       */

      return simpleExtend.extend({

         /**
          * @type {Number|null} The ID of the sticking header.
          * @private
          */
         _stickyHeaderId: null,

         /**
          * Update information about the state of the fixation or change of the header.
          * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} data Information about the update.
          */
         update: function(data) {
            if (data.shouldBeFixed) {
               this._stickyHeaderId = data.id;
            } else if (this._stickyHeaderId === data.id) {
               this._stickyHeaderId = null;
            }
         },

         /**
          * Checks the header is fixed.
          * @returns {boolean} Determines whether the header is fixed.
          */
         isFixed: function() {
            return !!this._stickyHeaderId;
         }
      });
   }
);
