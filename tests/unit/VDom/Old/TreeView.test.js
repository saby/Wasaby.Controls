//define(['js!WSControls/Lists/TreeView2', 'WS.Data/Source/Memory'], function (TreeView, MemorySource) {
//
//   'use strict';
//
//   function prepareCheckExpandData(treeView) {
//      return {
//         itemsCount: treeView._display.getCount(),
//         _expandedItems: treeView._expandedItems
//      }
//   }
//
//   describe('VDom WSControls/Lists/TreeView2', function () {
//      var
//         treeViewItems = [
//            {  id: 1,   title: 'Node 1',           parent: null, 'parent@': true,  'parent$': true  },
//            {  id: 11,  title: 'Node 1-1',         parent: 1,    'parent@': true,  'parent$': true  },
//            {  id: 111, title: 'Leaf 1-1-1',       parent: 11,   'parent@': null,  'parent$': true  },
//            {  id: 12,  title: 'Leaf 1-2',         parent: 1,    'parent@': null,  'parent$': true  },
//            {  id: 13,  title: 'Hidden node 1-3',  parent: 1,    'parent@': false, 'parent$': true  },
//            {  id: 2,   title: 'Empty node 2',     parent: null, 'parent@': true,  'parent$': true  },
//            {  id: 3,   title: 'Hidden node 3',    parent: null, 'parent@': false, 'parent$': true  },
//            {  id: 31,  title: 'Leaf 3-1',         parent: 3,    'parent@': null,  'parent$': true  },
//            {  id: 4,   title: 'Empty hidden 4',   parent: null, 'parent@': false, 'parent$': false },
//            {  id: 5,   title: 'Leaf 5',           parent: null, 'parent@': null,  'parent$': true  }
//         ],
//         cfg = {
//            expandMode: 'incorrect_value',
//            loadMode: 'incorrect_value',
//            idProperty: 'id',
//            parentProperty: 'parent',
//            nodeProperty: 'parent@',
//            items: treeViewItems
//         },
//         treeView = new TreeView(cfg),
//         resultCorrectInitialize = {
//            _expandMode: 'multiple',
//            _loadMode: 'partial'
//         },
//         resultExpandUnknownItem = {
//            itemsCount: 5,
//            _expandedItems: {}
//         },
//         resultExpandCorrectItemNode = {
//            itemsCount: 8,
//            _expandedItems: {
//               1: true
//            }
//         },
//         resultExpandCorrectItemHiddenNode = {
//            itemsCount: 9,
//            _expandedItems: {
//               1: true,
//               3: true
//            }
//         },
//         resultExpandCorrectItemLeaf = resultExpandCorrectItemHiddenNode,
//         resultCollapseUnknownItem = {
//            itemsCount: 9,
//            _expandedItems: {
//               1: true,
//               3: true
//            }
//         },
//         resultCollapseCorrectItemNode = {
//            itemsCount: 6,
//            _expandedItems: {
//               3: true
//            }
//         },
//         resultCollapseCorrectItemHiddenNode = {
//            itemsCount: 5,
//            _expandedItems: {}
//         },
//         resultCollapseCorrectItemLeaf = resultCollapseCorrectItemHiddenNode,
//         resultToggleOrigin= {
//            itemsCount: 5,
//            _expandedItems: {}
//         },
//         resultToggleCorrectItemNode = {
//            itemsCount: 8,
//            _expandedItems: {
//               1: true
//            }
//         },
//         resultToggleCorrectItemHiddenNode = {
//            itemsCount: 6,
//            _expandedItems: {
//               3: true
//            }
//         };
//      treeView.saveOptions(cfg);
//      it('Check correct initialize TreeView with incorrect options', function () {
//         assert.deepEqual({
//            _loadMode: treeView._loadMode,
//            _expandMode: treeView._expandMode
//         }, resultCorrectInitialize);
//      });
//      describe('Check expand TreeView items', function () {
//         it('Check expand unknown item', function () {
//            treeView.expandItem('unknown_item');
//            assert.deepEqual(prepareCheckExpandData(treeView), resultExpandUnknownItem);
//         });
//         it('Check expand correct node (item at 0)', function () {
//            treeView.expandItem(treeView._display.at(0).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultExpandCorrectItemNode);
//         });
//         it('Check expand correct item hidden node (at 5)', function () {
//            treeView.expandItem(treeView._display.at(5).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultExpandCorrectItemHiddenNode);
//         });
//         it('Check expand correct item leaf (at 8)', function () {
//            treeView.expandItem(treeView._display.at(8).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultExpandCorrectItemLeaf);
//         });
//      });
//      describe('Check collapse TreeView items', function () {
//         it('Check collapse unknown item', function () {
//            treeView.collapseItem('unknown_item');
//            assert.deepEqual(prepareCheckExpandData(treeView), resultCollapseUnknownItem);
//         });
//         it('Check collapse correct node (item at 0)', function () {
//            treeView.collapseItem(treeView._display.at(0).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultCollapseCorrectItemNode);
//         });
//         it('Check collapse correct item hidden node (at 2)', function () {
//            treeView.collapseItem(treeView._display.at(2).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultCollapseCorrectItemHiddenNode);
//         });
//         it('Check collapse correct item leaf (at 4)', function () {
//            treeView.collapseItem(treeView._display.at(4).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultCollapseCorrectItemLeaf);
//         });
//      });
//      describe('Check toggle TreeView items', function () {
//         it('Check toggle unknown item', function () {
//            treeView.toggleItem('unknown_item');
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleOrigin);
//         });
//         it('Check toggle [true] correct node (item at 0)', function () {
//            treeView.toggleItem(treeView._display.at(0).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleCorrectItemNode);
//         });
//         it('Check toggle [false] correct node (item at 0)', function () {
//            treeView.toggleItem(treeView._display.at(0).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleOrigin);
//         });
//         it('Check toggle [true] correct item hidden node (at 2)', function () {
//            treeView.toggleItem(treeView._display.at(2).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleCorrectItemHiddenNode);
//         });
//         it('Check toggle [false] correct item hidden node (at 2)', function () {
//            treeView.toggleItem(treeView._display.at(2).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleOrigin);
//         });
//         it('Check toggle correct item leaf (at 4)', function () {
//            treeView.toggleItem(treeView._display.at(4).getHash());
//            assert.deepEqual(prepareCheckExpandData(treeView), resultToggleOrigin);
//         });
//      });
//   });
//});