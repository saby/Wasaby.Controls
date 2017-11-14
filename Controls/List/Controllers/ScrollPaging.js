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

         constructor: function(cfg) {
            this._options = cfg;
            Paging.superclass.constructor.apply(this, arguments);
            if (cfg.selectedPage) {
               this._selectedPage = cfg.selectedPage;
            }
            this._cacheHeights(cfg.scrollContainer);
         },

         getPagingCfg: function() {
            var pCfg = {};
            if (this._viewHeight > this._viewportHeight) {
               if (this._options.mode == 'direct') {
                  pCfg.stateBegin = 'disabled';
                  pCfg.statePrev = 'disabled';
                  pCfg.stateNext = 'normal';
                  pCfg.stateEnd = 'normal';
               }
            }
            return pCfg;
         },


         _cacheHeights: function(viewportCnt) {
            this._viewHeight = viewportCnt.scrollHeight;
            this._viewportHeight = viewportCnt.offsetHeight;
         }
      });

      return Paging;
   });
