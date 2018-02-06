/**
 * Created by kraynovdo on 13.11.2017.
 */
define('Controls/List/Controllers/ScrollPaging',
   [
      'Core/core-simpleExtend'
   ],
   function(cExtend) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */

      var Paging = cExtend.extend({
         _curState: null,

         constructor: function(cfg) {
            this._options = cfg;
            Paging.superclass.constructor.apply(this, arguments);

            //изначально пэйджинг в положении прокручено сверху
            this.handleScrollTop();
         },


         handleScroll: function() {
            if (!(this._curState === 'middle')) {
               this._options.pagingCfgTrigger({
                  stateBegin: 'normal',
                  statePrev: 'normal',
                  stateNext: 'normal',
                  stateEnd: 'normal'
               });
               this._curState = 'middle';
            }
         },

         handleScrollTop: function() {
            if (!(this._curState === 'top')) {
               this._options.pagingCfgTrigger({
                  stateBegin: 'disabled',
                  statePrev: 'disabled',
                  stateNext: 'normal',
                  stateEnd: 'normal'
               });
               this._curState = 'top';
            }
         },

         handleScrollBottom: function() {
            if (!(this._curState === 'bottom')) {
               this._options.pagingCfgTrigger({
                  stateBegin: 'normal',
                  statePrev: 'normal',
                  stateNext: 'disabled',
                  stateEnd: 'disabled'
               });
               this._curState = 'bottom';
            }

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
            this._options = {};
         }

      });

      return Paging;
   });
