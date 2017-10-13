///* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
//define(['js!WSControls/Lists/ListView2', 'WS.Data/Source/Memory', 'Core/core-instance'],
//   function (ListView, MemorySource, cInstance) {
//
//      'use strict';
//
//      describe('WSControls.ListView', function () {
//         var data;
//
//         beforeEach(function() {
//            data = [
//               {
//                  id : 1,
//                  title : 'Первый',
//                  type: 1
//               },
//               {
//                  id : 2,
//                  title : 'Второй',
//                  type: 2
//               },
//               {
//                  id : 3,
//                  title : 'Третий',
//                  type: 2
//               }
//            ];
//         });
//
//         describe('Events', function () {
//
//            it('ItemClick', function () {
//               var cfg = {
//                  items : data,
//                  idProperty: 'id'
//               };
//               var ctrl = new ListView(cfg);
//               ctrl.saveOptions(cfg);
//
//               var display = ctrl._display;
//               ctrl._onItemClick({}, display.at(1));
//
//               assert.equal(2, ctrl._selectedKey, 'itemClick doesn\'t select key');
//               assert.equal(1, ctrl._selectedIndex, 'itemClick doesn\'t select index');
//            });
//
//            it('mousemove', function () {
//               var itemData;
//
//               var ctrl = new ListView({
//                  items : data,
//                  idProperty: 'id'
//               });
//
//               ctrl._mouseMove({}, ctrl._display.at(1));
//               assert.equal(1, ctrl._hoveredIndex, 'Wrong hovered index');
//
//               ctrl._mouseMove({}, ctrl._display.at(0));
//               assert.equal(0, ctrl._hoveredIndex, 'Wrong hovered index');
//
//               itemData = ctrl._getItemData(ctrl._display.at(0), 0);
//               assert.isTrue(itemData.hovered, 'Wrong itemData');
//               itemData = ctrl._getItemData(ctrl._display.at(1), 1);
//               assert.isFalse(itemData.hovered, 'Wrong itemData');
//            });
//
//            it('mouseleave', function () {
//               var ctrl = new ListView({
//                  items : data,
//                  idProperty: 'id'
//               });
//
//               ctrl._mouseMove({}, ctrl._display.at(1));
//               ctrl._mouseLeave({});
//               assert.equal(-1, ctrl._hoveredIndex, 'Wrong hovered index');
//            });
//
//            it('navigation', function () {
//               var dataSource = new MemorySource({
//                  data : data,
//                  idProperty: 'id'
//               });
//               var ctrl = new ListView({
//                  dataSource : dataSource,
//                  idProperty: 'id'
//               });
//
//               ctrl._beforeMount({
//                  dataSource : dataSource,
//                  idProperty: 'id',
//                  navigation : {
//                     type: 'page',
//                     config : {
//                        pageSize: 2
//                     }
//                  }
//               });
//
//               var params = ctrl._prepareQueryParams();
//               //проверим только наличие полей. Само содержимое тестируется в тестах навигации
//               assert.isTrue(params.limit !== undefined, '_prepareQuery params doesn\'t return correct limit');
//               assert.isTrue(params.offset !== undefined, '_prepareQuery params doesn\'t return correct limit');
//
//               ctrl._beforeUnmount();
//               assert.isTrue(ctrl._navigationController === null, '_beforeUnmount doesn\'t destroy navigationController');
//            });
//
//         });
//
//         describe('Virtual Scroll', function () {
//            var vsData, vsList, vsItemsContainer;
//
//            beforeEach(function() {
//               vsData = [
//                  {id : 1, title : '1', type: 1},
//                  {id : 2, title : '2', type: 1},
//                  {id : 3, title : '3', type: 1},
//                  {id : 4, title : '4', type: 1},
//                  {id : 5, title : '5', type: 1},
//                  {id : 6, title : '6', type: 1},
//                  {id : 7, title : '7', type: 1},
//                  {id : 8, title : '8', type: 1},
//                  {id : 9, title : '9', type: 1},
//                  {id : 10, title : '10', type: 1},
//                  {id : 11, title : '11', type: 1},
//                  {id : 12, title : '12', type: 1},
//                  {id : 13, title : '13', type: 1},
//                  {id : 14, title : '14', type: 1},
//                  {id : 15, title : '15', type: 1},
//                  {id : 16, title : '16', type: 1},
//                  {id : 17, title : '17', type: 1},
//                  {id : 18, title : '18', type: 1},
//                  {id : 19, title : '19', type: 1},
//                  {id : 20, title : '20', type: 1},
//                  {id : 21, title : '21', type: 1},
//                  {id : 22, title : '22', type: 1},
//                  {id : 23, title : '23', type: 1},
//                  {id : 24, title : '24', type: 1},
//                  {id : 25, title : '25', type: 1},
//                  {id : 26, title : '26', type: 1},
//                  {id : 27, title : '27', type: 1},
//                  {id : 28, title : '28', type: 1},
//                  {id : 29, title : '29', type: 1},
//                  {id : 30, title : '30', type: 1}
//               ];
//               vsItemsContainer = {
//                  children: [
//                     {offsetTop: 1},
//                     {offsetTop: 2},
//                     {offsetTop: 3},
//                     {offsetTop: 4},
//                     {offsetTop: 5},
//                     {offsetTop: 6},
//                     {offsetTop: 7},
//                     {offsetTop: 8},
//                     {offsetTop: 9},
//                     {offsetTop: 10},
//                     {offsetTop: 11},
//                     {offsetTop: 12},
//                     {offsetTop: 13},
//                     {offsetTop: 14},
//                     {offsetTop: 15},
//                     {offsetTop: 16},
//                     {offsetTop: 17},
//                     {offsetTop: 18},
//                     {offsetTop: 19},
//                     {offsetTop: 20},
//                     {offsetTop: 21},
//                     {offsetTop: 22},
//                     {offsetTop: 23},
//                     {offsetTop: 24},
//                     {offsetTop: 25},
//                     {offsetTop: 26},
//                     {offsetTop: 27},
//                     {offsetTop: 28},
//                     {offsetTop: 29},
//                     {offsetTop: 30}
//                  ]
//               };
//               vsList = new ListView({
//                  items : vsData,
//                  idProperty: 'id'
//               });
//               vsList._enableVirtualScroll = true;
//               vsList._virtualScroll.domElements.itemsContainer = vsItemsContainer;
//               vsList._virtualScroll.domElements.topPlaceholder = { offsetTop: 0 };
//               vsList._virtualScroll.domElements.bottomPlaceholder = { offsetTop: 40 };
//               vsList._virtualScroll.placeholderSize = {bottom: 0, top: 0};
//               vsList._virtualScroll.window = {start: 0, end: 15};
//            });
//
//            it('Init virtual scrolling', function() {
//               vsList._container = {
//                  children: function () {
//                     return [
//                        {
//                           name: 'topPlaceholder',
//                           className: vsList._virtualScroll.TOP_PLACEHOLDER,
//                           children: [
//                              {
//                                 name: 'topTrigger',
//                                 className: vsList._virtualScroll.TOP_TRIGGER
//                              }
//                           ]
//                        },
//                        {
//                           className: vsList._virtualScroll.ITEMS_CONTAINER,
//                           children: [
//                              {
//                                 name: 'itemsContainer'
//                              }
//                           ]
//                        },
//                        {
//                           name: 'bottomPlaceholder',
//                           className: vsList._virtualScroll.BOTTOM_PLACEHOLDER,
//                           children: [
//                              {
//                                 name: 'bottomTrigger',
//                                 className: vsList._virtualScroll.BOTTOM_TRIGGER
//                              }
//                           ]
//                        }
//                     ];
//                  }
//               };
//
//               vsList._display = {
//                  _getItems: function () {
//                     return {length: 30};
//                  }
//               };
//
//               global.IntersectionObserver = (function(){
//                  this.observe = function () {};
//                  return this;
//               });
//
//               vsList._initVirtualScroll();
//               assert.equal(vsList._virtualScroll.window.start, 0);
//               assert.equal(vsList._virtualScroll.window.end, 30);
//               assert.equal(vsList._virtualScroll.domElements.topPlaceholder.name, 'topPlaceholder');
//               assert.equal(vsList._virtualScroll.domElements.topLoadTrigger.name, 'topTrigger');
//               assert.equal(vsList._virtualScroll.domElements.bottomPlaceholder.name, 'bottomPlaceholder');
//               assert.equal(vsList._virtualScroll.domElements.bottomLoadTrigger.name, 'bottomTrigger');
//               assert.equal(vsList._virtualScroll.domElements.itemsContainer.name, 'itemsContainer');
//               delete global.IntersectionObserver;
//            });
//
//            it('Get start enumeration position', function () {
//               vsList._virtualScroll.window.start = 7;
//               vsList._virtualScroll.window.end = 10;
//               vsList._getStartEnumerationPosition();
//               assert.equal(vsList._enumIndexes._curIndex, 7);
//               assert.equal(vsList._enumIndexes._startIndex, 7);
//               assert.equal(vsList._enumIndexes._stopIndex, 10);
//            });
//
//            it('Placeholder trigger top', function () {
//               vsList._forceUpdate = function () {};
//               vsList._virtualScrollController = {
//                  updateWindowOnTrigger: function () {
//                     return {
//                        window: {
//                           start: 5,
//                           end: 20
//                        },
//                        topChange: 5,
//                        bottomChange: -5
//                     };
//                  }
//               };
//
//               vsList._virtualScrollReachTrigger('top');
//               assert.equal(vsList._virtualScroll.window.start, 5);
//               assert.equal(vsList._virtualScroll.window.end, 20);
//               assert.equal(vsList._virtualScroll.placeholderSize.bottom, 29);
//               assert.equal(vsList._virtualScroll.placeholderSize.top, 0);
//            });
//
//            it('Placeholder trigger b0ttom', function () {
//               vsList._forceUpdate = function () {};
//               vsList._virtualScrollController = {
//                  updateWindowOnTrigger: function () {
//                     return {
//                        window: {
//                           start: 5,
//                           end: 20
//                        },
//                        topChange: -5,
//                        bottomChange: 5
//                     };
//                  }
//               };
//
//               vsList._virtualScrollReachTrigger('bottom');
//               assert.equal(vsList._virtualScroll.window.start, 5);
//               assert.equal(vsList._virtualScroll.window.end, 20);
//               assert.equal(vsList._virtualScroll.placeholderSize.bottom, 0);
//               assert.equal(vsList._virtualScroll.placeholderSize.top, 5);
//            });
//
//            it('Get top items height', function() {
//               vsList._virtualScroll.window = {
//                  start: 0,
//                  end: 15
//               };
//
//               var height;
//
//               height = vsList._getTopItemsHeight(0);
//               assert.equal(height, 0);
//               height = vsList._getTopItemsHeight(1);
//               assert.equal(height, 1);
//               height = vsList._getTopItemsHeight(5);
//               assert.equal(height, 5);
//            });
//
//            it('Get bottom items height', function() {
//               vsList._virtualScroll.window = {
//                  start: 0,
//                  end: 15
//               };
//
//               var height;
//
//               height = vsList._getBottomItemsHeight(0);
//               assert.equal(height, 24);
//               height = vsList._getBottomItemsHeight(1);
//               assert.equal(height, 25);
//               height = vsList._getBottomItemsHeight(5);
//               assert.equal(height, 29);
//            });
//
//            it('Resize placeholder func', function() {
//               var newHeight;
//
//               newHeight = vsList._resizePlaceholder(50, 10);
//               assert.equal(newHeight, 60);
//               newHeight = vsList._resizePlaceholder(50, -10);
//               assert.equal(newHeight, 40);
//               newHeight = vsList._resizePlaceholder(5, -10);
//               assert.equal(newHeight, 0);
//               newHeight = vsList._resizePlaceholder(10, -10);
//               assert.equal(newHeight, 0);
//            });
//         });
//
//      });
//   });