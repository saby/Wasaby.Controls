/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/SimpleList/ListView',
   'Controls/List/SimpleList/ListViewModel'
], function(ListView, ListViewModel){
   describe('Controls.List.ListView', function () {
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

      it('Item click', function () {
         var model = new ListViewModel({
            items: data,
            idProperty: 'id'
         });
         var cfg = {
            listModel: model,
            idProperty: 'id',
            selectedKey: 2
         };
         var lv = new ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         var dispItem = lv._listModel._itemsModel._display.at(2);
         lv._onItemClick({}, dispItem);
         assert.equal(dispItem, lv._listModel._selectedItem, 'Incorrect selected item before updating');
      })
   })
});