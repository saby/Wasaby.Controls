define('js!WSControls/Lists/VirtualScroll',
   [
      'Core/Abstract'
   ],
   function (Abstract) {

      // <- init
      // <- added
      // <- removed
      // <- newdata
      //
      // -> getPage
      // -> loadRequest


      var VirtualScroll = Abstract.extend({
         $protected: {
            _options: {
               itemsLength: 0,
               pageSize: 5,
               maxItems: 15
            }
         },

         // First and last indices of items in projection
         _dataRange: [0, 0],

         // Range of indices of items that are shown in virtual window
         _virtualWindow: [0, 0],

         getVirtualWindow: function() {
            return [this._vStartIndex, this._vEndIndex];
         },

         resizeWindowOnReachTop: function() {
            var bottomChange = 0,
               topChange = 0;

            // Load more data
            if (this._vStartIndex === this._dataStart) {
               // TODO: request more data
            }
            else {
               // TODO: check if not enough for page
               this._vStartIndex = this._vStartIndex - this._options.pageSize;
               topChange = this._options.pageSize;
            }

            // Remove items from opposite end
            if (this._vEndIndex - this._vStartIndex > this._options.maxItems) {
               // remove page from bottom
               this._vEndIndex = this._vEndIndex - this._options.pageSize;
               bottomChange = -5;
            }

            return[this.getVirtualWindow(), topChange, bottomChange];
         },


         resizeWindowOnReachBottom: function() {
            var bottomChange = 0,
               topChange = 0;

            // Load more data
            if (this._vEndIndex === this._dataEnd) {
               // TODO: request more data
            } else {
               // TODO: check if not enough for page
               this._vEndIndex = this._vEndIndex + this._options.pageSize;
               bottomChange = this._options.pageSize;
            }

            // Remove items from opposite end
            if (this._vEndIndex - this._vStartIndex > this._options.maxItems) {
               // remove page from bottom
               this._vStartIndex = this._vStartIndex + this._options.pageSize;
               topChange = -5;
            }

            return[this.getVirtualWindow(), topChange, bottomChange];
         },


         onNewDataLoad: function(bottom, numItems) {
            // Add to the end
            if (bottom) {
               this._displayRange[1] += numItems;
            }
            // Added to the beginning
            else {
               this._displayRange[0] -= numItems;
            }
         },

         /**
          * Recalculates virtual page after item was removed from the dataset.
          *
          * @param idx - index of removed item
          */
         onItemRemoved: function(idx) {
            this._dataRange[1] -= 1;

            if (idx < this._virtualWindow[0]) {
               this._virtualWindow[0] -= 1;
               this._virtualWindow[1] -= 1;
            } else if (idx <= this._virtualWindow[1]) {
               this._virtualWindow[1] -= 1;
            }
         },

         /**
          * Recalculates virtual page after item was added to the dataset.
          *
          * @param idx - index of new item
          */
         onItemAdded: function(idx) {
            this._dataRange[1] += 1;

            if (idx <= this._virtualWindow[0]) {
               this._virtualWindow[0] += 1;
               this._virtualWindow[1] += 1;
            } else if (idx <= this._virtualWindow[1]) {
               this._virtualWindow[1] += 1;
            }
         },

         /**
          * Set the state of dataset and virtual window
          */
         setState: function(dataRange, virtualWindow) {
            this._dataRange = [dataRange[0], dataRange[1]];
            this._virtualWindow = [virtualWindow[0], virtualWindow[1]];
         },

         /**
          * Get current state of virtual scroll
          *
          * @returns {{dataRange: Array, virtualWindow: Array}}
          */
         getState: function() {
            return {
               'dataRange': this._dataRange,
               'virtualWindow': this._virtualWindow
            };
         }
      });

      return VirtualScroll;
   });
