/**
 * Created by kraynovdo on 20.02.2018.
 */
/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/List/Controllers/ScrollPaging',
   'WS.Data/Source/Memory',
   'Core/core-instance'
], function(ScrollPaging, MemorySource, cInstance){
   describe('Controls.Controllers.ScrollPaging', function () {
      var data, source;
      beforeEach(function() {
         data = [
            {
               id : 1,
               title : 'Первый',
               type: 1
            },
            {
               id : 2,
               title : 'Второй',
               type: 2
            },
            {
               id : 3,
               title : 'Третий',
               type: 2
            }
         ];
         source = new MemorySource({
            data: data,
            keyProperty: 'id'
         });

      });

      it('constructor', function () {
         var result;
         var spInstance = new ScrollPaging({
            pagingCfgTrigger: function(cfg) {
               result = cfg;
            }
         });
         assert('top', spInstance._curState, 'Wrong curState after ctor');

         assert.deepEqual({
            stateBegin: 'disabled',
            statePrev: 'disabled',
            stateNext: 'normal',
            stateEnd: 'normal'
         }, result, 'Wrong pagingCfg after ctor');
      });

      it('scroll', function () {
         var result;
         var spInstance = new ScrollPaging({
            pagingCfgTrigger: function(cfg) {
               result = cfg;
            }
         });

         spInstance.handleScroll();
         assert('middle', spInstance._curState, 'Wrong curState after scroll');
         assert.deepEqual({
            stateBegin: 'normal',
            statePrev: 'normal',
            stateNext: 'normal',
            stateEnd: 'normal'
         }, result, 'Wrong pagingCfg after scroll');

         spInstance.handleScrollTop();
         assert('top', spInstance._curState, 'Wrong curState after scroll to top');
         assert.deepEqual({
            stateBegin: 'disabled',
            statePrev: 'disabled',
            stateNext: 'normal',
            stateEnd: 'normal'
         }, result, 'Wrong pagingCfg after scroll');

         spInstance.handleScrollBottom();
         assert('bottom', spInstance._curState, 'Wrong curState after scroll to bottom');
         assert.deepEqual({
            stateBegin: 'normal',
            statePrev: 'normal',
            stateNext: 'disabled',
            stateEnd: 'disabled'
         }, result, 'Wrong pagingCfg after scroll');

         spInstance.handleScrollEdge('up');
         assert('top', spInstance._curState, 'Wrong curState after scroll to edge up');
         assert.deepEqual({
            stateBegin: 'disabled',
            statePrev: 'disabled',
            stateNext: 'normal',
            stateEnd: 'normal'
         }, result, 'Wrong pagingCfg after scroll');

         spInstance.handleScrollEdge('down');
         assert('bottom', spInstance._curState, 'Wrong curState after scroll to edge down');
         assert.deepEqual({
            stateBegin: 'normal',
            statePrev: 'normal',
            stateNext: 'disabled',
            stateEnd: 'disabled'
         }, result, 'Wrong pagingCfg after scroll');

      });
   })
});