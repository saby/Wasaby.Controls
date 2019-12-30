define(['Controls/grid', 'Types/source'], function(grid, TypesSource) {
   describe('Controls.grid:SortingSelector', function() {
      const sortingParameters = [
         {
            id: 1,
            parameterName: null,
            title: 'none'
         },
         {
            id: 2,
            parameterName: 'F',
            title: 'first'
         },
         {
            id: 3,
            parameterName: 'S',
            title: 'second'
         }];
      const source = new TypesSource.Memory({
         data: sortingParameters,
         keyProperty: 'id',
      });
      const sorting = [{ 'F': 'ASC' }];
      const cfg = { value: sorting, source: source, keyProperty: 'id', displayProperty: 'title', sortingParameterProperty: 'parameterName' };
      const sortingSelector = new grid.SortingSelector(cfg);
      let menuClosed = false;
      sortingSelector._notify = (eventName, args) => {
         cfg.value = args[0];
      };
      sortingSelector._children = {
         dropdown: {
            closeMenu: () => {
               menuClosed = true;
            }
         }
      };

      it('initial configurating', function() {
         sortingSelector._beforeMount(cfg);
         sortingSelector.saveOptions({...cfg});
         assert.deepEqual(sortingSelector._selectedKeys, [2]);
         assert.deepEqual(sortingSelector._currentParameterName, 'F');
         assert.deepEqual(sortingSelector._currentOrder, 'ASC');
      });

      it('_switchSorting', function() {
         sortingSelector._switchValue();
         sortingSelector.__beforeUpdate(cfg);
         assert.deepEqual(sortingSelector._selectedKeys, [2]);
         assert.deepEqual(sortingSelector._currentParameterName, 'F');
         assert.deepEqual(sortingSelector._currentOrder, 'DESC');
      });

      it('_itemArrowClick', function() {
         const item = {
            id: 2,
            parameterName: 'S',
            get: (prop) => {
               return item[prop];
            }
         };
         assert.isFalse(menuClosed);
         sortingSelector._itemArrowClick({}, item, 'ASC');
         sortingSelector.__beforeUpdate(cfg);
         assert.deepEqual(sortingSelector._selectedKeys, [3]);
         assert.deepEqual(sortingSelector._currentParameterName, 'S');
         assert.deepEqual(sortingSelector._currentOrder, 'ASC');
         assert.isTrue(menuClosed);
      });
      it('_selectedKeysChangedHandler', function() {
         assert.isFalse(sortingSelector._selectedKeysChangedHandler({},[2]));
         sortingSelector._selectedKeysChangedHandler({},[1]);
         sortingSelector.__beforeUpdate(cfg);
         assert.deepEqual(sortingSelector._selectedKeys, [1]);
         assert.deepEqual(sortingSelector._currentParameterName, null);
         assert.deepEqual(sortingSelector._currentOrder, null);
      });
   });
});
