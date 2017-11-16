/**
 * Created by kraynovdo on 13.11.2017.
 */
define('js!Controls/List/Controllers/ScrollPaging',
   [
      'Core/Abstract'
   ],
   function(Abstract) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var Paging = Abstract.extend({
         _selectedPage: null,
         _onScrollHdl: null,

         constructor: function(cfg) {
            this._options = cfg;
            Paging.superclass.constructor.apply(this, arguments);
            if (cfg.selectedPage) {
               this._selectedPage = cfg.selectedPage;
            }
            this._cacheHeights(cfg.scrollContainer);


         },

         __getDefaultPagingConfig: function() {
            var config = {};
            if (this._viewHeight > this._viewportHeight) {
               config = {
                  stateBegin: 'disabled',
                  statePrev: 'disabled',
                  stateNext: 'normal',
                  stateEnd: 'normal'
               }
            }
            return config;
         },

         _onScroll: function(e) {
            var pCfg, scrollTop;
            scrollTop = e.target.scrollTop;

            pCfg = this.__getDefaultPagingConfig();
            if (scrollTop > 0) {
               pCfg.stateBegin = 'normal';
               pCfg.statePrev = 'normal';
            }
            if ((scrollTop + this._viewportHeight) >= this._viewHeight) {
               pCfg.stateNext = 'normal';
               pCfg.stateEnd = 'normal';
               pCfg.stateNext = 'disabled';
               pCfg.stateEnd = 'disabled';
            }

            this._notify('onChangePagingCfg', pCfg);
         },

         startObserve: function() {
            if (!this._onScrollHdl) {
               this._onScrollHdl = this._onScroll.bind(this);
            }
            this._options.scrollContainer.addEventListener('scroll', this._onScrollHdl);
            this._notify('onChangePagingCfg', this.__getDefaultPagingConfig());
         },

         stopObserve: function() {
            this._options.scrollContainer.removeEventListener('scroll', this._onScrollHdl);
            this._notify('onChangePagingCfg', {});
         },

         resetHeights: function() {
            this._cacheHeights(this._options.scrollContainer);
         },

         scrollView: function(btn) {

         },

         _cacheHeights: function(viewportCnt) {
            this._viewHeight = viewportCnt.scrollHeight;
            this._viewportHeight = viewportCnt.offsetHeight;
         }

      });

      return Paging;
   });
