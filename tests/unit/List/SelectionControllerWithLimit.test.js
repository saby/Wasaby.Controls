define([
   'Controls/_list/BaseControl/SelectionController',
   'Types/collection',
   'Types/entity',
   'Controls/operations'
], function(
   SelectionController,
   collection,
   entity,
   operations
) {
   'use strict';
   describe('Controls.List.BaseControl.SelectionControllerWithLimit', function() {
      var
         instance,
         items = [
            {
               'id': 1
            }, {
               'id': 2
            }, {
               'id': 3
            }, {
               'id': 4
            }, {
               'id': 5
            }, {
               'id': 6
            }, {
               'id': 7
            }
         ],
         rs,
         cfg,
         sandbox;

      beforeEach(function() {
         sandbox = sinon.createSandbox();
         rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: items
         });
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: rs,
            keyProperty: 'id',
            listModel: {
               updateSelection: sandbox.stub()
            }
         };
         instance = new SelectionController();
         instance.saveOptions(cfg);
      });

      afterEach(function() {
         sandbox.restore();
      });

      it('select all with limit', async function() {
         await instance._beforeMount(cfg);
         const stubSetLimit = sandbox.stub(instance._multiselection, 'setLimit');
         const stubSelectAll = sandbox.stub(instance._multiselection, 'selectAll');
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll', 3);
         assert.isTrue(stubSetLimit.withArgs(3).calledOnce);
         assert.isTrue(stubSelectAll.calledOnce);
      });

      it('exclude item with limit', async function() {
         await instance._beforeMount(cfg);
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll', 3);
         instance.onCheckBoxClick(2, true);
         assert.isTrue(instance._multiselection._excludedKeys.includes(2));
      });

      it('expand limit on select', async function() {
         await instance._beforeMount(cfg);
         const stubExpandLimit = sandbox.stub(instance._multiselection, '_expandLimit');
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll', 3);
         instance.onCheckBoxClick(7, false);
         assert.isTrue(stubExpandLimit.withArgs([7]).calledOnce);
      });

      it('call _expandLimit on select', async function() {
         await instance._beforeMount(cfg);
         const stubExpandLimit = sandbox.stub(instance._multiselection, '_expandLimit');
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll', 3);
         instance.onCheckBoxClick(7, false);
         assert.isTrue(stubExpandLimit.withArgs([7]).calledOnce);
      });

      it('incrace limit', async function() {
         await instance._beforeMount(cfg);
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll', 3);
         instance.onCheckBoxClick(7, false);
         assert.isTrue(instance._multiselection._limit === 7);
         assert.deepEqual(instance._multiselection._excludedKeys, [4, 5, 6]);
      });
   });
});
