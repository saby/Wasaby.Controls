/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'Controls/List/ListViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Collection/RecordSet'
], function(ListViewModel, ItemsUtil, RecordSet){
   describe('Controls.List.ListControl.ListViewModel', function () {
      var data, data2, display;
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
         ]; data2 = [
            {
               id : 4,
               title : 'Четвертый',
               type: 1
            },
            {
               id : 5,
               title : 'Пятый',
               type: 2
            },
            {
               id : 6,
               title : 'Шестой',
               type: 2
            }
         ];

      });

      it('getCurrent', function () {
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


      it('Selection', function () {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            markedKey: 2
         };

         var iv = new ListViewModel(cfg);
         var marItem = iv._markedItem;
         assert.equal(iv._display.at(1), marItem, 'Incorrect selectedItem');


         iv.setMarkedKey(3);
         marItem = iv._markedItem;
         assert.equal(iv._display.at(2), marItem, 'Incorrect selectedItem');
         assert.equal(1, iv.getVersion(), 'Incorrect version appendItems');
      });

      it('setDragTargetItem and setDragItems', function() {
         var
            dragItems = [1],
            target = {index: 1, id: 2},
            notifyCont = 0,
            lvm = new ListViewModel({
               items: data,
               keyProperty: 'id'
            });

         lvm._notify = function() {
            notifyCont++;
         };

         assert.equal(lvm._dragItems, null);
         lvm.setDragItems(dragItems);
         assert.equal(notifyCont, 1);
         lvm.setDragItems(dragItems);
         assert.equal(notifyCont, 1);

         assert.equal(lvm._dragTargetItem, null);
         lvm.setDragTargetItem(target);
         assert.deepEqual(lvm._dragTargetPosition, {index: 1, position: 'after'});
         assert.equal(notifyCont, 2);
         lvm.setDragTargetItem(target);
         assert.equal(notifyCont, 2);
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
         iv._updateSelection([2, 3]);
         assert.deepEqual(iv._selectedKeys, [2, 3]);
      });
   });

});
