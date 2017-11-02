define('js!WSControls/Lists/ListView2',
   [
      'js!WSControls/Lists/_old/MultiSelector',
      'js!WSControls/Lists/_old/VirtualScroll',
      'tmpl!WSControls/Lists/_old/ListView2',
      'css!WSControls/Lists/_old/ListView'
   ],

   function(MultiSelector, VirtualScroll, template) {

      var INDICATOR_DELAY = 2000;

      var ListView = MultiSelector.extend({
         _navigationController: null,
         _controlName: 'WSControls/Lists/ListView',
         _template: template,


         _mouseMove: function(e, displayItem) {
            this._hoveredIndex = this._display.getIndex(displayItem);
         },

         _mouseLeave: function () {
            this._hoveredIndex = -1;
         },

         _getItemData: function(displayItem, index) {
            var data = ListView.superclass._getItemData.apply(this, arguments);
            data.hovered = this._hoveredIndex === index;
            return data;
         },

         _beforeMount: function(newOptions) {
            this._initNavigation(newOptions);
            ListView.superclass._beforeMount.apply(this, arguments);
         },

         _initNavigation: function(options) {
            if (options.dataSource && options.navigation && (!this._navigationController)) {
               this._navigationController = new PageNavigation(options.navigation.config);
               this._navigationController.prepareSource(options.dataSource);
            }
         },

         _onLoadPage: function(list, direction) {
            ListView.superclass._onLoadPage.apply(this, arguments);
            if (this._navigationController) {
               this._navigationController.calculateState(list, this._display, direction);
            }
         },
         _prepareQueryParams: function(direction) {
            var params = ListView.superclass._prepareQueryParams.apply(this, arguments);
            if (this._navigationController) {
               var addParams = this._navigationController.prepareQueryParams(this._display, direction);
               params.limit = addParams.limit;
               params.offset = addParams.offset;
               //TODO фильтр и сортировка не забыть приделать
            }
            return params;
         },

         /** --------------------------------------------
          *  VIRTUAL SCROLL
          *  --------------------------------------------
          */

         /**
          * Props
          */
         _enableVirtualScroll: false,
         _virtualScrollContainer: undefined,
         _virtualScroll: {
            // Constants
            TOP_PLACEHOLDER: 'controls-ListView__virtualScrollTopPlaceholder',
            BOTTOM_PLACEHOLDER: 'controls-ListView__virtualScrollBottomPlaceholder',
            TOP_TRIGGER: 'controls-ListView__virtualScrollTopLoadTrigger',
            BOTTOM_TRIGGER: 'controls-ListView__virtualScrollBottomLoadTrigger',
            ITEMS_CONTAINER: 'controls-ListView__itemsContainer',

            pageSize: 15,
            maxItems: 45,

            // Virtual windows bounds
            // ... [firstIndex ... lastIndex] ...
            window: {
               start: null,
               end: null
            },

            domElements: {
               // Placeholders that replace removed elements
               topPlaceholder: undefined,
               bottomPlaceholder: undefined,

               // Indicate reaching top or bottom of virtual window
               topLoadTrigger: undefined,
               bottomLoadTrigger: undefined,

               itemsContainer: undefined
            },

            placeholderSize: {
               top: 0,
               bottom: 0
            },

            firstLoad: true
         },


         _getItemsTplData: function() {
            var parOpts = ListView.superclass._getItemsTplData.apply(this, arguments);
            parOpts._listItemsTplData._selectedKey = this._selectedKey;
            parOpts._listItemsTplData._itemTplData._onItemClick = this._onItemClick;
            return parOpts;
         },

         _onItemClick: function(e, displayItem) {
            this._setSelectedByHash(displayItem.getHash());
            //this._onSelectedItemChange();
         },

         _getStartEnumerationPosition: function(indexes) {
            if (this._enableVirtualScroll && this._virtualScroll.window.end) {
               indexes._startIndex = this._virtualScroll.window.start;
               indexes._stopIndex = this._virtualScroll.window.end;
               indexes._curIndex = this._virtualScroll.window.start;
            }
            else {
               ListView.superclass._getStartEnumerationPosition.apply(this, arguments);
            }
         },

         /**
          * Lifecycle
          */

         _afterMount: function () {
            // Init virtual scroll after loading items
            if (this._display && this._enableVirtualScroll) {
               this._initVirtualScroll();
            }
         },

         _afterUpdate: function() {
            // Init virtual scroll after loading items
            if (!this._virtualScrollController && this._display && this._enableVirtualScroll) {
               this._initVirtualScroll();
            }
         },

         /**
          * Helper functions
          */

         // Set up virtual scroll
         _initVirtualScroll: function () {
            // Get references to DOM elements
            // TODO: refactor to get divs by name
            var children = this._container.children();
            for (var i = 0; i < children.length; i++) {
               if (children[i].className === this._virtualScroll.ITEMS_CONTAINER) {
                  this._virtualScroll.domElements.itemsContainer = children[i].children[0];
               }
               if (children[i].className === this._virtualScroll.TOP_PLACEHOLDER) {
                  this._virtualScroll.domElements.topPlaceholder = children[i];
                  if (children[i].children[0].className === this._virtualScroll.TOP_TRIGGER) {
                     this._virtualScroll.domElements.topLoadTrigger = children[i].children[0];
                  }
               } else if (children[i].className === this._virtualScroll.BOTTOM_PLACEHOLDER) {
                  this._virtualScroll.domElements.bottomPlaceholder = children[i];
                  if (children[i].children[0].className === this._virtualScroll.BOTTOM_TRIGGER) {
                     this._virtualScroll.domElements.bottomLoadTrigger = children[i].children[0];
                  }
               }
            }

            // Create virtual scroll controller
            this._virtualScrollController = new VirtualScroll({
               itemsLength: this._display._getItems().length,
               pageSize: this._virtualScroll.pageSize,
               maxItems: this._virtualScroll.maxItems
            });
            this._virtualScrollController.subscribe('virtualScrollReachedTop', function() {
               // TODO: load new page
               // TODO: Update virtual window after loading new page
            });
            this._virtualScrollController.subscribe('virtualScrollReachedBottom', function() {
               // TODO: load new page
               // TODO: Update virtual window after loading new page
            });


            // Get initial virtual window
            this._virtualScroll.window = this._virtualScrollController.getVirtualWindow();

            // Setup intersection observer
            var self = this,
               observer = new IntersectionObserver(function(changes) {
                  for (var i = 0; i < changes.length; i++) {
                     if (changes[i].isIntersecting) {
                        if (changes[i].target.className === self._virtualScroll.TOP_TRIGGER) {
                           if (!self._virtualScroll.firstLoad) {
                              self._virtualScrollReachTrigger('top');
                           } else {
                              self._virtualScroll.firstLoad = false;
                           }
                        }
                        if (changes[i].target.className === self._virtualScroll.BOTTOM_TRIGGER) {
                           self._virtualScrollReachTrigger('bottom');
                        }
                     }
                  }
               }, {});
            observer.observe(this._virtualScroll.domElements.topLoadTrigger);
            observer.observe(this._virtualScroll.domElements.bottomLoadTrigger);

            this._forceUpdate();
         },

         /**
          * Update virtual window and placeholders after reaching top or bottom
          * virtual scroll triggers.
          *
          * @param position (string) 'top' or 'bottom'
          * @private
          */
         _virtualScrollReachTrigger: function(position) {
            var result = this._virtualScrollController.updateWindowOnTrigger(position);
            this._virtualScroll.window = result.window;

            var
               topPlaceholderHeightChange = 0,
               bottomPlaceholderHeightChange = 0;

            // Removing items from the bottom => increase bottom placeholder size
            if (result.bottomChange < 0) {
               bottomPlaceholderHeightChange = this._getBottomItemsHeight(-result.bottomChange);
               topPlaceholderHeightChange = -bottomPlaceholderHeightChange;
            }
            // Removing items from the top => increase top placeholder size
            else if (result.topChange < 0) {
               topPlaceholderHeightChange = this._getTopItemsHeight(-result.topChange);
               bottomPlaceholderHeightChange = -topPlaceholderHeightChange;
            }

            // Update placeholder heights
            this._virtualScroll.placeholderSize.top = this._resizePlaceholder(
               this._virtualScroll.placeholderSize.top,
               topPlaceholderHeightChange);
            this._virtualScroll.placeholderSize.bottom = this._resizePlaceholder(
               this._virtualScroll.placeholderSize.bottom,
               bottomPlaceholderHeightChange);

            this._forceUpdate();
         },

         _resizePlaceholder: function (initialHeight, heightChange) {
            var newHeight = initialHeight + heightChange;
            return newHeight > 0 ? newHeight : 0;
         },

         // Total height of first n items
         _getTopItemsHeight: function(numItems) {
            var
               firstItemOffset = this._virtualScroll.domElements.itemsContainer.children[0].offsetTop,
               followingItemOffset = this._virtualScroll.domElements.itemsContainer.children[numItems].offsetTop;

            return followingItemOffset - firstItemOffset;
         },

         // Total height of last n items
         _getBottomItemsHeight: function(numItems) {
            var
               firstItemIndex = this._virtualScroll.window.end - this._virtualScroll.window.start - numItems,
               bottomPlaceholderOffset = this._virtualScroll.domElements.bottomPlaceholder.offsetTop,
               firstItemOffset = this._virtualScroll.domElements.itemsContainer.children[firstItemIndex].offsetTop;

            return bottomPlaceholderOffset - firstItemOffset;
         },


         /**
          * --------------------------------------------
          */


         /*DataSource*/
         _toggleIndicator: function(show){  //TODO метод скопирован из старого ListView
            var self = this;
//            container = this.getContainer(),
//            ajaxLoader = container.find('.controls-AjaxLoader').eq(0),
//            indicator, centerCord, scrollContainer;


            this._showedLoading = show;
            if (show) {
               setTimeout(function(){
                  if (!self.isDestroyed() && self._showedLoading) {
//                  scrollContainer = self._getScrollContainer()[0];
//                  indicator = ajaxLoader.find('.controls-AjaxLoader__outer');
//                  if(indicator.length && scrollContainer && scrollContainer.offsetHeight && container[0].scrollHeight > scrollContainer.offsetHeight) {
//                     /* Ищем кординату, которая находится по середине отображаемой области грида */
//                     centerCord =
//                        (Math.max(scrollContainer.getBoundingClientRect().bottom, 0) - Math.max(container[0].getBoundingClientRect().top, 0))/2;
//                     /* Располагаем индикатор, учитывая прокрутку */
//                     indicator[0].style.top = centerCord + scrollContainer.scrollTop + 'px';
//                  } else {
//                     /* Если скрола нет, то сбросим кординату, чтобы индикатор сам расположился по середине */
//                     indicator[0].style.top = '';
//                  }
                     self.loading = true;
                  }
               }, INDICATOR_DELAY);
            }
            else {
               this.loading = show;
            }
         },

         _beforeUnmount: function() {
            if (this._navigationController) {
               //TODO выписать ошибку Диме Зуеву
               this._navigationController.destroy();
               this._navigationController = null;
            }
         }
         /**/

      });

      return ListView;
   });