/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'js!Controls/List/ListControl',
   'js!Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Source/Memory'
], function(ListControl, ItemsUtil, MemorySource){
   describe('Controls.List.ListControl', function () {
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
      it('DataSource init', function () {
         var source = new MemorySource({
            idProperty: 'id',
            data: data
         });
         var cfg = {
            dataSource: source
         };
         var ctrl = new ListControl(cfg);
         ctrl.saveOptions(cfg);
         ctrl._beforeMount(cfg);
         assert.equal(source, ctrl._dataSource, 'Property _dataSource is incorrect before mounting');

         ctrl = new ListControl({});
         ctrl._beforeUpdate(cfg);
         assert.equal(source, ctrl._dataSource, 'Property _dataSource is incorrect before updating');
      });
   })
});