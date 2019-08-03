define(
   [
      'Controls/_filterPopup/Panel/PropertyGrid'
   ],
   function(PropertyGrid) {
      describe('FilterPropertyGrid', function() {
         var config = {
            items: [
               {
                  id: 'list',
                  value: 1,
                  resetValue: 1,
                  visibility: true
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               }
            ]
         };

         function getPropertyGrid(PGConfig) {
            var pGrid = new PropertyGrid(PGConfig);
            pGrid._beforeMount(PGConfig);
            pGrid.saveOptions(PGConfig);
            return pGrid;
         }


         it('_private::getIndexChangedVisibility', function() {
            var oldItems = [
               {
                  id: 'list',
                  value: 1,
                  resetValue: 1
               },
               {
                  id: 'text',
                  value: '',
                  resetValue: '',
                  visibility: false
               },
               {
                  id: 'bool',
                  value: false,
                  resetValue: false,
                  visibility: false
               }
            ];
            var newItems = [
               {
                  id: 'list',
                  value: 5,
                  resetValue: 1
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               }
            ];
            assert.equal(PropertyGrid._private.getIndexChangedVisibility(newItems, oldItems), 1);
            oldItems[1].visibility = true;
            newItems[1].visibility = false;
            assert.equal(PropertyGrid._private.getIndexChangedVisibility(newItems, oldItems), -1);
            newItems.push({
               id: 'newItem',
               value: 'testValue',
               resetValue: '',
               visibility: true
            });
            assert.equal(PropertyGrid._private.getIndexChangedVisibility(newItems, oldItems), -1);
         });

         it('_beforeUpdate', function() {
            var pGrid = getPropertyGrid(config);
            var newItems = [
               {
                  id: 'list',
                  value: 5,
                  resetValue: 1
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: true
               }
            ];
            pGrid._beforeUpdate({ items: newItems });
            assert.equal(pGrid._changedIndex, 2);
            assert.deepEqual(pGrid._items, newItems);

            pGrid._beforeUpdate({ items: newItems });
            assert.equal(pGrid._changedIndex, -1);
         });

         it('_afterMount', function() {
            let pGrid = getPropertyGrid(config);
            let newItems = [
               {
                  id: 'list',
                  value: 5,
                  resetValue: 1
               }
            ];
            let itemsChanged = false;
            pGrid._notify = () => {
               itemsChanged = true;
            };

            pGrid._afterMount({ items: newItems });
            pGrid._items[0].value = 'test';

            assert.isTrue(itemsChanged);
         });

         it('_isItemVisible', function() {
            var pGrid = getPropertyGrid(config);
            assert.equal(pGrid._isItemVisible(config.items[0]), true);
            assert.equal(pGrid._isItemVisible(config.items[1]), true);
            assert.equal(pGrid._isItemVisible(config.items[2]), false);
         });

         it('_valueChangedHandler', function() {
            let pGrid = getPropertyGrid(config);
            let result;
            pGrid._notify = (event, data) => {
               if (event === 'itemsChanged') {
                  result = data[0];
               }
            };
            pGrid._valueChangedHandler('_valueChangedHandler', 2, true);
            assert.strictEqual(pGrid._items[2].value, true);
            assert.deepStrictEqual(result[2], {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            });
            pGrid._valueChangedHandler('_valueChangedHandler', 2, false);
            assert.strictEqual(pGrid._items[2].value, false);
            assert.deepStrictEqual(result[2], {
               id: 'bool',
               value: false,
               resetValue: false,
               visibility: false
            });
         });

         it('_visibilityChangedHandler', function() {
            let pGrid = getPropertyGrid(config);
            let result;
            pGrid._notify = (event, data) => {
               if (event === 'itemsChanged') {
                  result = data[0];
               }
            };
            pGrid._visibilityChangedHandler('visibilityChanged', 2, true);
            assert.strictEqual(pGrid._items[2].visibility, true);
            assert.deepStrictEqual(result[2], {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: true
            });
            pGrid._visibilityChangedHandler('visibilityChanged', 2, false);
            assert.strictEqual(pGrid._items[2].visibility, false);
            assert.deepStrictEqual(result[2], {
               id: 'bool',
               value: false,
               resetValue: false,
               visibility: false
            });
         });

      });
   }
);
