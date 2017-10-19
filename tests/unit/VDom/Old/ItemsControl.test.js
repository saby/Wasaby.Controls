///**
// * Created by am.gerasimov on 06.03.2017.
// */
///* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
//define(['js!WSControls/Lists/ItemsControl', 'js!WS.Data/Collection/RecordSet', 'js!WS.Data/Source/Memory', 'Core/core-instance'],
//   function (ItemsControl, RecordSet, MemorySource, cInstance) {
//
//      'use strict';
//
//      describe('WSControls.ItemsControl', function () {
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
//            ]
//         });
//
//         describe('Init', function () {
//
//            it('Array.Simple', function () {
//               var ctrl = new ItemsControl({
//                  items : data
//               });
//
//               var display = ctrl._display;
//               assert.equal(data.length, display.getCount(), 'Count of display items is not equal to count of src items');
//            });
//
//            it('Recordset.Simple', function () {
//               var rs = new RecordSet({
//                     rawData: data,
//                     idProperty : 'id'
//                  }),
//                  ctrl = new ItemsControl({
//                     items : rs,
//                     idProperty: 'id'
//                  });
//
//               var display = ctrl._display;
//               assert.equal(rs.getCount(), display.getCount(), 'Count of display items is not equal to count of src items');
//            });
//
//            it('Array.Simple + Source', function () {
//               var source = new MemorySource({
//                  data: data,
//                  idProperty : 'id'
//               });
//
//               var ctrl = new ItemsControl({
//                  items : data,
//                  dataSource : source,
//                  handlers : {
//                     'onItemsReady' : function(e, list) {
//                        assert.isTrue(cInstance.instanceOfModule(this._items, 'WS.Data/Collection/RecordSet'), 'ItemsControl getItems() after reload() must returns Recordset');
//                     }
//                  }
//               });
//            });
//
//            it('Recordset + Source', function () {
//               var source = new MemorySource({
//                  data: data,
//                  idProperty : 'id'
//               });
//
//               var rs = new RecordSet({
//                  rawData: data,
//                  idProperty : 'id'
//               });
//
//               var ctrl = new ItemsControl({
//                  items : rs,
//                  dataSource : source,
//                  handlers : {
//                     'onItemsReady' : function(e, list) {
//                        assert.equal(rs, this._items, 'After reload getItems() must return instance of initial recordset');
//                     }
//                  }
//               });
//            });
//
//            it('Enumeration', function () {
//               var ctrl = new ItemsControl({
//                  items : data
//               });
//               var indexes = ctrl._enumIndexes;
//               assert.equal(0, indexes._startIndex, 'Incorrect start enumeration index after constructor');
//               assert.equal(3, indexes._stopIndex, 'Incorrect stop enumeration index after constructor');
//               assert.equal(0, indexes._curIndex, 'Incorrect current enumeration index after constructor');
//
//               indexes._curIndex = 22;
//               ctrl._getStartEnumerationPosition();
//               assert.equal(0, indexes._curIndex, 'Incorrect current enumeration index after _getStartEnumerationPosition');
//
//               ctrl._getNextEnumerationPosition();
//               ctrl._getNextEnumerationPosition();
//               assert.equal(2, indexes._curIndex, 'Incorrect current enumeration index after 2x_getNextEnumerationPosition');
//
//               var condResult = ctrl._checkConditionForEnumeration();
//               assert.isTrue(condResult, 'Incorrect condition value enumeration index after 2x_getNextEnumerationPosition');
//               ctrl._getNextEnumerationPosition();
//               condResult = ctrl._checkConditionForEnumeration();
//               assert.isFalse(condResult, 'Incorrect condition value enumeration index after 3x_getNextEnumerationPosition');
//            });
//
//         });
//      });
//   });