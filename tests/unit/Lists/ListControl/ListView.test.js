/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'js!Controls/List/ListControl/ListView',
   'js!Controls/List/resources/utils/ItemsUtil'
], function(ListView, ItemsUtil){
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
      it('Selected key', function () {
         var cfg = {
            items: data,
            idProperty: 'id',
            selectedKey: 2
         };
         var lv = new ListView(cfg);
         lv._beforeMount(cfg);

         var selItem = lv._display.at(1);
         assert.equal(selItem, lv._selectedItem, 'Incorrect selected item before mounting');

         lv = new ListView({});
         lv._beforeUpdate(cfg);
         selItem = lv._display.at(1);
         assert.equal(selItem, lv._selectedItem, 'Incorrect selected item before updating');
      });

      it('Item click', function () {
         var cfg = {
            items: data,
            idProperty: 'id',
            selectedKey: 2
         };
         var lv = new ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         var dispItem = lv._display.at(2);

         lv._onItemClick({}, dispItem);
         assert.equal(dispItem, lv._selectedItem, 'Incorrect selected item before updating');
      })
   })
});