define(['Controls/List/TileView/TileView',
   'Controls/List/TreeTileView/TreeTileViewModel',
   'WS.Data/Collection/RecordSet'
], function(TileView, TreeTileViewModel, RecordSet) {
   'use strict';

   var hoveredSize = {
      width: 60,
      height: 60
   };

   describe('Controls/List/TileView/TileView', function() {
      var
         treeTileViewModel = new TreeTileViewModel({
            tileMode: 'static',
            itemsHeight: 300,
            imageProperty: 'image',
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            items: new RecordSet({
               rawData: [{
                  'id': 1,
                  'parent': null,
                  'parent@': true
               }, {
                  'id': 2,
                  'parent': null,
                  'parent@': null
               }],
               idProperty: 'id'
            })
         }),
         cfg = {
            listModel: treeTileViewModel,
            keyProperty: 'id',
            hoverMode: 'outside'
         },
         tileView = new TileView(cfg);

      tileView.saveOptions(cfg);
      tileView._beforeMount(cfg);

      describe('getFixedPosition', function() {

         it('not fit left and right', function() {
            var position = TileView._private.getFixedPosition(hoveredSize, {
               left: 5,
               right: 45,
               top: 15,
               bottom: 55,
               width: 40,
               height: 40
            }, {
               width: 50,
               height: 70
            });

            assert.equal(position, null);
         });

         it('not fit right and bottom', function() {
            var position = TileView._private.getFixedPosition(hoveredSize, {
               left: 15,
               right: 55,
               top: 5,
               bottom: 45,
               width: 40,
               height: 40
            }, {
               width: 70,
               height: 50
            });

            assert.equal(position, null);
         });

         it('not fit left and top', function() {
            var position = TileView._private.getFixedPosition(hoveredSize, {
               left: 5,
               right: 45,
               top: 5,
               bottom: 45,
               width: 40,
               height: 40
            }, {
               width: 70,
               height: 70
            });

            assert.deepEqual(position, {
               left: 0,
               right: 10,
               top: 0,
               bottom: 10
            });
         });

         it('not fit right and bottom', function() {
            var position = TileView._private.getFixedPosition(hoveredSize, {
               left: 25,
               right: 65,
               top: 25,
               bottom: 65,
               width: 40,
               height: 40
            }, {
               width: 70,
               height: 70
            });

            assert.deepEqual(position, {
               left: 10,
               right: 0,
               top: 10,
               bottom: 0
            });
         });

         it('all fit', function() {
            var position = TileView._private.getFixedPosition(hoveredSize, {
               left: 15,
               right: 55,
               top: 15,
               bottom: 55,
               width: 40,
               height: 40
            }, {
               width: 70,
               height: 70
            });

            assert.deepEqual(position, {
               left: 5,
               right: 5,
               top: 5,
               bottom: 5
            });
         });
      });

      it('getPositionStyle', function() {
         var position = TileView._private.getPositionStyle(null);
         assert.equal(position, '');
         position = TileView._private.getPositionStyle({
            left: 5, right: 10, top: 15, bottom: 20
         });
         assert.equal(position, 'left: 5px; right: 10px; top: 15px; bottom: 20px; ');
      });

      it('_setFixedItem', function() {
         var hoveredItem;

         tileView._setFixedItem(hoveredSize, {
            left: 15,
            right: 55,
            top: 15,
            bottom: 55,
            width: 40,
            height: 40
         }, {
            width: 70,
            height: 70
         }, 'itemKey1');

         hoveredItem = tileView._listModel.getHoveredItem();
         assert.deepEqual(hoveredItem.fixedPosition, 'left: 5px; right: 5px; top: 5px; bottom: 5px; ');
         assert.deepEqual(hoveredItem.key, 'itemKey1');

         tileView._setFixedItem(hoveredSize, {
            left: 5,
            right: 45,
            top: 15,
            bottom: 55,
            width: 40,
            height: 40
         }, {
            width: 50,
            height: 70
         }, 'itemKey2');

         hoveredItem = tileView._listModel.getHoveredItem();
         assert.deepEqual(hoveredItem.fixedPosition, '');
         assert.deepEqual(hoveredItem.key, 'itemKey2');
      });

      it('_afterMount', function() {
         var events = [];
         tileView._notify = function(eventName, args) {
            events.push(args[0]);
         };
         tileView._afterMount();
         assert.deepEqual(events, ['controlResize', 'scroll']);
      });

      it('_beforeUnmount', function() {
         var events = [];
         tileView._notify = function(eventName, args) {
            events.push(args[0]);
         };
         tileView._beforeUnmount();
         assert.deepEqual(events, ['controlResize', 'scroll']);
      });

      it('_beforeUpdate', function() {
         tileView._beforeUpdate({
            tileMode: 'dynamic',
            itemsHeight: 200
         });
         assert.equal(tileView._listModel.getTileMode(), 'dynamic');
         assert.equal(tileView._listModel.getItemsHeight(), 200);
      });

      it('_onResize', function() {
         tileView._listModel.setHoveredItem({key: 1});
         tileView._onResize();
         assert.equal(tileView._listModel.getHoveredItem(), null);
      });

      it('_onScroll, _onItemWheel', function() {
         var
            timeout,
            clearTimeoutOrigin = clearTimeout;

         clearTimeout = function(id) {
            timeout = id;
         };

         tileView._listModel.setHoveredItem({key: 1});
         tileView._mouseMoveTimeout = 'timeoutId1';
         tileView._onScroll();
         assert.equal(tileView._listModel.getHoveredItem(), null);
         assert.equal(timeout, 'timeoutId1');

         tileView._listModel.setHoveredItem({key: 2});
         tileView._mouseMoveTimeout = 'timeoutId2';
         tileView._onItemWheel();
         assert.equal(tileView._listModel.getHoveredItem(), null);
         assert.equal(timeout, 'timeoutId2');
         clearTimeout = clearTimeoutOrigin;
      });

      it('_onItemMouseMove', function() {
         var
            isTouch = true,
            timeoutCount = 0,
            setTimeoutOrigin = setTimeout;

         setTimeout = function() {
            timeoutCount++;
            return timeoutCount;
         };

         TileView._private.isTouch = function() {
            return isTouch;
         };
         tileView._listModel.setHoveredItem({key: 1});
         tileView._onItemMouseMove(null, {key: 1});
         assert.isFalse(!!tileView._mouseMoveTimeout);
         assert.equal(tileView._listModel.getHoveredItem().key, 1);

         tileView._listModel.setHoveredItem(null);
         tileView._onItemMouseMove(null, {key: 2});
         assert.isFalse(!!tileView._mouseMoveTimeout);
         assert.equal(tileView._listModel.getHoveredItem().key, 2);

         tileView._listModel.setHoveredItem(null);
         isTouch = false;
         tileView._onItemMouseMove(null, {key: 3});
         assert.equal(tileView._mouseMoveTimeout, 1);
         tileView._onItemMouseMove(null, {key: 3});
         assert.equal(tileView._mouseMoveTimeout, 2);

         setTimeout = setTimeoutOrigin;
      });

      it('_onItemMouseLeave', function() {
         tileView._listModel.setHoveredItem({key: 2});

         //active
         tileView._onItemMouseLeave(null, {key: 2, isActive: true});
         assert.equal(tileView._listModel.getHoveredItem().key, 2);

         //another
         tileView._onItemMouseLeave(null, {key: 1});
         assert.equal(tileView._listModel.getHoveredItem().key, 2);

         //hovered
         tileView._onItemMouseLeave(null, {key: 2});
         assert.equal(tileView._listModel.getHoveredItem(), null);
      });
   });
});
