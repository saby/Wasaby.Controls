define(
   [
      'Controls/Container/Adapter/SelectedKey'
   ],
   function(SelectedKeyContainer) {
      'use strict';

      describe('Controls.Container.Adapter.SelectedKey', function() {
         it('_beforeMount', function() {
            let sKeyContainer = new SelectedKeyContainer();
            sKeyContainer._beforeMount({selectedKey: 'testKey'});
            assert.deepEqual(sKeyContainer._selectedKeys, ['testKey']);
            sKeyContainer._beforeMount({selectedKey: null});
            assert.deepEqual(sKeyContainer._selectedKeys, []);
         });
         it('_beforeUpdate', function() {
            let sKeyContainer = new SelectedKeyContainer();
            sKeyContainer.saveOptions({selectedKey: 'testKey'});
            sKeyContainer._beforeUpdate({selectedKey: 'newTestKey'});
            assert.deepEqual(sKeyContainer._selectedKeys, ['newTestKey']);
         });
         it('_selectedKeysChanged', function() {
            let sKeyContainer = new SelectedKeyContainer(),
               key, isStopped;
            sKeyContainer.saveOptions({ selectedKey: '1' });
            sKeyContainer._notify = function(event, data) {
               if (event === 'selectedKeyChanged') {
                  key = data[0];
               }
            };
            let event = {
               stopPropagation: () => {
                  isStopped = true;
               }
            };
            sKeyContainer._selectedKeysChanged(event, ['4']);
            assert.equal(key, '4');
            assert.isTrue(isStopped);
            sKeyContainer._selectedKeysChanged(event, []);
            assert.equal(key, null);
            assert.isTrue(isStopped);
         });
         it('_private::getSelectedKeys', function() {
            let resultKeys = SelectedKeyContainer._private.getSelectedKeys(null);
            assert.deepEqual(resultKeys, []);
            resultKeys = SelectedKeyContainer._private.getSelectedKeys('testKey');
            assert.deepEqual(resultKeys, ['testKey']);
         });
      });
   }
);
