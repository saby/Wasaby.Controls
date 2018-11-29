define('Controls/List/Controllers/VirtualScroll',
   [
      'Core/core-simpleExtend'
   ],
   function(cExtend) {
      /**
       *
       * @author Родионов Е.А.
       * @public
       */

      var _private = {

         getItemsHeight: function(self, startIndex, stopIndex) {
            var itemsHeight = 0;
            if (!!self._itemsHeights[startIndex] && !!self._itemsHeights[stopIndex - 1]) {
               for (var i = startIndex; i < stopIndex; i++) {
                  itemsHeight += self._itemsHeights[i];
               }
            }
            return itemsHeight;
         },

         // Заполняет массив высот записей
         updateItemsSizes: function(self) {
            var
               startIndex = self._startItemIndex,
               stopIndex = self._stopItemIndex,
               items = self._itemsContainer.children;

            if (!(self._itemsHeights[startIndex] && self._itemsHeights[stopIndex - 1])) {
               for (var i = 0; i < items.length; i++) {
                  self._itemsHeights[startIndex + i] = items[i].offsetHeight;
               }
            }
         }
      };

      var VirtualScroll = cExtend.extend({
         _itemsContainer: null,
         _itemsHeights: null,
         _startItemIndex: null,
         _stopItemIndex: null,
         _itemsCount: null,
         _virtualPageSize: 100,
         _virtualSegmentSize: 20,
         _topPlaceholderSize: null,
         _bottomPlaceholderSize: null,

         constructor: function(cfg) {
            VirtualScroll.superclass.constructor.apply(this, arguments);
            this._itemsHeights = [];
            this._virtualSegmentSize = cfg.virtualSegmentSize || this._virtualSegmentSize;
            this._virtualPageSize = cfg.virtualPageSize || this._virtualPageSize;
            this._startItemIndex = cfg.startIndex || 0;
            this._stopItemIndex = this._startItemIndex + this._virtualPageSize;
            this._topPlaceholderSize = 0;
            this._bottomPlaceholderSize = 0;
         },

         resetItemsIndexes: function() {
            this._startItemIndex = 0;
            this._stopItemIndex = this._startItemIndex + this._virtualPageSize;
            this._topPlaceholderSize = 0;
            this._bottomPlaceholderSize = 0;
         },

         setItemsContainer: function(itemsContainer) {
            this._itemsContainer = itemsContainer;
            _private.updateItemsSizes(this);
         },

         updateItemsSizes: function() {
            _private.updateItemsSizes(this);
         },

         updateItemsIndexes: function(direction) {
            if (direction === 'down') {
               this._startItemIndex = this._startItemIndex + this._virtualSegmentSize;
               if (this._itemsCount) {
                  this._startItemIndex = Math.min(this._startItemIndex, this._itemsCount - this._virtualPageSize);
               }
            } else {
               this._startItemIndex = Math.max(this._startItemIndex - this._virtualSegmentSize, 0);
            }

            this._stopItemIndex = this._startItemIndex + this._virtualPageSize;
            this._topPlaceholderSize = _private.getItemsHeight(this, 0, this._startItemIndex);
            this._bottomPlaceholderSize = _private.getItemsHeight(this, this._stopItemIndex, this._itemsHeights.length);
         },

         getItemsIndexes: function() {
            return {
               start: this._startItemIndex,
               stop: this._stopItemIndex
            };
         },

         getPlaceholdersSizes: function() {
            return {
               top: this._topPlaceholderSize,
               bottom: this._bottomPlaceholderSize
            };
         },

         setItemsCount: function(itemsCount) {
            this._itemsCount = itemsCount;
         },

         isScrollInPlaceholder: function(scrollTop) {
            var itemsHeight = 0;
            for (var i = this._startItemIndex; i < this._stopItemIndex; i++) {
               itemsHeight += this._itemsHeights[i];
            }
            return (scrollTop < this._topPlaceholderSize || scrollTop > (itemsHeight + this._topPlaceholderSize));
         },

         updateItemsIndexesOnScrolling: function(scrollTop) {
            var
               offsetHeight = 0,
               itemsHeightsCount = this._itemsHeights.length;
            for (var i = 0; i < itemsHeightsCount; i++) {
               offsetHeight += this._itemsHeights[i];

               // Находим первую видимую запись по скроллтопу
               if (offsetHeight >= scrollTop) {
                  var virtualPageHalf = Math.ceil(i - this._virtualPageSize / 2);
                  this._startItemIndex = Math.max(virtualPageHalf, 0);

                  // Проверяем, что собираемся показать элементы, которые уже были отрисованы хотябы 1 раз
                  if (this._startItemIndex + this._virtualPageSize > itemsHeightsCount) {
                     this._stopItemIndex = itemsHeightsCount;
                     this._startItemIndex = Math.max(0, itemsHeightsCount - this._virtualPageSize);
                  } else {
                     this._stopItemIndex = Math.min(this._startItemIndex + this._virtualPageSize, this._itemsHeights.length);
                  }
                  this._topPlaceholderSize = _private.getItemsHeight(this, 0, this._startItemIndex);
                  this._bottomPlaceholderSize = _private.getItemsHeight(this, this._stopItemIndex, this._itemsHeights.length);
                  break;
               }
            }
         }

      });


      VirtualScroll._private = _private;

      return VirtualScroll;
   });
