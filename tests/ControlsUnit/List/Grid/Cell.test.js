define([
   'Controls/_grid/layout/partialGrid/Cell'
], function(Cell) {

   describe('Controls/_grid/layout/partialGrid/Cell', function() {

      it('getCellClasses', function() {
         let
             options = {
                itemData: {
                   isHovered: true,
                   style: 'primary'
                },
                highlightOnHover: true
             },
             cell = new Cell.default(options);

         cell._beforeMount(options);
         cell.saveOptions(options);

         assert.equal('controls-ListView__itemV controls-ListView__itemV_cursor-pointer ' +
            'controls-Grid__row_primary_theme-default controls-Grid_row-cell_hovered_theme-default ' +
            'controls-Grid__row_highlightOnHover_primary_theme-default', cell.getCellClasses());

         cell._options.itemData.isHovered = false;
         cell._options.itemData.style = null;

         assert.equal('controls-ListView__itemV controls-ListView__itemV_cursor-pointer controls-Grid__row_default_theme-default ' +
            'controls-Grid__row_highlightOnHover_default_theme-default', cell.getCellClasses());

         cell._options.itemData.isHovered = true;
         cell._options.highlightOnHover = false;

         assert.equal('controls-ListView__itemV controls-ListView__itemV_cursor-pointer controls-Grid__row_default_theme-default controls-Grid_row-cell_hovered_theme-default', cell.getCellClasses());

         cell._options.clickable = false;
         assert.equal('controls-ListView__itemV controls-ListView__itemV_cursor-default controls-Grid__row_default_theme-default controls-Grid_row-cell_hovered_theme-default', cell.getCellClasses());

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
         cell = new Cell.default(mockOptions);
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
             cell = new Cell.default(options);
         cell.saveOptions(options);

         cell._beforeMount(options);
         cell._callHandler({type:'click'}, {});
         assert.isFalse(called);
      });

      it('should not notify about click if item is a breadCrumbs', function () {
         let
            called = false,
            options = {
                itemData: {
                    isEditing: false
                },
               eventHandlers: {
                  'click': () => {
                     called = true
                  }
               }
            },
            cell = new Cell.default(options),
            propagationStopped = false,
            fakeItem = {getContents: function() {
                  return [{},{}];
               }
            },
            fakeEvent = {
                type: 'click',
                stopPropagation: function() {
                    propagationStopped = true;
                }
            };
         cell.saveOptions(options);

         cell._beforeMount(options);
         cell._callHandler(fakeEvent, fakeItem);
         assert.isFalse(called);
         assert.isTrue(propagationStopped);
      });
   });

});



