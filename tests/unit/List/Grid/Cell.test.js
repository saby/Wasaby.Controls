define([
   'Controls/_grid/layouts/partialGridSupport/Cell'
], function(Cell) {

   describe('Controls/_grid/layouts/partialGridSupport/Cell', function() {

      it('getCellClasses', function() {
         let
             options = {
                itemData: {
                   isHovered: true,
                   style: 'primary'
                },
                highlightOnHover: true
             },
             cell = new Cell(options);

         cell._beforeMount(options);
         cell.saveOptions(options);

         assert.equal('controls-ListView__itemV controls-Grid__row_primary controls-Grid_row-cell_hovered ' +
             'controls-Grid__row_highlightOnHover_primary', cell.getCellClasses());

         cell._options.itemData.isHovered = false;
         cell._options.itemData.style = null;

         assert.equal('controls-ListView__itemV controls-Grid__row_default ' +
             'controls-Grid__row_highlightOnHover_default', cell.getCellClasses());

         cell._options.itemData.isHovered = true;
         cell._options.highlightOnHover = false;

         assert.equal('controls-ListView__itemV controls-Grid__row_default controls-Grid_row-cell_hovered', cell.getCellClasses());

      });

      it('event handler from options should be called on event', function() {
         let
             eventHandlers = {
                'click': '_onClick',
                'mouseenter': '_onMouseEnter',
                'mouseleave': '_onMouseLeave',
                'mousemove': '_onMouseMoveHandler',
                'mousedown': '_onMouseDown',
                'wheel': '_onWheel',
                'contextmenu': '_onContextMenu',
                'swipe': '_onSwipe'
             },
             calledHandlers = {},
             mockOptions = {
                eventHandlers: {},
                itemData: {
                   dispItem: {
                      any: 124
                   }
                }
             },
             cell;

         for (let eName in eventHandlers) {
            mockOptions.eventHandlers[eName] = (eventName, item) => {
               calledHandlers[eName] = true;
               if (eName === 'click') {
                  assert.deepEqual(mockOptions.itemData.dispItem, item);
               } else {
                  assert.deepEqual(mockOptions.itemData, item);
               }
            }
         }
         cell = new Cell(mockOptions);
         cell._beforeMount(mockOptions);
         cell.saveOptions(mockOptions);

         for (let eName in eventHandlers) {
            let item = eName === 'click' ? mockOptions.itemData.dispItem : mockOptions.itemData;
            cell._callHandler({type: eName}, item);
            assert.isTrue(calledHandlers[eName]);
            calledHandlers[eName] = eventHandlers[eName];
         }

         assert.deepEqual(calledHandlers, eventHandlers);

      });

      it('should not notify about click if item is editing now', function () {
         let
             called = false,
             options = {
                itemData: {
                   isEditing: true
                },
                eventHandlers: {
                   'click': () => {
                      called = true
                   }
                }
             },
             cell = new Cell(options);
         cell.saveOptions(options);

         cell._beforeMount(options);
         cell._callHandler({type:'click'}, {});
         assert.isFalse(called);
      });
   });

});



