/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'Controls/List/ItemsViewModel',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Collection/RecordSet',
   'Controls/Constants'
], function(ItemsViewModel, ItemsUtil, RecordSet, ControlsConstants){
   describe('Controls.List.ListControl.ItemsViewModel', function () {
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
         ];
         data2 = [
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
      it('Display', function () {
         var cfg = {
            items: data,
            keyProperty: 'id'
         };
         var iv = new ItemsViewModel(cfg);

         var disp = iv._display;
         assert.equal(data.length, disp.getCount(), 'Incorrect display\'s creating before mounting');

      });

      it('Enumeration', function () {
         var cfg = {
            items: data,
            keyProperty: 'id'
         };

         var iv = new ItemsViewModel(cfg);



         assert.equal(0, iv._curIndex, 'Incorrect start enumeration index after constructor');

         iv._curIndex = 3;
         iv.reset();
         assert.equal(0, iv._curIndex, 'Incorrect current enumeration index after reset()');

         iv.goToNext();
         iv.goToNext();
         assert.equal(2, iv._curIndex, 'Incorrect current enumeration index after 2x_goToNext');

         var condResult = iv.isEnd();
         assert.isTrue(condResult, 'Incorrect condition value enumeration index after 2x_goToNext');
         iv.goToNext();
         condResult = iv.isEnd();
         assert.isFalse(condResult, 'Incorrect condition value enumeration index after 3x_goToNext');
      });

      it('Other', function () {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title'
         };

         var iv = new ItemsViewModel(cfg);

         var cur = iv.getCurrent();
         assert.equal('id', cur.keyProperty, 'Incorrect field set on getCurrent()');
         assert.equal('title', cur.displayProperty, 'Incorrect field set on getCurrent()');
         assert.equal(0, cur.index, 'Incorrect field set on getCurrent()');
         assert.deepEqual(data[0], cur.item, 'Incorrect field set on getCurrent()');


      });

      it('setItems', function () {
         var rs1 = new RecordSet({
            rawData: data,
            idProperty : 'id'
         });
         var rs2 = new RecordSet({
            rawData: data2,
            idProperty : 'id'
         });

         var cfg1 = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title'
         };

         var cfg2 = {
            items: rs1,
            keyProperty: 'id',
            displayProperty: 'title'
         };

         //первый кейс - были items - массив, а ставим рекордсет. Должен полностью смениться инстанс
         var iv = new ItemsViewModel(cfg1);
         iv.setItems(rs2);
         assert.equal(rs2, iv._items, 'Incorrect items after setItems');
         assert.equal(1, iv.getVersion(), 'Incorrect version setItems');


         //второй кейс - были items - рекордсет, и ставим рекордсет. Должен остаться инстанс старого, но данные новые
         iv = new ItemsViewModel(cfg2);
         iv.setItems(rs2);
         assert.equal(rs1, iv._items, 'Incorrect items after setItems');
         assert.equal(4, iv._items.at(0).get('id'), 'Incorrect items after setItems');
         assert.equal(1, iv.getVersion(), 'Incorrect version setItems');

      });

      it('Append', function () {
         var rs1 = new RecordSet({
            rawData: data,
            idProperty : 'id'
         });
         var rs2 = new RecordSet({
            rawData: data2,
            idProperty : 'id'
         });
         var cfg1 = {
            items: rs1,
            keyProperty: 'id',
            displayProperty: 'title'
         };

         var iv = new ItemsViewModel(cfg1);
         iv.appendItems(rs2);

         assert.equal(6, iv._items.getCount(), 'Incorrect items count after appendItems');
         assert.equal(4, iv._items.at(3).get('id'), 'Incorrect items after appendItems');
         assert.equal(1, iv.getVersion(), 'Incorrect version appendItems');

      });

      it('getPaddingClassList', function() {
         var cfg = {
            rightPadding: 'XS',
            leftSpacing: 'M'
         };

         var ivm = new ItemsViewModel(cfg);
         var classList = ' controls-ListView__item-rightPadding_XS controls-ListView__item-leftPadding_M';
         assert.isTrue(classList === ivm.getPaddingClassList());
      });

      it('Prepend', function () {
         var rs1 = new RecordSet({
            rawData: data,
            idProperty : 'id'
         });
         var rs2 = new RecordSet({
            rawData: data2,
            idProperty : 'id'
         });
         var cfg1 = {
            items: rs1,
            keyProperty: 'id',
            displayProperty: 'title'
         };

         var iv = new ItemsViewModel(cfg1);
         iv.prependItems(rs2);

         assert.equal(6, iv._items.getCount(), 'Incorrect items count after prependItems');
         assert.equal(1, iv._items.at(3).get('id'), 'Incorrect items after prependItems');
         assert.equal(1, iv.getVersion(), 'Incorrect version prependItems');

      });

      it('itemsReadyCallback', function () {
         var rs1 = new RecordSet({
            rawData: data,
            keyProperty : 'id'
         });
         var rs2 = new RecordSet({
            rawData: data2,
            keyProperty : 'id'
         });




         var result, callback, cfg;

         callback = function() {
            result = 1;
         };

         cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            itemsReadyCallback: callback
         };

         result = 0;
         var iv = new ItemsViewModel(cfg);
         assert.equal(1, result, 'itemsReadycallback wasn\'t call');

         result = 0;
         iv.setItems(rs2);
         assert.equal(1, result, 'itemsReadycallback wasn\'t call');
      });

      it('groupMethod', function() {
         var
            current,
            data = [
               { id: 1, title: 'item_1', group: 'hidden' },
               { id: 1, title: 'item_2', group: 'group_1' },
               { id: 2, title: 'item_3', group: 'group_1' },
               { id: 3, title: 'item_4', group: 'group_1' },
               { id: 4, title: 'item_5', group: 'group_2' },
               { id: 5, title: 'item_6', group: 'group_2' }
            ],
            items = new RecordSet({
               rawData: data,
               keyProperty : 'id'
            }),
            cfg = {
               items: items,
               keyProperty: 'id',
               groupMethod: function(item) {
                  if (item.get('group') === 'hidden') {
                     return ControlsConstants.view.hiddenGroup;
                  }
                  return item.get('group');
               },
               displayProperty: 'title'
            },
            itemsViewModel = new ItemsViewModel(cfg);
         assert.equal(itemsViewModel._display.getGroup(), cfg.groupMethod, 'Grouping for display not applied. Error sending to display grouping method.');
         assert.equal(itemsViewModel._display.getCount(), 9, 'Grouping for display not applied. Display items count (with groups) not equal 7.');
         itemsViewModel.toggleGroup('group_1');
         assert.equal(itemsViewModel._display.getCount(), 6, 'Invalid display items count after collapsing "group_1".');
         itemsViewModel.toggleGroup('group_2');
         assert.equal(itemsViewModel._display.getCount(), 4, 'Invalid display items count after collapsing "group_2".');
         itemsViewModel.toggleGroup('group_1');
         assert.equal(itemsViewModel._display.getCount(), 7, 'Invalid display items count after expanding "group_1".');
         itemsViewModel.toggleGroup('group_2');
         assert.equal(itemsViewModel._display.getCount(), 9, 'Invalid display items count after expanding "group_2".');
         current = itemsViewModel.getCurrent();
         assert.equal(current.isGroup, true, 'Invalid value isGroup for current item.');
         assert.equal(current.isHiddenGroup, true, 'Invalid value isHiddenGroup for current item.');
         assert.equal(current.isGroupExpanded, true, 'Invalid value isGroupExpanded for current item.');
         itemsViewModel.goToNext();
         current = itemsViewModel.getCurrent();
         assert.equal(current.isGroup, undefined, 'Invalid value isGroup for current item.');
         assert.equal(current.isHiddenGroup, undefined, 'Invalid value isHiddenGroup for current item.');
         assert.equal(current.isGroupExpanded, undefined, 'Invalid value isGroupExpanded for current item.');
         itemsViewModel.toggleGroup('group_1');
         itemsViewModel.goToNext();
         current = itemsViewModel.getCurrent();
         assert.equal(current.isGroup, true, 'Invalid value isGroup for current item.');
         assert.equal(current.isHiddenGroup, false, 'Invalid value isHiddenGroup for current item.');
         assert.equal(current.isGroupExpanded, false, 'Invalid value isGroupExpanded for current item.');
      });
   })
});
