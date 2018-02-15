define(['SBIS3.CONTROLS/Tree/DataGridView', 'WS.Data/Collection/RecordSet',], function (TreeDataGridView, RecordSet) {

   'use strict';

   describe('SBIS3.CONTROLS/Tree/DataGridView', function () {
      var
         TestTDGV,
         data = [
            { id: 1, title: 'Item 1', par: null, 'par@': true },
            { id: 11, title: 'Item 11', par: 1, 'par@': null },
            { id: 12, title: 'Item 12', par: 1, 'par@': null },
            { id: 2, title: 'Item 2', par: null, 'par@': true },
            { id: 22, title: 'Item 22', par: 2, 'par@': null }
         ];

      beforeEach(function() {
         if (typeof window !== 'undefined') {
            TestTDGV = new TreeDataGridView({
               element: $('<div class="TestTreeDataGridView"></div>').appendTo($('body')),
               keyField: 'id',
               hierField: 'par',
               items: data
            });
         } else {
            this.skip();
         }

      });

      afterEach(function() {
         if (typeof window !== 'undefined') {
            TestTDGV.destroy();
            TestTDGV = undefined;
         }
      });

      describe('Check loaded nodes', function () {
         if (typeof window !== 'undefined') {
            it('First check loaded nodes. They empty.', function () {
               assert.deepEqual(TestTDGV._loadedNodes, {});
            });
            it('Expand "Item 2". Loaded nodes equal { 2: true }.', function () {
               TestTDGV.expandNode(2);
               assert.deepEqual(TestTDGV._loadedNodes, {2: true});
            });
            it('Collapse "Item 2". Loaded nodes equal { 2: true }.', function () {
               TestTDGV.expandNode(2);
               TestTDGV.collapseNode(2);
               assert.deepEqual(TestTDGV._loadedNodes, {2: true});
            });
            it('Expand "Item 2" and set items. Loaded nodes equal {}.', function () {
               var
                  items = TestTDGV.getItems();
               TestTDGV.expandNode(2);
               TestTDGV.setItems(items);
               assert.deepEqual(TestTDGV._loadedNodes, {});
            });
            it('Remove "Item 2" from items. Loaded nodes equal {}.', function () {
               var
                  items = TestTDGV.getItems();
               TestTDGV.expandNode(2);
               TestTDGV.collapseNode(2);
               items.remove(items.getRecordById(2));
               assert.deepEqual(TestTDGV._loadedNodes, {});
            });
         }
      });
      describe('Check toggle nodes', function () {
         if (typeof window !== 'undefined') {
            it('Expand nonexistent node.', function () {
               TestTDGV.expandNode('nonexistent_key');
            });
            it('Collapse nonexistent node.', function () {
               TestTDGV.collapseNode('nonexistent_key');
            });
            it('Toggle nonexistent node.', function () {
               TestTDGV.toggleNode('nonexistent_key');
            });
         }
      });

      describe('getHtmlItemByDOM', function () {
         it('should return next for the root items', function () {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1, par:0, 'par$': false},{id:2, par:0, 'par$': false}],
                  idProperty: 'id'
               });
            var root = {};
            root['id'] = 0;
            root['par$'] = true;
            TestTDGV.setRoot(root);
            TestTDGV.setItems(rs);
            assert.equal(TestTDGV._getHtmlItemByDOM(0, true).data('id'), 1);
         });
         it('should return the root item', function () {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1, par:0, 'par$': false},{id:2, par:0, 'par$': false}],
                  idProperty: 'id'
               });
            var root = {};
            root['id'] = 0;
            root['par$'] = true;
            TestTDGV.setRoot(root);
            TestTDGV.setItems(rs);
            assert.equal(TestTDGV._getHtmlItemByDOM(1, false).data('id'), 0);
         });
         it('should not throw error when root is null', function () {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1, par:null, 'par$': false},{id:2, par:null, 'par$': false}],
                  idProperty: 'id'
               });
            TestTDGV.setRoot(null);
            TestTDGV.setItems(rs);
            assert.doesNotThrow(function () {
               TestTDGV._getHtmlItemByDOM(5, true);
            });
         });
      })
   });
});