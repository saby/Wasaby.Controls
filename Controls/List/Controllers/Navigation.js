define('Controls/List/Controllers/Navigation',
   [
      'Core/core-simpleExtend',
      'Core/Deferred'
   ],
   function(cExtend, Deferred) {
      var _private = {
         createScrollPagingController: function(mode, pagingCfgTrigger) {
            var def = new Deferred();
            require(['Controls/List/Controllers/ScrollPaging'], function (ScrollPagingController) {
               var scrollPagingCtr;
               scrollPagingCtr = new ScrollPagingController({
                  //scrollContainer: scrollContainer,
                  mode: mode,
                  pagingCfgTrigger: pagingCfgTrigger
               });

               def.callback(scrollPagingCtr);


            }, function(error){
               def.errback(error);
            });

            return def;
         }
      };
      var Navigation = cExtend.extend({
         _sourceCtr: null,
         constructor: function (cfg) {
            var self = this;
            this._options = cfg;
            Navigation.superclass.constructor.apply(this, arguments);
            this._sourceCtr = this._options.sourceController;

            if (this._options.navigation
               && this._options.navigation.view === 'infinity'
               && this._options.navigation.viewConfig
               && this._options.navigation.viewConfig.pagingMode
               && this._options.scrollController.hasScroll()
            ) {
               _private.createScrollPagingController(
                  this._options.navigation.viewConfig.pagingMode,
                  this._options.scrollPagingCfgTrigger).addCallback(function(scrollPagingCtr){
                     self._scrollPagingCtr = scrollPagingCtr
                  });
            }

         },


         //TODO временный метод
         resetScroll: function() {
            var self = this;
            if (this._options.navigation
               && this._options.navigation.view === 'infinity'
               && this._options.navigation.viewConfig
               && this._options.navigation.viewConfig.pagingMode
               && this._options.scrollController.hasScroll()
               && !self._scrollPagingCtr
            ) {
               _private.createScrollPagingController(
                  this._options.navigation.viewConfig.pagingMode,
                  this._options.scrollPagingCfgTrigger).addCallback(function(scrollPagingCtr){
                  self._scrollPagingCtr = scrollPagingCtr
               });
            }
         },

         handleScrollTop: function() {
            if (this._options.navigation && this._options.navigation.view === 'infinity') {
               if (this._sourceCtr.hasMoreData('up') && !this._sourceCtr.isLoading()) {
                  this._options.topLoadTrigger();
               }
               if (this._scrollPagingCtr) {
                  this._scrollPagingCtr.handleScrollTop();
               }
            }
         },

         handleScrollBottom: function() {
            if (this._options.navigation && this._options.navigation.view === 'infinity') {
               if (this._sourceCtr.hasMoreData('down') && !this._sourceCtr.isLoading()) {
                  this._options.bottomLoadTrigger();
               }
               if (this._scrollPagingCtr) {
                  this._scrollPagingCtr.handleScrollBottom();
               }
            }
         },

         handleScroll: function(scrollOffset) {
            if (this._scrollPagingCtr) {
               this._scrollPagingCtr.handleScroll(scrollOffset);
            }
         },

         destroy: function() {
            this._sourceCtr = null;
            this._options = null;
         }
      });
      return Navigation;
   });
