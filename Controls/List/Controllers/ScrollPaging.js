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
      var _private = {
         getDefaultPagingConfig: function(viewHeight, viewportHeight) {
            var config = {};
            if (viewHeight > viewportHeight) {
               config = {
                  stateBegin: 'disabled',
                  statePrev: 'disabled',
                  stateNext: 'normal',
                  stateEnd: 'normal'
               }
            }
            return config;
         },

         getPagingConfig: function(viewHeight, viewportHeight, scrollTop) {
            var defConfig = _private.getDefaultPagingConfig(viewHeight, viewportHeight);
            if (scrollTop > 0) {
               defConfig.stateBegin = 'normal';
               defConfig.statePrev = 'normal';
            }
            if ((scrollTop + viewportHeight) >= viewHeight) {
               defConfig.stateNext = 'normal';
               defConfig.stateEnd = 'normal';
               defConfig.stateNext = 'disabled';
               defConfig.stateEnd = 'disabled';
            }

            return defConfig;
         }
      };


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


         _onScroll: function(e) {
            var pCfg, scrollTop;
            scrollTop = e.target.scrollTop;
            pCfg = _private.getPagingConfig(this._viewHeight, this._viewportHeight, scrollTop);

            this._notify('onChangePagingCfg', [pCfg]);
         },

         startObserve: function() {
            if (!this._onScrollHdl) {
               this._onScrollHdl = this._onScroll.bind(this);
            }
            this._options.scrollContainer.addEventListener('scroll', this._onScrollHdl);
            this._notify('onChangePagingCfg', [_private.getDefaultPagingConfig(this._viewHeight, this._viewportHeight)]);
         },

         stopObserve: function() {
            this._options.scrollContainer.removeEventListener('scroll', this._onScrollHdl);
            this._notify('onChangePagingCfg', [{}]);
         },

         resetHeights: function() {
            this._cacheHeights(this._options.scrollContainer);

            this._notify('onChangePagingCfg', [_private.getPagingConfig(this._viewHeight, this._viewportHeight, this._options.scrollContainer.scrollTop)]);
         },

         scrollView: function(btn) {
            switch (btn) {
               case 'Begin': this._options.scrollContainer.scrollTop = 0; break;
               case 'End': this._options.scrollContainer.scrollTop = this._viewHeight - this._viewportHeight; break;
            }
         },

         scrollForward: function() {
            this._options.scrollContainer.scrollTop += this._viewportHeight;
         },

         scrollBackward: function() {
            this._options.scrollContainer.scrollTop -= this._viewportHeight;
         },

         _cacheHeights: function(viewportCnt) {
            this._viewHeight = viewportCnt.scrollHeight;
            this._viewportHeight = viewportCnt.offsetHeight;
         },

         destroy: function() {
            this.stopObserve();
            Paging.superclass.destroy.apply(this, arguments);
         }

      });

      return Paging;
   });
