define(['Controls/List/TreeGridView/TreeGridViewModel',
   'Core/core-instance', 'Types/collection'], function(TreeGridViewModel, cInstance, collection) {

   describe('Controls.List.TreeGrid.TreeGridViewModel', function() {
      var
         treeGridViewModel = new TreeGridViewModel({columns:[]});
      it('_createModel', function() {
         var
            createdModel = treeGridViewModel._createModel({});
         assert.isTrue(cInstance.instanceOfModule(createdModel, 'Controls/_lists/Tree/TreeViewModel'), 'Invalid type of created model.');
      });
      it('toggleExpanded', function() {
         var
            toggleExpandedCalled = false;
         treeGridViewModel._model.toggleExpanded = function() {
            toggleExpandedCalled = true;
         };
         treeGridViewModel.toggleExpanded();
         assert.isTrue(toggleExpandedCalled, 'Invalid call toggleExpanded on model instance.');
      });

      it('toggleExpanded and ladder', function() {
         var
            initialColumns = [{
               width: '1fr',
               displayProperty: 'title'
            }],
            resultLadderBeforeExpand = {
               0: { date: { ladderLength: 1 } }
            },
            resultLadderAfterExpand = {
               0: { date: { ladderLength: 1 } },
               1: { date: { ladderLength: 3 } },
               2: { date: { } },
               3: { date: { } }
            },
            ladderViewModel = new TreeGridViewModel({
               items: new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [
                     { id: 0, title: 'i0', date: '01 янв', parent: null, type: true },
                     { id: 1, title: 'i1', date: '03 янв', parent: 0, type: null },
                     { id: 2, title: 'i2', date: '03 янв', parent: 0, type: null },
                     { id: 3, title: 'i3', date: '03 янв', parent: 0, type: null }
                  ]
               }),
               keyProperty: 'id',
               nodeProperty: 'type',
               parentProperty: 'parent',
               columns: initialColumns,
               ladderProperties: ['date']
            });
         assert.deepEqual(ladderViewModel._ladder.ladder, resultLadderBeforeExpand, 'Incorrect value prepared ladder before expand.');
         ladderViewModel.toggleExpanded(ladderViewModel._model._display.at(0));
         assert.deepEqual(ladderViewModel._ladder.ladder, resultLadderAfterExpand, 'Incorrect value prepared ladder after expand.');
      });
      it('setExpandedItems', function() {
         treeGridViewModel._model._display = {
            setFilter: function() {}
         };
         treeGridViewModel.setExpandedItems([]);
         assert.deepEqual({}, treeGridViewModel._model._expandedItems);

         treeGridViewModel.setExpandedItems([1, 2]);
         assert.deepEqual({
            1: true,
            2: true
         }, treeGridViewModel._model._expandedItems);
      });
      it('notify "onNodeRemoved"', function() {
         var
            notifiedOnNodeRemoved = false;
         treeGridViewModel._notify = function(eventName, nodeId) {
            assert.equal(nodeId, 1, 'Invalid argument notify "onNodeRemoved".');
            notifiedOnNodeRemoved = true;
         };
         treeGridViewModel._onNodeRemoved(null, 1);
         assert.isTrue(notifiedOnNodeRemoved, 'Invalid call _notify("onNodeRemoved").');
      });
      it('setRoot', function() {
         var
            setRootCalled = false;
         treeGridViewModel._model.setRoot = function() {
            setRootCalled = true;
         };
         treeGridViewModel.setRoot('testRoot');
         assert.isTrue(setRootCalled, 'Invalid call toggleExpanded on model instance.');
      });

      it('getItemDataByItem', function() {
         var
            itemData,
            originFn = TreeGridViewModel.superclass.getItemDataByItem;
         TreeGridViewModel.superclass.getItemDataByItem = function() {
            return {
               item: {},
               getCurrentColumn: function() {
                  return {
                     cellClasses: ''
                  };
               }
            };
         };
         itemData = treeGridViewModel.getItemDataByItem();
         assert.isTrue(!!itemData.getLevelIndentClasses);
         assert.isTrue(!!itemData.getCurrentColumn);
         var
            currentColumn = itemData.getCurrentColumn();
         assert.equal(currentColumn.cellClasses, ' controls-TreeGrid__row-cell controls-TreeGrid__row-cell__item');
         TreeGridViewModel.superclass.getItemDataByItem = originFn;
      });

      it('getCurrent', function () {

         var itemTypes = {
            node: 'node',
            hiddenNode: 'hiddenNode',
            item: 'item'
         };

         function checkCellClasses(classes, itemType) {
            assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell') !== -1);
            if (itemType === itemTypes.node) {
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__node') !== -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__hiddenNode') === -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__item') === -1);
            }
            if (itemType === itemTypes.hiddenNode) {
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__node') === -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__hiddenNode') !== -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__item') === -1);
            }
            if (itemType === itemTypes.item) {
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__node') === -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__hiddenNode') === -1);
               assert.isTrue(classes.indexOf('controls-TreeGrid__row-cell__item') !== -1);
            }
         }

         var current,
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             });

         current = model.getCurrent();
         checkCellClasses(current.getCurrentColumn().cellClasses, itemTypes.node);
         model.goToNext();

         current = model.getCurrent();
         checkCellClasses(current.getCurrentColumn().cellClasses, itemTypes.hiddenNode);
         model.goToNext();

         current = model.getCurrent();
         checkCellClasses(current.getCurrentColumn().cellClasses, itemTypes.item);
      });


      it('getLevelIndentClasses', function () {
         var
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             current = model.getCurrent(),
             expected = {
                defaultOrNull: 'controls-TreeGrid__row-levelPadding_size_default',
                onlyExpander_xs: 'controls-TreeGrid__row-levelPadding_size_xs',
                onlyExpander_xl: 'controls-TreeGrid__row-levelPadding_size_xl',
                onlyIndent_xxs: 'controls-TreeGrid__row-levelPadding_size_xxs',
                onlyIndent_m: 'controls-TreeGrid__row-levelPadding_size_m',
                s_m: 'controls-TreeGrid__row-levelPadding_size_m',
                l_xl: 'controls-TreeGrid__row-levelPadding_size_xl'
             };

         assert.equal(expected.defaultOrNull, current.getLevelIndentClasses(null, null));

         assert.equal(expected.onlyExpander_xs, current.getLevelIndentClasses('xs', null));
         assert.equal(expected.onlyExpander_xl, current.getLevelIndentClasses('xl', null));

         assert.equal(expected.onlyIndent_xxs, current.getLevelIndentClasses(null, 'xxs'));
         assert.equal(expected.onlyIndent_m, current.getLevelIndentClasses(null, 'm'));

         assert.equal(expected.s_m, current.getLevelIndentClasses('s', 'm'));
         assert.equal(expected.l_xl, current.getLevelIndentClasses('l', 'xl'));
      });

      it('calcGroupRowIndex', function () {
         var
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             current = model.getCurrent();

         assert.equal(TreeGridViewModel._private.calcGroupRowIndex(model, current), 0);

      });

      it('getFooterStyles', function () {
         var
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             self = {
                _options: {
                   multiSelectVisibility: 'hidden'
                }
             };

         assert.equal(TreeGridViewModel._private.getFooterStyles(self, 1, 2),
             'grid-row: 2; -ms-grid-row: 2; grid-column: 1 / 2; -ms-grid-column: 1; -ms-grid-column-span: 1;'
         );

         self._options.multiSelectVisibility = 'visible';

         assert.equal(TreeGridViewModel._private.getFooterStyles(self, 1, 2),
             'grid-row: 2; -ms-grid-row: 2; grid-column: 2 / 2; -ms-grid-column: 2; -ms-grid-column-span: 1;'
         );
      });

      it('calcRowIndex', function () {
         var
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             current = model.getCurrent();

         assert.equal(TreeGridViewModel._private.calcRowIndex(model, current), 0);

      });

      it('prepareGroupGridStyles', function () {
         var
             initialColumns = [{
                width: '1fr',
                displayProperty: 'title'
             }],
             model = new TreeGridViewModel({
                items: new collection.RecordSet({
                   idProperty: 'id',
                   rawData: [
                      {id: 0, title: 'i0', parent: null, type: true},
                      {id: 1, title: 'i1', parent: null, type: false},
                      {id: 2, title: 'i2', parent: null, type: null}
                   ]
                }),
                keyProperty: 'id',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: initialColumns
             }),
             current = model.getCurrent();

         var safeFunc = TreeGridViewModel.calcGroupRowIndex;

         TreeGridViewModel._private.calcGroupRowIndex = function () {
            return 1;
         };

         TreeGridViewModel._private.prepareGroupGridStyles(self, current);

         assert.equal(current.gridGroupStyles, 'grid-row: 2; -ms-grid-row: 2;');

         TreeGridViewModel._private.calcGroupRowIndex = safeFunc;
      });

      it('setExpandedItems', function() {

         treeGridViewModel._model._expandedItems = null;

         treeGridViewModel._model.setExpandedItems = function(expandedItems) {
            treeGridViewModel._model._expandedItems = expandedItems;
         };

         treeGridViewModel.setExpandedItems({
            '123': true,
            '234': true
         });
         assert.deepEqual({
            '123': true,
            '234': true
         }, treeGridViewModel._model._expandedItems);

         treeGridViewModel.setExpandedItems({});
         assert.deepEqual({}, treeGridViewModel._model._expandedItems);

      });
   });
});
