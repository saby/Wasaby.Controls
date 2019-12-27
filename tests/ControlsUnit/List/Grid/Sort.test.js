define(['Controls/grid'], function(grid) {
   describe('Controls.grid:SortButton', function() {
      const sortingParameters = [
         {
            parameterName: null,
            title: 'none'
         },
         {
            parameterName: 'F',
            title: 'first'
         },
         {
            parameterName: 'S',
            title: 'second'
         }];
      const sorting = [{ 'F': 'ASC' }];
      const cfg = { sorting: sorting, sortingParameters: sortingParameters };
      const SortButton = new grid.SortButton(cfg);
      let menuClosed = false;
      SortButton._notify = (eventName, args) => {
         cfg.sorting = args[0];
      };
      SortButton._children = {
         dropdown: {
            closeMenu: () => {
               menuClosed = true;
            }
         }
      };

      it('initial configurating', function() {
         SortButton._beforeMount(cfg);
         SortButton.saveOptions({...cfg});
         assert.deepEqual(SortButton._selectedKeys, [1]);
         assert.deepEqual(SortButton._currentParameterName, 'F');
         assert.deepEqual(SortButton._currentValue, 'ASC');
      });

      it('_switchSorting', function() {
         SortButton._switchSorting();
         SortButton.__beforeUpdate(cfg);
         assert.deepEqual(SortButton._selectedKeys, [1]);
         assert.deepEqual(SortButton._currentParameterName, 'F');
         assert.deepEqual(SortButton._currentValue, 'DESC');
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
         SortButton._itemArrowClick({}, item, 'ASC');
         SortButton.__beforeUpdate(cfg);
         assert.deepEqual(SortButton._selectedKeys, [2]);
         assert.deepEqual(SortButton._currentParameterName, 'S');
         assert.deepEqual(SortButton._currentValue, 'ASC');
         assert.isTrue(menuClosed);
      });
      it('_selectedKeysChangedHandler', function() {
         assert.isFalse(SortButton._selectedKeysChangedHandler({},[2]));
         SortButton._selectedKeysChangedHandler({},[0]);
         SortButton.__beforeUpdate(cfg);
         assert.deepEqual(SortButton._selectedKeys, [0]);
         assert.deepEqual(SortButton._currentParameterName, null);
         assert.deepEqual(SortButton._currentValue, null);
      });
   });
});
