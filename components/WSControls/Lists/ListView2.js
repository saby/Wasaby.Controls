define('js!WSControls/Lists/ListView2',
   [
      'js!WSControls/Lists/MultiSelector',
      'js!WSControls/Lists/VirtualScroll',
      'tmpl!WSControls/Lists/ListView2',
      'js!WSControls/Lists/ItemsToolbar/ItemsToolbarCompatible',
      'js!WSControls/Lists/Controllers/PageNavigation'
   ],

   function(MultiSelector, VirtualScroll, template, ItemsToolbarCompatible, PageNavigation) {
      
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
         },         /**
          * --------------------------------------------
          * VIRTUAL SCROLL
          * --------------------------------------------
          */
         /**
          * Props
          */
         _enableVirtualScroll: true,
         _virtualScrollContainer: undefined,
         _virtualScroll: {
            // Constants
            TOP_PLACEHOLDER: 'controls-ListView__virtualScrollTopPlaceholder',
            BOTTOM_PLACEHOLDER: 'controls-ListView__virtualScrollBottomPlaceholder',
            TOP_TRIGGER: 'controls-ListView__virtualScrollTopLoadTrigger',
            BOTTOM_TRIGGER: 'controls-ListView__virtualScrollBottomLoadTrigger',


            pageSize: 5,
            maxItems: 15,

            // Virtual windows bounds
            // ... [firstIndex ... lastIndex] ...
            window: {
               firstIndex: null,
               lastIndex: null
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

            needResizeAfterUpdate: {
               top: false,
               bottom: false
            }
         },

         /**
          * Lifecycle
          */
         _afterMount: function() {
            if (this._enableVirtualScroll) {
               this._initVirtualScroll();
            }
         },

         _afterUpdate: function() {
            if (this._virtualScroll.needResizeAfterUpdate.top) {
               this._resizeVirtualScrollTopPlaceholder(- this._getTopItemsHeight(this._virtualScroll.pageSize));
               this._virtualScroll.needResizeAfterUpdate.top = false;
            }
            if (this._virtualScroll.needResizeAfterUpdate.bottom) {
               this._resizeVirtualScrollBottomPlaceholder(- this._getBottomItemsHeight(this._virtualScroll.pageSize));
               this._virtualScroll.needResizeAfterUpdate.bottom = false;
            }
         },

         /**
          * Helper functions
          */

         // Set up virtual scroll
         _initVirtualScroll: function () {
            // Get references to DOM elements
            var children = this._container.children();
            for (var i = 0; i < children.length; i++) {
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
               itemsLength: 30, /* TODO: number of items in projection */
               pageSize: this._virtualScroll.pageSize,
               maxItems: this._virtualScroll.maxItems
            });

            // Get initial virtual window
            this._virtualScroll.window = this._virtualScrollController.getVirtualWindow();

            // Setup intersection observer
            var self = this,
               observer = new IntersectionObserver(function(changes) {
                  for (var i = 0; i < changes.length; i++) {
                     if (changes[i].isIntersecting) {
                        if (changes[i].target.className === self._virtualScroll.TOP_TRIGGER) {
                           self._virtualScrollReachTop();
                        }
                        if (changes[i].target.className === self._virtualScroll.BOTTOM_TRIGGER) {
                           self._virtualScrollReachBottom();
                        }
                     }
                  }
               }, {});
            observer.observe(this._virtualScroll.domElements.topLoadTrigger);
            observer.observe(this._virtualScroll.domElements.bottomLoadTrigger);
         },

         _virtualScrollReachTop: function() {
            var result = this._virtualScrollController.resizeWindowOnReachTop();

            this._virtualScroll.window = result[0];

            if (result[2] < 0) {
               this._resizeVirtualScrollBottomPlaceholder(this._getBottomItemsHeight(this._virtualScroll.pageSize));
            }
            if (result[1] > 0) {
               if ($(this._virtualScroll.domElements.topPlaceholder).height() !== 1) {
                  this._virtualScroll.needResizeAfterUpdate.top = true;
               }
            }

            this.virtualPageChange(); /* TODO: Update page */
         },

         _virtualScrollReachBottom: function () {
            var result = this._virtualScrollController.resizeWindowOnReachBottom();

            this._virtualScroll.window = result[0];

            if (result[1] < 0) {
               this._resizeVirtualScrollTopPlaceholder(this._getTopItemsHeight(this._virtualScroll.pageSize));
            }
            if (result[2] > 0) {
               if ($(this._virtualScroll.domElements.bottomPlaceholder).height() !== 1) {
                  this._virtualScroll.needResizeAfterUpdate.bottom = true;
               }
            }

            this.virtualPageChange(); /* TODO: Update page */
         },

         // Increases (decreases if input is < 0) height of top placeholder
         _resizeVirtualScrollTopPlaceholder: function(size) {
            var topPlaceholder = this._virtualScroll.domElements.topPlaceholder;
            $(topPlaceholder).height($(topPlaceholder).height() + size + 'px');
         },

         // Increases (decreases if input is < 0) height of bottom placeholder
         _resizeVirtualScrollBottomPlaceholder: function(size) {
            var bottomPlaceholder = this._virtualScroll.domElements.bottomPlaceholder;
            $(bottomPlaceholder).height($(bottomPlaceholder).height() + size + 'px');
         },

         // Total height of first n items
         _getTopItemsHeight: function(numItems) {
            return this._virtualScroll.domElements.itemsContainer.children[numItems].offsetTop -
               this._virtualScroll.domElements.itemsContainer.children[0].offsetTop;
         },

         // Total height of last n items
         _getBottomItemsHeight: function(numItems) {
            var lastItem = this._virtualScroll.domElements.itemsContainer.length - 1;

            return this._virtualScroll.domElements.itemsContainer.children[lastItem].offsetTop -
               this._container.children()[1].children[lastItem - numItems + 1].offsetTop +
               $(this._container.children()[1].children[lastItem]).outerHeight();
         },


         /**
          * EXTRA
          */

         _scrollLoadNextPage: function() {

         },

         _loadNextPage: function() {

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