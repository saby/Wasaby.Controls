/**
 * Created by kraynovdo on 22.02.2018.
 */
/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/Container/Scroll/Watcher',
   'WS.Data/Source/Memory',
   'Core/core-instance'
], function(ScrollWatcher, MemorySource, cInstance){
   describe('Controls.Container.Scroll.Watcher', function () {
      var registrarMock, containerMock, evType = [];
      beforeEach(function() {
         registrarMock = {
            start: function(eType) {
               evType.push(eType);
            }
         };
         containerMock = {};

      });

      it('sendCanScroll', function () {
         var ins = new ScrollWatcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;

         clientHeight = 300;
         scrollHeight = 300;
         evType = [];
         ScrollWatcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual(['cantScroll'], evType, 'Wrong scroll possibility');
         assert.isFalse(ins._canScrollCache, 'Wrong scroll possibility cache');

         clientHeight = 200;
         scrollHeight = 200;
         evType = [];
         ScrollWatcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual([], evType, 'Similar event twice');

         scrollHeight = 400;
         evType = [];
         ScrollWatcher._private.sendCanScroll(ins, clientHeight, scrollHeight);
         assert.deepEqual(['canScroll'], evType, '111');

      });

      it('sendEdgePositions', function () {
         var ins = new ScrollWatcher(), clientHeight, scrollHeight, scrollTop;
         ins._registrar = registrarMock;

         clientHeight = 300;
         scrollHeight = 3000;
         scrollTop = 0;
         evType = [];
         ScrollWatcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['listTop', 'loadTop'], evType, 'Wrong scroll commands');

         scrollTop = 99;
         evType = [];
         ScrollWatcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['loadTop'], evType, 'Wrong scroll commands');

         scrollTop = 2700;
         evType = [];
         ScrollWatcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['listBottom', 'loadBottom'], evType, 'Wrong scroll commands');

         scrollTop = 2601;
         evType = [];
         ScrollWatcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual(['loadBottom'], evType, 'Wrong scroll commands');

         scrollTop = 1500;
         evType = [];
         ScrollWatcher._private.sendEdgePositions(ins, clientHeight, scrollHeight, scrollTop);
         assert.deepEqual([], evType, 'Wrong scroll commands');
      });

      it('onInitScroll', function () {
         var ins = new ScrollWatcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;
         containerMock = {
            scrollTop: 0,
            clientHeight: 300,
            scrollHeight: 3000
         };


         evType = [];
         ScrollWatcher._private.onInitScroll(ins, containerMock);
         assert.deepEqual(['canScroll'], evType, 'Wrong scroll commands on init');
      });

      it('onChangeScroll', function () {
         var ins = new ScrollWatcher();
         ins._registrar = registrarMock;
         containerMock = {
            scrollTop: 0,
            clientHeight: 300,
            scrollHeight: 3000
         };

         evType = [];
         ScrollWatcher._private.onChangeScroll(ins, containerMock);
         assert.deepEqual(['canScroll', 'listTop', 'loadTop'], evType, 'Wrong scroll commands on change scroll');
      });

      it('doScroll', function () {
         var ins = new ScrollWatcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;
         containerMock = {
            scrollTop: 20,
            clientHeight: 300,
            scrollHeight: 3000
         };
         ins._container = containerMock;

         ScrollWatcher._private.doScroll(ins, 'top', containerMock);
         assert.deepEqual(0, containerMock.scrollTop, 'Wrong scrollTop');

         ScrollWatcher._private.doScroll(ins, 'bottom', containerMock);
         assert.deepEqual(2700, containerMock.scrollTop, 'Wrong scrollTop');

         containerMock.scrollTop = 0;
         ScrollWatcher._private.doScroll(ins, 'pageDown', containerMock);
         assert.deepEqual(300, containerMock.scrollTop, 'Wrong scrollTop');

         containerMock.scrollTop = 1000;
         ScrollWatcher._private.doScroll(ins, 'pageUp', containerMock);
         assert.deepEqual(700, containerMock.scrollTop, 'Wrong scrollTop');
      });

      it('_scrollHandler', function (done) {
         var ins = new ScrollWatcher(), clientHeight, scrollHeight;
         ins._registrar = registrarMock;
         containerMock = {
            scrollTop: 0,
            clientHeight: 300,
            scrollHeight: 3000
         };
         ins._container = containerMock;

         evType = [];
         ins._scrollHandler({target: containerMock});

         //работает через throttle поэтому проверка нужна по таймауту
         setTimeout(function() {
            assert.deepEqual(['scrollMove', 'canScroll', 'listTop', 'loadTop'], evType, 'Wrong scroll commands on _scrollHandler');
            done();
         }, 101);
      });
   })
});