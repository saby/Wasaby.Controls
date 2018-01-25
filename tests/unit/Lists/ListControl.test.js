/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List',
   'Controls/List/resources/utils/ItemsUtil',
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

      it('Only one data request', function (done) {
         var source = new MemorySource({
            idProperty: 'id',
            data: data
         });
         var cfg = {
            dataSource: source,
            navigation: {
               source: 'page',
               sourceConfig: {
                  pageSize: 1
               }
            }
         };
         var ctrl = new ListControl(cfg);
         ctrl._beforeMount(cfg);

         //Идет первый запроос данных из dataSource
         assert.equal(ctrl._loader.isReady(), false, 'Request data must be async');

         //Эмуляция navigationController'a
         ctrl._navigationController = {
            hasMoreData: function() {return true;},
            calculateState: function() {},
            prepareQueryParams: function() {return {limit: 1, offset: 1};}
         };

         //Грузим следующую страницу (загрузки случиться не должно, еще идет первый запрос)
         ListControl._private.scrollLoadMore(ctrl, 'up');
         assert.equal(ctrl._loader.isReady(), false, 'Request data must be async');

         //После загрузки проверяем, что подгрузилась только 1 страница
         setTimeout(function() {
            assert.equal(ctrl._loader.isReady(), true, 'Request data must be is ready');
            //Из-за асинхронной работы с MemorySource _listModel еще могла не создасться. Если же успели прогрузиться, то там должны быть 1 запись
            if (ctrl._listModel) {
               assert.equal(ctrl._listModel.getCount(), 1, 'Incorrect itemsCount after first load');
            }

            //Вызываем несколько раз scrollLoadMore, по факту выполниться должна только одна подгрузка
            ListControl._private.scrollLoadMore(ctrl, 'up');
            ListControl._private.scrollLoadMore(ctrl, 'up');
            ListControl._private.scrollLoadMore(ctrl, 'up');
            assert.equal(ctrl._loader.isReady(), false, 'Request data must be async');

            setTimeout(function() {
               //Проверяем, что подгружилась только 1 страница, всего стало 2 записи
               assert.equal(ctrl._loader.isReady(), true, 'Request data must be is ready');
               assert.equal(ctrl._listModel.getCount(), 2, 'Incorrect itemsCount after three scrollLoadMore');
               done();
            }, 0);
         }, 0);
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
            _container: {
               clientHeight: 6
            }
         };

         ctrl._afterUpdate();
         assert.equal(2, ctrl._bottomPlaceholderHeight, 'Property _bottomPlaceholderHeight is incorrect after updating');
         assert.equal(0, ctrl._topPlaceholderHeight, 'Property _topPlaceholderHeight is incorrect after updating');
      });
   })
});