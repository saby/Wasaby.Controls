define('js!WSControls/Lists/VirtualScroll',
   [
      'Core/Abstract'
   ],
   function (Abstract) {

      var VirtualScroll = Abstract.extend({
         $protected: {
            _options: {
               itemsLength: 0,
               pageSize: 5,
               maxItems: 15
            }
         },

         // First and last indices of items in projection
         _displayRange: [0, 0],



         // Range of indices of items that are shown in virtual window
         _vStartIndex: 0,
         _vEndIndex: 0,

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
         }
      });

      return VirtualScroll;
   });
