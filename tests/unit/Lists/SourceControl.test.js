/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/SourceControl',
   'Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/List/SimpleList/ListViewModel',
   'Controls/List/SimpleList/ListView'
], function(SourceControl, ItemsUtil, MemorySource, RecordSet, ListViewModel){
   describe('Controls.List.SourceControl', function () {
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
      it('life cycle', function () {
         var source = new MemorySource({
            idProperty: 'id',
            data: data
         });
         var listViewModel = new ListViewModel ({
            items : [],
            idProperty: 'id'
         });
         var filter = {1: 1, 2: 2};
         var cfg = {
            viewName : 'Controls/List/SimpleList/ListView',
            source: source,
            listViewModel: listViewModel,
            filter: filter

         };
         var ctrl = new SourceControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         assert.isTrue(!!ctrl._sourceController, '_dataSourceController wasn\'t created before mounting');
         assert.deepEqual(filter, ctrl._filter, 'incorrect filter before mounting');


         //создаем новый сорс
         var oldSourceCtrl = ctrl._sourceController;

         source = new MemorySource({
            idProperty: 'id',
            data: data
         });

         var filter2 = {3: 3, 4: 4};
         cfg = {
            viewName : 'Controls/List/SimpleList/ListView',
            source: source,
            listViewModel: listViewModel,
            filter : filter2
         };

         ctrl._beforeUpdate(cfg);
         assert.isTrue(ctrl._sourceController !== oldSourceCtrl, '_dataSourceController wasn\'t changed before updating');
         assert.deepEqual(filter2, ctrl._filter, 'incorrect filter before updating');
      });

   })
});