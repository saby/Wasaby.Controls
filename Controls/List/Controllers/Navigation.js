define('Controls/List/Controllers/Navigation',
   [
      'Core/core-simpleExtend'
   ],
   function(cExtend) {
      var _private = {
         createScrollPagingController: function() {
            if (this._options.navigation && this._options.navigation.view == 'infinity') {
               if (scrollContainer && this._options.navigation.viewConfig && this._options.navigation.viewConfig.pagingMode) {
                  var self = this;
                  require(['Controls/List/Controllers/ScrollPaging'], function (ScrollPagingController) {
                     self._scrollPagingCtr = new ScrollPagingController({
                        scrollContainer: scrollContainer,
                        mode: self._options.navigation.viewConfig.pagingMode
                     });

                     self._scrollPagingCtr.subscribe('onChangePagingCfg', function(e, pCfg){
                        self._pagingCfg = pCfg;
                        self._forceUpdate();
                     });

                     self._scrollPagingCtr.startObserve();
                  });
               }
            }
         }
      };
      var Navigation = cExtend.extend({
         _sourceCtr: null,
         constructor: function (cfg) {
            this._options = cfg;
            Navigation.superclass.constructor.apply(this, arguments);
            this._sourceCtr = this._options.sourceController;
         },

         handleScrollTop: function() {
            if (this._options.navigation && this._options.navigation.view === 'infinity') {
               if (this._sourceCtr.hasMoreData('up') && !this._sourceCtr.isLoading()) {
                  this._options.topLoadTrigger();
               }
            }
         },

         handleScrollBottom: function() {
            if (this._options.navigation && this._options.navigation.view === 'infinity') {
               if (this._sourceCtr.hasMoreData('down') && !this._sourceCtr.isLoading()) {
                  this._options.bottomLoadTrigger();
               }
            }
         },

         destroy: function() {
            this._sourceCtr = null;
            this._options = null;
            if (this._scrollLoadCtr) {
               this._scrollLoadCtr.destroy();
            }
         }
      });
      return Navigation;
   });
