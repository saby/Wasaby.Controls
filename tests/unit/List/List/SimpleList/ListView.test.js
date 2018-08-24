/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/ListView',
   'Controls/List/ListViewModel'
], function(ListView, ListViewModel){
   describe('Controls.List.ListView', function () {
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

      it('Item click', function () {
         var model = new ListViewModel({
            items: data,
            keyProperty: 'id'
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         var dispItem = lv._listModel._display.at(2);
         var notifyResult = null;
         lv._notify = function(e, args) {
            notifyResult = args[0];
         };
         lv._onItemClick({}, dispItem);
         assert.equal(notifyResult, dispItem.getContents(), 'Incorrect selected item before updating');
      });
   
      it('_beforeUpdate', function () {
         var model = new ListViewModel({
            items: data,
            keyProperty: 'id'
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);
      
      
         model = new ListViewModel({
            items: data2,
            keyProperty: 'id'
         });
      
         cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
      
         lv._beforeUpdate(cfg);
         assert.equal(model, lv._listModel, 'Incorrect listModel before update');
      });
   
      it('_private.resizeNotifyOnListChanged', function () {
         var listView = new ListView(),
             eventNotifyed = false;
   
         listView._notify = function(event) {
            if (event === 'controlResize') {
               eventNotifyed = true;
            }
         };
         
         listView._listChanged = false;
         ListView._private.resizeNotifyOnListChanged(listView);
         
         assert.isFalse(eventNotifyed);
   
         listView._listChanged = true;
         ListView._private.resizeNotifyOnListChanged(listView);
   
         assert.isTrue(eventNotifyed);
      });
      
   });
});