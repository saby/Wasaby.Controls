/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'js!Controls/List',
   'js!Controls/List/resources/utils/ItemsUtil',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet'
], function(ListControl, ItemsUtil, MemorySource, RecordSet){
   describe('Controls.List', function () {
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

      it('Initialize average items height, check placeholder heights', function () {
         var srcData = [];
         for(var i = 0; i < 6; i++) {
            srcData.push({
               id: i,
               title: 'Item ' + i
            });
         }

         var
            items = new RecordSet({
               idProperty: 'id',
               rawData: srcData
            }),
            cfg = {
               items: items,
               virtualScrollConfig: {
                  maxVisibleItems: 6
               }
            };

         var ctrl = new ListControl(cfg);
         ctrl._beforeMount(cfg);


         //Подкладываем объект внутреннего списка, который как бы отрисовался
         //  self._children.listView.getContainer().height(),
         ctrl._children.listView = {
            getContainer: function() {
               return [{
                  clientHeight: 6
               }]
            }
         };

         ctrl._afterUpdate();
         assert.equal(2, ctrl._bottomPlaceholderHeight, 'Property _bottomPlaceholderHeight is incorrect after updating');
         assert.equal(0, ctrl._topPlaceholderHeight, 'Property _topPlaceholderHeight is incorrect after updating');
      });
   })
});