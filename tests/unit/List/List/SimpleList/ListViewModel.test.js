/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'Controls/List/ListViewModel',
   'WS.Data/Collection/RecordSet'
], function(
   ListViewModel, RecordSet
) {
   describe('Controls.List.ListControl.ListViewModel', function() {
      var data;
      beforeEach(function() {
         data = [
            {
               id: 1,
               title: 'Первый',
               type: 1
            },
            {
               id: 2,
               title: 'Второй',
               type: 2
            },
            {
               id: 3,
               title: 'Третий',
               type: 2
            }
         ];
      });

      it('getCurrent', function() {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            markedKey: 1,
            selectedKeys: [data[0].id]
         };

         var iv = new ListViewModel(cfg);

         var cur = iv.getCurrent();
         assert.equal('id', cur.keyProperty, 'Incorrect field set on getCurrent()');
         assert.equal('title', cur.displayProperty, 'Incorrect field set on getCurrent()');
         assert.equal(0, cur.index, 'Incorrect field set on getCurrent()');
         assert.deepEqual(data[0], cur.item, 'Incorrect field set on getCurrent()');
         assert.isTrue(cur.isSelected, 'Incorrect field set on getCurrent()');
         assert.isTrue(cur.multiSelectStatus, 'Incorrect field set on getCurrent()');
      });

      it('Selection', function() {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            markedKey: 2
         };

         var iv = new ListViewModel(cfg);
         var marItem = iv._markedItem;
         assert.equal(iv._display.at(1), marItem, 'Incorrect selectedItem');
         assert.equal(iv._markedKey, 2, 'Incorrect _markedKey value');


         iv.setMarkedKey(3);
         marItem = iv._markedItem;
         assert.equal(2, iv._options.markedKey, 'Incorrect markedKey option value');
         assert.equal(iv._markedKey, 3, 'Incorrect _markedKey value');
         assert.equal(iv._display.at(2), marItem, 'Incorrect selectedItem');
         assert.equal(1, iv.getVersion(), 'Incorrect version appendItems');
      });

      it('markerVisibility', function() {
         var
            cfg = {
               keyProperty: 'id',
               markerVisibility: 'always'
            },
            listModel = new ListViewModel(cfg);

         listModel.setItems(new RecordSet({rawData: data, idProperty: 'id'}));
         assert.equal(listModel._markedKey, 1, 'Incorrect _markedKey value after setItems.');
         assert.equal(listModel._markedItem, listModel._display.at(0), 'Incorrect _markedItem after setItems.');
      });

      it('_updateSelection', function() {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            selectedKeys: [1]
         };

         var iv = new ListViewModel(cfg);
         assert.deepEqual(iv._selectedKeys, [1]);
         iv.updateSelection([2, 3]);
         assert.deepEqual(iv._selectedKeys, [2, 3]);
      });

      it('setSwipeItem', function() {
         var
            cfg = {
               items: data,
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKeys: [1]
            },
            itemData = {
               test: 'test'
            },
            nextVersionCalled = false;

         var lv = new ListViewModel(cfg);
         lv._nextVersion = function() {
            nextVersionCalled = true;
         };
         lv.setSwipeItem(itemData);
         assert.equal(lv._swipeItem, itemData);
         assert.isTrue(nextVersionCalled, 'setSwipeItem should change version of the model');
      });

      describe('DragNDrop methods', function() {
         var dragItemData, dragEntity, target, lvm, current;

         beforeEach(function() {
            dragItemData = {};
            dragEntity = {
               items: [2, 3],
               getItems: function() {
                  return this.items;
               }
            };
            target = { index: 1, key: 2, position: 'after'};
            lvm = new ListViewModel({
               items: data,
               keyProperty: 'id'
            });
         });

         it('setDragTargetPosition', function() {
            assert.equal(lvm.getDragTargetPosition(), null);
            lvm.setDragTargetPosition(target);
            assert.equal(lvm.getDragTargetPosition(), target);
            lvm.setDragTargetPosition(null);
            assert.equal(lvm.getDragTargetPosition(), null);
         });

         it('setDragEntity', function() {
            assert.equal(lvm.getDragEntity(), null);
            lvm.setDragEntity(dragEntity);
            assert.equal(lvm.getDragEntity(), dragEntity);
            lvm.setDragEntity(null);
            assert.equal(lvm.getDragEntity(), null);
         });

         it('setDragItemData', function() {
            assert.equal(lvm.getDragItemData(), null);
            lvm.setDragItemData(dragItemData);
            assert.equal(lvm.getDragItemData(), dragItemData);
            assert.isTrue(dragItemData.isDragging);
            lvm.setDragItemData(null);
            assert.equal(lvm.getDragItemData(), null);
         });

         describe('getItemDataByItem', function() {
            it('without dragNDrop', function() {
               current = lvm.getItemDataByItem(lvm.at(1));
               assert.equal(current.isDragging, undefined);
               assert.equal(current.isVisible, undefined);
               assert.equal(current.dragTargetPosition, undefined);
               assert.equal(current.draggingItemData, undefined);
            });

            it('without dragTarget and dragEntity', function() {
               lvm.setDragItemData(lvm.getItemDataByItem(lvm.at(1)));
               lvm.setDragEntity(dragEntity);

               current = lvm.getItemDataByItem(lvm.at(1));
               assert.equal(current.isDragging, true);
               assert.equal(current.isVisible, true);
               assert.equal(current.dragTargetPosition, undefined);
               assert.equal(current.draggingItemData, undefined);
            });

            it('without dragTarget', function() {
               lvm.setDragItemData(lvm.getItemDataByItem(lvm.at(1)));
               lvm.setDragEntity(dragEntity);

               current = lvm.getItemDataByItem(lvm.at(1));
               assert.equal(current.isDragging, true);
               assert.equal(current.isVisible, true);
               assert.equal(current.dragTargetPosition, undefined);
               assert.equal(current.draggingItemData, undefined);
               current = lvm.getItemDataByItem(lvm.at(2));
               assert.equal(current.isVisible, false);
            });

            it('with dragTarget', function() {
               dragItemData = lvm.getItemDataByItem(lvm.at(1));
               lvm.setDragItemData(dragItemData);
               lvm.setDragEntity(dragEntity);

               //move up
               lvm.setDragTargetPosition(lvm.calculateDragTargetPosition(lvm.getItemDataByItem(lvm.at(0))));
               current = lvm.getItemDataByItem(lvm.at(0));
               assert.equal(current.dragTargetPosition, 'before');
               assert.equal(current.draggingItemData, dragItemData);

               //move down
               lvm.setDragTargetPosition(lvm.calculateDragTargetPosition(lvm.getItemDataByItem(lvm.at(2))));
               current = lvm.getItemDataByItem(lvm.at(2));
               assert.equal(current.dragTargetPosition, 'after');
               assert.equal(current.draggingItemData, dragItemData);
            });
         });

         describe('calculateDragTargetPosition', function() {
            var
               itemData,
               dragItemData,
               dragTargetPosition;

            it('without setDragTargetPosition and without setDragItemData', function() {
               itemData = lvm.getItemDataByItem(lvm.at(1));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');
            });

            it('without setDragTargetPosition', function() {
               dragItemData = lvm.getItemDataByItem(lvm.at(1));
               lvm.setDragItemData(dragItemData);
               lvm.setDragEntity(dragEntity);

               //before dragItemData
               itemData = lvm.getItemDataByItem(lvm.at(0));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');

               //after dragItemData
               itemData = lvm.getItemDataByItem(lvm.at(2));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'after');
            });

            it('with setDragTargetPosition', function() {
               itemData = lvm.getItemDataByItem(lvm.at(1));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               lvm.setDragTargetPosition(dragTargetPosition);

               //move up
               itemData = lvm.getItemDataByItem(lvm.at(0));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');

               //move down
               itemData = lvm.getItemDataByItem(lvm.at(1));
               dragTargetPosition = lvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'after');
            });
         });
      });
   });
});
