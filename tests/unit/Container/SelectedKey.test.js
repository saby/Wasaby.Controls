define(
   [
      'Controls/Container/Adapter/SelectedKey',
      'Types/collection'
   ],
   function(SelectedKeyContainer, collection) {
      'use strict';

      describe('Controls.Container.Adapter.SelectedKey', function() {
         let items = new collection.RecordSet({
            idProperty: 'id',
            rawData: [
               {id: null, title: 'first'},
               {id: true, title: 'second'},
               {id: false, title: 'third'}
            ]
         });
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

            sKeyContainer._items = items;
            sKeyContainer._beforeUpdate({selectedKey: null});
            assert.deepEqual(sKeyContainer._selectedKeys, [null]);
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
            sKeyContainer._selectedKey = '1';
            sKeyContainer._selectedKeysChanged(event, ['4']);
            assert.equal(key, '4');
            assert.equal(sKeyContainer._selectedKey, '1');
            assert.isTrue(isStopped);
            sKeyContainer._selectedKeysChanged(event, []);
            assert.equal(key, null);
            assert.equal(sKeyContainer._selectedKey, '1');
            assert.isTrue(isStopped);
         });
         it('_private::getSelectedKeys', function() {
            let resultKeys = SelectedKeyContainer._private.getSelectedKeys(null);
            assert.deepEqual(resultKeys, []);
            resultKeys = SelectedKeyContainer._private.getSelectedKeys('testKey');
            assert.deepEqual(resultKeys, ['testKey']);
            resultKeys = SelectedKeyContainer._private.getSelectedKeys(null, items);
            assert.deepEqual(resultKeys, [null]);
         });
         it('_private::dataLoadCallbackHandler', function() {
            let sKeyContainer = new SelectedKeyContainer(),
               options = {dataLoadCallback: () => { dataLoaded = true; }},
               dataLoaded = false;
            sKeyContainer._beforeMount(options);
            sKeyContainer.saveOptions(options);
            sKeyContainer._dataLoadCallbackHandler([]);
            assert.deepEqual(sKeyContainer._items, []);
            assert.isTrue(dataLoaded);
         });
      });
   }
);
