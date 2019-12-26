define(['Controls/grid'], function(grid) {
   describe('Controls.grid:SortMenu', function() {
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
      const sortMenu = new grid.SortMenu(cfg);
      let menuClosed = false;
      sortMenu._notify = (eventName, args) => {
         cfg.sorting = args[0];
      };
      sortMenu._children = {
         dropdown: {
            closeMenu: () => {
               menuClosed = true;
            }
         }
      };

      it('initial configurating', function() {
         sortMenu._beforeMount(cfg);
         sortMenu.saveOptions({...cfg});
         assert.deepEqual(sortMenu._selectedKeys, [1]);
         assert.deepEqual(sortMenu._currentParameterName, 'F');
         assert.deepEqual(sortMenu._currentValue, 'ASC');
      });

      it('_switchSorting', function() {
         sortMenu._switchSorting();
         sortMenu.__beforeUpdate(cfg);
         assert.deepEqual(sortMenu._selectedKeys, [1]);
         assert.deepEqual(sortMenu._currentParameterName, 'F');
         assert.deepEqual(sortMenu._currentValue, 'DESC');
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
         sortMenu._itemArrowClick({}, item, 'ASC');
         sortMenu.__beforeUpdate(cfg);
         assert.deepEqual(sortMenu._selectedKeys, [2]);
         assert.deepEqual(sortMenu._currentParameterName, 'S');
         assert.deepEqual(sortMenu._currentValue, 'ASC');
         assert.isTrue(menuClosed);
      });
   });
});
