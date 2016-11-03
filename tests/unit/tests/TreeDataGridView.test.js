define(['js!SBIS3.CONTROLS.TreeDataGridView'], function (TreeDataGridView) {

    'use strict';

    describe('SBIS3.CONTROLS.TreeDataGridView', function () {
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
            TestTDGV = new TreeDataGridView({
                element: $('<div class="TestTreeDataGridView"></div>').appendTo($('body')),
                keyField: 'id',
                hierField: 'par',
                items: data
           });
        });

        afterEach(function() {
            TestTDGV.destroy();
            TestTDGV = undefined;
        });

        describe('Check loaded nodes', function () {
            it('First check loaded nodes. They empty.', function () {
                assert.deepEqual(TestTDGV._loadedNodes, {});
            });
            it('Expand "Item 2". Loaded nodes equal { 2: true }.', function () {
                TestTDGV.expandNode(2);
                assert.deepEqual(TestTDGV._loadedNodes, { 2: true });
            });
            it('Collapse "Item 2". Loaded nodes equal { 2: true }.', function () {
                TestTDGV.expandNode(2);
                TestTDGV.collapseNode(2);
                assert.deepEqual(TestTDGV._loadedNodes, { 2: true });
            });
            it('Remove "Item 2" from items. Loaded nodes equal {}.', function () {
                var
                   items = TestTDGV.getItems();
                TestTDGV.expandNode(2);
                TestTDGV.collapseNode(2);
                items.remove(items.getRecordById(2));
                assert.deepEqual(TestTDGV._loadedNodes, {});
            });
        });
        describe('Check toggle nodes', function () {
            it('Expand nonexistent node.', function () {
                TestTDGV.expandNode('nonexistent_key');
            });
            it('Collapse nonexistent node.', function () {
                TestTDGV.collapseNode('nonexistent_key');
            });
            it('Toggle nonexistent node.', function () {
                TestTDGV.toggleNode('nonexistent_key');
            });
        });
    });

});