define('Controls/List/Controllers/VirtualScroll',
   [
      'Core/core-simpleExtend',
      'Controls/Utils/getDimensions'
   ],
   function(cExtend, uDimension) {
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

         /* Запоминаем высоты отрисованных записей, в дальнейшем это используется для правильного расчета
            распорок, а также при скроле через бегунок или зажатием мыши. */
         updateItemsSizes: function(self) {
            var
               startIndex = self._startItemIndex,
               stopIndex = self._stopItemIndex,
               items = self._itemsContainer.children;

            if (!(self._itemsHeights[startIndex] && self._itemsHeights[stopIndex - 1])) {
               for (var i = 0; i < items.length; i++) {
                  self._itemsHeights[startIndex + i] = uDimension(items[i]).height;
               }
            }
         },
         updateItemsIndexesOnScrolling: function(self, scrollTop) {
            var
               offsetHeight = 0,
               itemsHeightsCount = self._itemsHeights.length;
            for (var i = 0; i < itemsHeightsCount; i++) {
               offsetHeight += self._itemsHeights[i];

               // Находим первую видимую запись по скролл топу
               if (offsetHeight >= scrollTop) {
                  var virtualPageHalf = Math.ceil(i - self._virtualPageSize / 2);
                  self._startItemIndex = Math.max(virtualPageHalf, 0);

                  // Проверяем, что собираемся показать элементы, которые были отрисованы ранее
                  if (self._startItemIndex + self._virtualPageSize > itemsHeightsCount) {
                     self._stopItemIndex = itemsHeightsCount;
                     self._startItemIndex = Math.max(0, itemsHeightsCount - self._virtualPageSize);
                  } else {
                     self._stopItemIndex = Math.min(self._startItemIndex + self._virtualPageSize, self._itemsHeights.length);
                  }
                  self._topPlaceholderSize = _private.getItemsHeight(self, 0, self._startItemIndex);
                  self._bottomPlaceholderSize = _private.getItemsHeight(self, self._stopItemIndex, self._itemsHeights.length);
                  break;
               }
            }
         },
         isScrollInPlaceholder: function(self, scrollTop) {
            var itemsHeight = 0;
            for (var i = self._startItemIndex; i < self._stopItemIndex; i++) {
               itemsHeight += self._itemsHeights[i];
            }
            return (scrollTop < self._topPlaceholderSize || scrollTop > (itemsHeight + self._topPlaceholderSize));
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
            this._itemsHeights = [];
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

         /* Если в результате изменения scrollTop получилось так, что в видимой области листа стала видна распорка, то
            необходимо пересчитать индексы видимых элементов и распорки */
         updateItemsIndexesOnScrolling: function(scrollTop) {
            if (_private.isScrollInPlaceholder(this, scrollTop)) {
               _private.updateItemsIndexesOnScrolling(this, scrollTop);
            }
         }

      });


      VirtualScroll._private = _private;

      return VirtualScroll;
   });
