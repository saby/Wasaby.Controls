define([
   'Controls/_treeGrid/utils/TreeGridRowIndexUtil',
   'Controls/_list/resources/utils/ItemsUtil',
   'Controls/treeGrid',
   'Types/collection'
], function(RowUtil, ItemsUtil, treeGridLib, collection) {

   describe('Controls._treeGrid.utils.TreeGridRowIndexUtil', function() {

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
             getItem('1', { nodeType: true, title: 'PC', group: 'Gadgets' }),
             getItem('1_1', { nodeType: true, parent: '1', title: 'Accessories', group: 'Gadgets' }),
             getItem('1_1_1', { nodeType: false, parent: '1_1', title: 'Keyboards', group: 'Gadgets' }),
             getItem('1_1_1_1', { parent: '1_1_1', title: 'Logitech 12-43rs', group: 'Gadgets' }),
             getItem('1_1_1_2', { parent: '1_1_1', title: 'GEnius K3', group: 'Gadgets' }),
             getItem('1_1_1_3', { parent: '1_1_1', title: 'HP Bluetooth 4.0', group: 'Gadgets' }),
             getItem('1_1_1_4', { parent: '1_1_1', title: 'Logitech 15-3ams', group: 'Gadgets' }),
             getItem('1_1_2', { parent: '1_1', title: 'Apple mouse 2', group: 'Gadgets' }),
             getItem('1_1_3', { parent: '1_1', title: 'Apple mouse 3', group: 'Gadgets' }),
             getItem('1_2', { nodeType: false, parent: '1', title: 'Spare parts', group: 'Gadgets' }),
             getItem('1_2_1', { nodeType: true, parent: '1_2', title: 'Videochips', group: 'Gadgets' }),
             getItem('1_2_1_1', { nodeType: false, parent: '1_2_1', title: 'NVIDIA', group: 'Gadgets' }),
             getItem('1_2_1_1_1', { parent: '1_2_1_1', title: 'GForce 1050', group: 'Gadgets' }),
             getItem('1_2_1_1_2', { parent: '1_2_1_1', title: 'GForce 1060', group: 'Gadgets' }),
             getItem('1_2_1_1_3', { parent: '1_2_1_1', title: 'GForce 1070', group: 'Gadgets' }),
             getItem('1_2_1_1_4', { parent: '1_2_1_1', title: 'GForce 1080', group: 'Gadgets' }),
             getItem('1_2_1_2', { parent: '1_2_1', title: 'Asus 1070-ti', group: 'Gadgets' }),
             getItem('1_2_2', { parent: '1_2', title: 'Motherboard Gigabyte-2', group: 'Gadgets' }),
             getItem('1_2_3', { parent: '1_2', title: 'RAM Kingston 16 GB', group: 'Gadgets' }),
             getItem('1_2_4', { parent: '1_2', title: 'RAM Kingston 32 GB', group: 'Gadgets' }),
             getItem('1_3', { parent: '1', title: 'Mac PRO 2016', group: 'Gadgets' }),
             getItem('1_4', { parent: '1', title: 'Mac Mini 3', group: 'Gadgets' }),
             getItem('2', { nodeType: true, title: 'Tablets', group: 'Gadgets' }),
             getItem('3', { nodeType: false, title: 'Chairs', group: 'For home' }),
             getItem('4', { title: 'Sofas', group: 'For home' })
          ],
          treeGridColumns = [
             {
                displayProperty: 'title'
             }
          ],
          treeGridHeader = [
             { title: 'Название' }
          ];

      function createModel(cfg, data) {
         cfg = cfg || {};
         cfg.keyProperty = cfg.keyProperty || 'id';
         cfg.displayProperty = cfg.displayProperty || 'title';
         cfg.columns = treeGridColumns;
         cfg.header = 'header' in cfg ? cfg.header : treeGridHeader;
         cfg.nodeProperty = 'nodeType';
         cfg.parentProperty = 'parent';
         if (cfg.groupBy) {
            cfg.groupingKeyCallback = function(item) {
               return item.get(cfg.groupBy);
            }
         }
         cfg.items = new collection.RecordSet({
            rawData: data || treeGridData,
            idProperty: cfg.keyProperty
         });
         return new treeGridLib.ViewModel(cfg);
      }

      function getRowIndexHelper(_model) {

         function getArgsForRowIndexUtil(treeModel, unicArgs) {
            return [unicArgs].concat([
               treeModel.getDisplay(),
               !!treeModel.getHeader(),
               treeModel.getResultsPosition(),
               treeModel._model.getHierarchyRelation(),
               treeModel._model.getHasMoreStorage(),
               treeModel._model.getExpandedItems(),
               !!treeModel._model.getNodeFooterTemplate()
            ]);
         }

         return {
            getIndexByItem: (item) => RowUtil.getIndexByItem.apply(null, getArgsForRowIndexUtil(_model, item)),
            getIndexById: (id) => RowUtil.getIndexById.apply(null, getArgsForRowIndexUtil(_model, id)),
            getIndexByDisplayIndex: (index) => RowUtil.getIndexByDisplayIndex.apply(null, getArgsForRowIndexUtil(_model, index)),
         };
      }



      describe('TreeGrid with header and grouping', function() {

         describe('with results in top', function() {

            describe('with node footer template', function() {


               let
                   model = createModel({ resultsPosition: 'top', groupBy: 'group', nodeFooterTemplate: 'qwe' }),
                   rowIndexHelper = getRowIndexHelper(model);

               it('getIndexById', function() {
                  assert.equal(rowIndexHelper.getIndexById('1'), 3);
               });

            });


         });

      });
   });
});