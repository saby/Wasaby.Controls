/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'js!Controls/List/ListControl/ListViewModel',
   'js!Controls/List/resources/utils/ItemsUtil'
], function(ListViewModel, ItemsUtil){
   describe('Controls.List.ListControl.ListViewModel', function () {
      var data, display;
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

      });

      it('Enumeration', function () {
         var cfg = {
            items: data,
            idProperty: 'id'
         };

         var iv = new ListViewModel(cfg);



         assert.equal(0, iv._itemsModel._curIndex, 'Incorrect start enumeration index after constructor');

         iv._itemsModel._curIndex = 3;
         iv.reset();
         assert.equal(0, iv._itemsModel._curIndex, 'Incorrect current enumeration index after reset()');

         iv.goToNext();
         iv.goToNext();
         assert.equal(2, iv._itemsModel._curIndex, 'Incorrect current enumeration index after 2x_goToNext');

         var condResult = iv.isEnd();
         assert.isTrue(condResult, 'Incorrect condition value enumeration index after 2x_goToNext');
         iv.goToNext();
         condResult = iv.isEnd();
         assert.isFalse(condResult, 'Incorrect condition value enumeration index after 3x_goToNext');
      });

      it('Other', function () {
         var cfg = {
            items: data,
            idProperty: 'id',
            displayProperty: 'title',
            selectedKey: 1
         };

         var iv = new ListViewModel(cfg);

         var cur = iv.getCurrent();
         assert.equal('id', cur.idProperty, 'Incorrect field set on getCurrent()');
         assert.equal('title', cur.displayProperty, 'Incorrect field set on getCurrent()');
         assert.equal(0, cur.index, 'Incorrect field set on getCurrent()');
         assert.deepEqual(data[0], cur.item, 'Incorrect field set on getCurrent()');
         assert.isTrue(cur.isSelected, 'Incorrect field set on getCurrent()');

      });


      it('Selection', function () {
         var cfg = {
            items: data,
            idProperty: 'id',
            displayProperty: 'title',
            selectedKey: 2
         };

         var iv = new ListViewModel(cfg);
         var selItem = iv._selectedItem;
         assert.equal(iv._itemsModel._display.at(1), selItem, 'Incorrect selectedItem');


         iv.setSelectedKey(3);
         selItem = iv._selectedItem;
         assert.equal(iv._itemsModel._display.at(2), selItem, 'Incorrect selectedItem');
      });
   })
});