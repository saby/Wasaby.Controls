define(
   [
      'Controls/Button/SelectorButton',
      'WS.Data/Collection/List',
      'Core/core-clone',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Source/Memory'
   ],
   function(SelectorButton, List, Clone, RecordSet, Memory) {
      describe('SelectorButton', function() {
         let initItems = [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            }
         ];
         let source = new Memory({
            data: initItems,
            idProperty: 'id'
         });

         let config = {
            source: source,
            selectedKeys: ['1', '2', '3'],
            keyProperty: 'id',
            displayProperty: 'title',
            caption: 'Выберите запись'
         };

         let getButton = function(config) {
            let selButton = new SelectorButton(config);
            selButton.saveOptions(config);
            return selButton;
         };

         it('_beforeMount', function(done) {
            let button = getButton(config);
            button._beforeMount(config).addCallback(function() {
               assert.deepEqual(button._selectedItems.getCount(), 3);
               assert.deepEqual(button._selectedItems.at(0).getId(), '1');
               assert.equal(button._text, 'Запись 1, Запись 2, Запись 3');
               done();
            });
         });

         it('_beforeMount with filter', function(done) {
            let filterConfig = Clone(config);
            filterConfig.filter = {
               id: '3'
            };
            let button = getButton(filterConfig);
            button._beforeMount(filterConfig).addCallback(function(loadItems) {
               assert.deepEqual(loadItems.getRawData(), [{
                  id: '3',
                  title: 'Запись 3'
               }]);
               assert.equal(button._text, 'Запись 3');
               done();
            });
         });

         it('_beforeMount from receivedState', function() {
            let button = getButton(config);
            button._beforeMount(config, undefined, new RecordSet({
               rawData: initItems, idProperty: 'id'
            }));
            assert.deepEqual(button._selectedItems.getCount(), 5);
            assert.deepEqual(button._selectedItems.at(0).getId(), '1');
            assert.deepEqual(button._selectedItems.at(4).getId(), '5');
            assert.equal(button._text, 'Запись 1, Запись 2, Запись 3, Запись 4, Запись 5');
         });

         it('_beforeUpdate', function(done) {
            let button = getButton(config);
            button._beforeMount({});
            var newConfig = Clone(config);
            newConfig.selectedKeys = ['2', '4'];
            button._beforeUpdate(newConfig).addCallback(function() {
               assert.deepEqual(button._selectedItems.getCount(), 2);
               assert.deepEqual(button._selectedItems.at(0).getId(), '2');
               assert.equal(button._text, 'Запись 2, Запись 4');
               done();
            });
         });

         it('getCaption', function() {
            let text = SelectorButton._private.getCaption(new RecordSet({
               rawData: initItems, idProperty: 'id'
            }), 'title');
            assert.equal(text, 'Запись 1, Запись 2, Запись 3, Запись 4, Запись 5');
         });

         it('getSelectedKeys', function() {
            let keys = SelectorButton._private.getSelectedKeys(new RecordSet({
               rawData: initItems, idProperty: 'id'
            }), 'id');
            assert.deepEqual(keys, ['1', '2', '3', '4', '5']);
         });

         it('open', function() {
            let OpenConfig = Clone(config);
            let button = getButton(OpenConfig);
            button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
            button._open();
         });

         it('result', function() {
            let button = getButton(config);
            button._beforeMount({});
            button._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], ['2', '3']);
               }
            };
            button._onResult(new RecordSet({
               rawData: initItems.slice(1, 3), idProperty: 'id'
            }));
            assert.deepEqual(button._selectedItems.getCount(), 2);
            assert.equal(button._text, 'Запись 2, Запись 3');
         });

         it('reset', function() {
            let button = getButton(config);
            button._beforeMount({});
            button._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], []);
               }
            };
            button._selectedKeys = ['1', '2', '3'];
            button._text = 'Запись 1, Запись 2, Запись 3';
            button._reset();
            assert.deepEqual(button._selectedItems.length, 0);
            assert.equal(button._text, '');
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
