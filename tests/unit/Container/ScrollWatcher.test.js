/**
 * Created by kraynovdo on 22.02.2018.
 */
/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/scroll',
   'Types/source',
   'Core/core-instance'
], function(scrollMod, source, cInstance){
   describe('Controls.Container.Scroll.Watcher', function () {
      var registrarMock, evType = [];
      beforeEach(function() {
         registrarMock = {
            start: function(eType) {
               evType.push(eType);
            }
         };

      });

      it('sendCanScroll', function () {
         var ins = new scrollMod.Watcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;

         clientHeight = 300;
         scrollHeight = 300;
         evType = [];
         scrollMod.Watcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual(['cantScroll'], evType, 'Wrong scroll possibility');
         assert.isFalse(ins._canScrollCache, 'Wrong scroll possibility cache');

         clientHeight = 200;
         scrollHeight = 200;
         evType = [];
         scrollMod.Watcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual([], evType, 'Similar event twice');

         scrollHeight = 400;
         evType = [];
         scrollMod.Watcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual(['canScroll'], evType, 'Wrong can scroll value');

      });

      it('sendEdgePositions', function () {
         var ins = new scrollMod.Watcher(), clientHeight, scrollHeight, scrollTop;
         ins._registrar = registrarMock;

         clientHeight = 300;
         scrollHeight = 3000;
         scrollTop = 0;
         evType = [];
         scrollMod.Watcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['listTop', 'loadTopStart', 'loadBottomStop'], evType, 'Wrong scroll commands');

         scrollTop = 99;
         evType = [];
         scrollMod.Watcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['loadTopStart', 'loadBottomStop'], evType, 'Wrong scroll commands');

         scrollTop = 2700;
         evType = [];
         scrollMod.Watcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['listBottom', 'loadTopStop', 'loadBottomStart'], evType, 'Wrong scroll commands');

         scrollTop = 2601;
         evType = [];
         scrollMod.Watcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['loadTopStop', 'loadBottomStart'], evType, 'Wrong scroll commands');

         scrollTop = 1500;
         evType = [];
         scrollMod.Watcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['loadTopStop', 'loadBottomStop'], evType, 'Wrong scroll commands');
      });

      it('calcSizeCache', function () {
         var ins = new scrollMod.Watcher();
         var containerMock = {
            clientHeight: 300,
            scrollHeight: 3000
         };

         scrollMod.Watcher._private.calcSizeCache(ins, containerMock);
         assert.deepEqual(containerMock, ins._sizeCache, 'Wrong size cache values');
      });

      it('onResizeContainer', function () {
         var ins = new scrollMod.Watcher();
         ins._registrar = registrarMock;
         var containerMock = {
            scrollTop: 0,
            clientHeight: 300,
            scrollHeight: 400
         };

         ins._scrollTopCache = 111;
         evType = [];
         scrollMod.Watcher._private.onResizeContainer(ins, containerMock, true);
         assert.deepEqual({clientHeight: 300, scrollHeight: 400}, ins._sizeCache, 'Wrong size cache values');
         assert.deepEqual(111, containerMock.scrollTop, 'Wrong scrollTop value after resize');
         assert.deepEqual(['canScroll'], evType, 'Wrong can scroll value');

         evType = [];
         scrollMod.Watcher._private.onResizeContainer(ins, containerMock);
         assert.deepEqual(['listBottom', 'loadTopStop', 'loadBottomStart'], evType, 'Not send edge positions without observer');
      });

      it('onScrollContainer', function () {
         var ins = new scrollMod.Watcher();
         ins._registrar = registrarMock;
         var containerMock = {
            scrollTop: 111,
            clientHeight: 300,
            scrollHeight: 400
         };

         evType = [];
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock);
         assert.deepEqual(['scrollMove', 'listBottom', 'loadTopStop', 'loadBottomStart'], evType, 'Wrong scroll commands on change scroll without observer');

         evType = [];
         ins._scrollPositionCache = null;
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);
         assert.deepEqual(['scrollMove'], evType, 'Wrong scroll commands on change scroll with observer');

         assert.equal(111, ins._scrollTopCache, 'Wrong scrollTop cache value after scroll');

      });

      it('onScrollContainer debounce 3', function (done) {
         //fast scrolling: 3 scroll events and check after 100ms
         var ins = new scrollMod.Watcher();
         var registrarMockDebounce = {
            start: function(type, args) {
               evType.push({
                  eType: type,
                  eArgs: args
               });
            }
         };
         ins._registrar = registrarMockDebounce;
         var containerMock = {
            scrollTop: 2,
            clientHeight: 300,
            scrollHeight: 400
         };

         evType = [];
         ins._scrollPositionCache = 'middle';
         //fast scrolling: 3 scroll events and check after 100ms
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);

         containerMock.scrollTop = 12;
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);

         containerMock.scrollTop = 22;
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);

         setTimeout(function(){
            assert.deepEqual([
               {eType: 'scrollMove', eArgs : {position : "middle", scrollTop: 22}}
            ], evType, 'Wrong scroll commands on change scroll without observer');
            done();
         }, 100);
      });

      it('onScrollContainer debounce 2 + 1', function (done) {
         //fast scrolling: 3 scroll events and check after 100ms
         var ins = new scrollMod.Watcher();
         var registrarMockDebounce = {
            start: function(type, args) {
               evType.push({
                  eType: type,
                  eArgs: args
               });
            }
         };
         ins._registrar = registrarMockDebounce;
         var containerMock = {
            scrollTop: 2,
            clientHeight: 300,
            scrollHeight: 400
         };

         evType = [];
         //fast scrolling
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);

         evType = [];
         containerMock.scrollTop = 12;
         scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);


         setTimeout(function(){
            containerMock.scrollTop = 22;
            scrollMod.Watcher._private.onScrollContainer(ins, containerMock, true);
            setTimeout(function() {
               assert.deepEqual([
                  {eType: 'scrollMove', eArgs: {position: "middle", scrollTop: 12}},
                  {eType: 'scrollMove', eArgs: {position: "middle", scrollTop: 22}}
               ], evType, 'Wrong scroll commands on change scroll without observer');
               done();
            }, 100);

         }, 100);

      });

      it('doScroll', function () {
         var ins = new scrollMod.Watcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;
         var containerMock = {
            scrollTop: 20,
            clientHeight: 300,
            scrollHeight: 3000
         };
         ins._container = containerMock;
         ins._scrollTopCache = containerMock.scrollTop;
         scrollMod.Watcher._private.calcSizeCache(ins, containerMock);


         scrollMod.Watcher._private.doScroll(ins, 'top', containerMock);
         assert.deepEqual(0, containerMock.scrollTop, 'Wrong scrollTop');

         scrollMod.Watcher._private.doScroll(ins, 'bottom', containerMock);
         assert.deepEqual(2700, containerMock.scrollTop, 'Wrong scrollTop');

         containerMock.scrollTop = 0;
         scrollMod.Watcher._private.doScroll(ins, 'pageDown', containerMock);
         assert.deepEqual(300, containerMock.scrollTop, 'Wrong scrollTop');

         containerMock.scrollTop = 1000;
         scrollMod.Watcher._private.doScroll(ins, 'pageUp', containerMock);
         assert.deepEqual(700, containerMock.scrollTop, 'Wrong scrollTop');
      });
   })
});
