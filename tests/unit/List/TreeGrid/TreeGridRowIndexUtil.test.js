define([
   'Controls/_treeGrid/utils/TreeGridRowIndexUtil',
   'Controls/_list/resources/utils/ItemsUtil',
   'Controls/treeGrid',
   'Types/collection'
], function (RowUtil, ItemsUtil, treeGridLib, collection) {

   describe('Controls._treeGrid.utils.TreeGridRowIndexUtil', function () {

      function getItem(id, cfg) {
         let item = {
            'id': `${id}`,
            'title': 'title' in cfg ? `${cfg.title}` : `Row title with id ${id}`
         };
         cfg = cfg || {};
         item['parent'] = 'parent' in cfg ? cfg.parent : null;
         item['nodeType'] = 'nodeType' in cfg ? cfg.nodeType : null;
         if ('group' in cfg) {
            item['group'] = cfg.group;
         }
         return item;
      }

      let
          treeGridData = [
             getItem('1', {nodeType: true, parent: null, group: 'group_1'}),
             getItem('1_1', {nodeType: true, parent: '1', group: 'group_1'}),
             getItem('1_1_1', {nodeType: null, parent: '1_1', group: 'group_1'}),
             getItem('1_1_2', {nodeType: null, parent: '1_1', group: 'group_1'}),
             getItem('1_2', {nodeType: null, parent: '1', group: 'group_1'}),
             getItem('2', {nodeType: false, parent: null, group: 'group_1'}),
             getItem('2_1', {nodeType: null, parent: '2', group: 'group_1'}),
             getItem('3', {nodeType: false, parent: null, group: 'group_2'}),
             getItem('3_1', {nodeType: null, parent: '3', group: 'group_2'}),
             getItem('4', {nodeType: null, parent: null, group: 'group_2'})
          ],
          treeGridColumns = [{displayProperty: 'title'}],
          treeGridHeader = [{title: 'Название'}];

      /*
      * Создаёт модель, эмулирующуу дерево вида:
      *
      * Шапка                                realIndex 0
      * group 1            displayIndex 0    realIndex 1
      * ->node             displayIndex 1    realIndex 2
      *   ->node           displayIndex 2    realIndex 3
      *     ->item         displayIndex 3    realIndex 4
      *     ->item         displayIndex 4    realIndex 5
      *     ->hasMoreFooter                  realIndex 6
      *   ->item           displayIndex 5    realIndex 7
      *   hasMoreFooter                      realIndex 8
      * ->hiddenNode       displayIndex 6    realIndex 9
      *   ->item           displayIndex 7    realIndex 10
      *   nodeFooter                         realIndex 11
      * group 2            displayIndex 8    realIndex 12
      * ->hiddenNode       displayIndex 9    realIndex 13
      *   ->item           displayIndex 10   realIndex 14
      *   nodeFooter                         realIndex 15
      * ->item             displayIndex 11   realIndex 16
      *
      * */
      function createModel(cfg, data) {
         cfg = cfg || {};
         cfg.keyProperty = cfg.keyProperty || 'id';
         cfg.displayProperty = cfg.displayProperty || 'title';
         cfg.columns = treeGridColumns;
         cfg.header = 'header' in cfg ? cfg.header : treeGridHeader;
         cfg.nodeProperty = 'nodeType';
         cfg.parentProperty = 'parent';
         if (cfg.groupBy) {
            cfg.groupingKeyCallback = function (item) {
               return item.get(cfg.groupBy);
            }
         }
         cfg.items = new collection.RecordSet({
            rawData: data || treeGridData,
            idProperty: cfg.keyProperty
         });
         let model = new treeGridLib.ViewModel(cfg);
         model.setHasMoreStorage({'1': true, '1_1': true, '2': false, '3': undefined});
         model.setExpandedItems(['1', '1_1', '2', '3']);
         return model;
      }
      
      describe('TreeGrid with header and grouping', function () {

         describe('with results in top', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({resultsPosition: 'top', groupBy: 'group', nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(3, rowIndexHelper.getIndexById('1'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(8, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(11, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(15, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(17, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(3, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(8, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(11, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(15, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(17, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(3, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(8, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(11, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(15, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(17, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 2);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 13);
               });

               it('getResultsIndex', function () {
                  assert.equal(rowIndexHelper.getResultsIndex(), 1);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'top', groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(3, rowIndexHelper.getIndexById('1'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(8, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(11, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(15, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(3, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(8, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(11, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(15, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(3, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(8, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(11, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(15, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 2);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 12);
               });

               it('getResultsIndex', function () {
                  assert.equal(rowIndexHelper.getResultsIndex(), 1);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

         describe('with results in bottom', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({resultsPosition: 'bottom', groupBy: 'group', nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(16, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(16, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(16, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 12);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'bottom', groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 11);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

         describe('without results', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({groupBy: 'group', nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(16, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(16, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(16, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 12);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'bottom', groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 11);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

      });

      describe('TreeGrid without header, with grouping', function () {

         describe('with results in top', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({resultsPosition: 'top', header: null, groupBy: 'group', nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(16, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(16, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(16, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 12);
               });

               it('getResultsIndex', function () {
                  assert.equal(rowIndexHelper.getResultsIndex(), 0);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 10 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'top', header: null, groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(2, rowIndexHelper.getIndexById('1'));
                  assert.equal(5, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(7, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(10, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(14, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(2, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(5, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(7, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(10, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(14, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(2, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(5, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(7, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(10, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(14, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 11);
               });

               it('getResultsIndex', function () {
                  assert.equal(rowIndexHelper.getResultsIndex(), 0);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

         describe('with results in bottom', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({resultsPosition: 'bottom', header: null, groupBy: 'group', nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(1, rowIndexHelper.getIndexById('1'));
                  assert.equal(4, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(9, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(15, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(1, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(4, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(9, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(15, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(1, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(4, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(9, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(15, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 11);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'bottom', header: null, groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(1, rowIndexHelper.getIndexById('1'));
                  assert.equal(4, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(9, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(12, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(1, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(4, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(9, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(12, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(1, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(4, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(9, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(12, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 10);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

         describe('without results', function () {

            describe('with node footer template', function () {


               let
                   model = createModel({groupBy: 'group', header: null, nodeFooterTemplate: 'qwe'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(1, rowIndexHelper.getIndexById('1'));
                  assert.equal(4, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(9, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(15, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(1, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(4, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(9, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(15, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(1, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(4, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(9, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(15, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 11);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

            describe('without node footer template', function () {

               let
                   model = createModel({resultsPosition: 'bottom', header: null, groupBy: 'group'}),
                   rowIndexHelper = model._getRowIndexHelper();

               it('getIndexById', function () {
                  assert.equal(1, rowIndexHelper.getIndexById('1'));
                  assert.equal(4, rowIndexHelper.getIndexById('1_1_2'));
                  assert.equal(6, rowIndexHelper.getIndexById('1_2'));
                  assert.equal(9, rowIndexHelper.getIndexById('2_1'));
                  assert.equal(12, rowIndexHelper.getIndexById('3_1'));
                  assert.equal(13, rowIndexHelper.getIndexById('4'));
               });

               it('getIndexByDisplayIndex', function () {
                  assert.equal(1, rowIndexHelper.getIndexByDisplayIndex(1));
                  assert.equal(4, rowIndexHelper.getIndexByDisplayIndex(4));
                  assert.equal(6, rowIndexHelper.getIndexByDisplayIndex(5));
                  assert.equal(9, rowIndexHelper.getIndexByDisplayIndex(7));
                  assert.equal(12, rowIndexHelper.getIndexByDisplayIndex(10));
                  assert.equal(13, rowIndexHelper.getIndexByDisplayIndex(11));
               });

               it('getIndexByItem', function () {
                  assert.equal(1, rowIndexHelper.getIndexByItem(model.getDisplay().at(1)));
                  assert.equal(4, rowIndexHelper.getIndexByItem(model.getDisplay().at(4)));
                  assert.equal(6, rowIndexHelper.getIndexByItem(model.getDisplay().at(5)));
                  assert.equal(9, rowIndexHelper.getIndexByItem(model.getDisplay().at(7)));
                  assert.equal(12, rowIndexHelper.getIndexByItem(model.getDisplay().at(10)));
                  assert.equal(13, rowIndexHelper.getIndexByItem(model.getDisplay().at(11)));
               });

               it('groups indexes', function () {
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
                  assert.equal(rowIndexHelper.getIndexByDisplayIndex(8), 10);
               });

               it('getResultsIndex', function () {
                  assert.isTrue(rowIndexHelper.getResultsIndex() > 11 * 2);
               });

               it('getFooterIndex', function () {
                  assert.isTrue(rowIndexHelper.getFooterIndex() > 11 * 2 + 1);
               });

            });

         });

      });
   });
});