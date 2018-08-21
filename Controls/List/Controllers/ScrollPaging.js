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
       * @author Авраменко А.С.
       * @public
       */

      var Paging = cExtend.extend({
         _curState: null,

         constructor: function(cfg) {
            this._options = cfg;
            Paging.superclass.constructor.apply(this, arguments);

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

         handleScrollEdge: function(direction) {
            switch (direction) {
               case 'up': this.handleScrollTop(); break;
               case 'down': this.handleScrollBottom(); break;
            }
         },


         destroy: function() {
            this._options = {};
         }

      });

      return Paging;
   });
