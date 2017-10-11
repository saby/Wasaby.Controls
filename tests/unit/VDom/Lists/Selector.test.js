///**
// * Created by am.gerasimov on 06.03.2017.
// */
///* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
//define(['js!WSControls/Lists/Selector',
//      'js!WS.Data/Collection/RecordSet',
//      'js!WSControls/Lists/resources/utils/ItemsUtil',
//      'js!WS.Data/Types/Enum'],
//   function (Selector,
//             RecordSet,
//             ItemsUtil,
//               Enum) {
//
//   'use strict';
//
//   describe('WSControls.Selector', function () {
//      var data, dataRs, myEnum;
//
//      beforeEach(function() {
//         data = [
//            {id : 1, title : 'Первый'},
//            {id : 2, title : 'Второй'},
//            {id : 3, title : 'Третий'},
//            {id : 4, title : 'Четвертый'}
//         ];
//         myEnum = new Enum({
//            dictionary: ['Первый', 'Второй', 'Третий', 'Четвертый']
//         });
//         dataRs = new RecordSet({
//            rawData: data,
//            idProperty : 'id'
//         });
//
//      });
//
//      describe('Base Func', function () {
//
//         it('SelectedIndex', function () {
//            var selector = new Selector({
//               selectedIndex : 2,
//               items: dataRs,
//               idProperty: 'id'
//            });
//            assert.equal(2, selector._selectedIndex, 'Option selectedIndex doesn\'t work (RS)');
//            assert.equal(3, selector._selectedKey, 'Option selectedIndex doesn\'t work (RS)');
//
//            selector = new Selector({
//               selectedIndex : 2,
//               items: data,
//               idProperty: 'id'
//            });
//            assert.equal(2, selector._selectedIndex, 'Option selectedIndex doesn\'t work (Array)');
//            assert.equal(3, selector._selectedKey, 'Option selectedIndex doesn\'t work (Array)');
//
//            selector = new Selector({
//               selectedIndex : 2,
//               items: myEnum,
//               idProperty: 'id'
//            });
//            assert.equal(2, selector._selectedIndex, 'Option selectedIndex doesn\'t work (Enum)');
//            assert.equal('Третий', selector._selectedKey, 'Option selectedIndex doesn\'t work (Enum)');
//         });
//
//         describe('AllowEmpty', function () {
//            it('true', function () {
//               var selector = new Selector({
//                  allowEmptySelection: true,
//                  items: dataRs,
//                  idProperty: 'id'
//               });
//               assert.equal(-1, selector._selectedIndex, 'Option allowEmptySelection doesn\'t work');
//               assert.equal(null, selector._selectedKey, 'Option allowEmptySelection doesn\'t work');
//            });
//
//            it('false + index', function () {
//               var selector = new Selector({
//                  allowEmptySelection: false,
//                  selectedIndex: 2,
//                  items: dataRs,
//                  idProperty: 'id'
//               });
//               assert.equal(2, selector._selectedIndex, 'Option allowEmptySelection doesn\'t work');
//               assert.equal(3, selector._selectedKey, 'Option allowEmptySelection doesn\'t work');
//            });
//
//            it('false + key', function () {
//               var selector = new Selector({
//                  allowEmptySelection: false,
//                  selectedKey: 3,
//                  items: dataRs,
//                  idProperty: 'id'
//               });
//               assert.equal(2, selector._selectedIndex, 'Option allowEmptySelection doesn\'t work');
//               assert.equal(3, selector._selectedKey, 'Option allowEmptySelection doesn\'t work');
//            });
//
//            it('false', function () {
//               var selector = new Selector({
//                  allowEmptySelection: false,
//                  items: dataRs,
//                  idProperty: 'id'
//               });
//               assert.equal(0, selector._selectedIndex, 'Option allowEmptySelection doesn\'t work');
//               assert.equal(1, selector._selectedKey, 'Option allowEmptySelection doesn\'t work');
//            })
//         });
//
//         it('SelectedKey', function () {
//            var selector = new Selector({
//               selectedKey : 2,
//               items: dataRs,
//               idProperty: 'id'
//            });
//            assert.equal(2, selector._selectedKey, 'Option selectedKey doesn\'t work (RS)');
//            assert.equal(1, selector._selectedIndex, 'Option selectedKey doesn\'t work (RS)');
//
//            selector = new Selector({
//               selectedKey : 2,
//               items: data,
//               idProperty: 'id'
//            });
//            assert.equal(2, selector._selectedKey, 'Option selectedKey doesn\'t work (Array)');
//            assert.equal(1, selector._selectedIndex, 'Option selectedKey doesn\'t work (Array)');
//
//            selector = new Selector({
//               selectedKey : 'Второй',
//               items: myEnum,
//               idProperty: 'id'
//            });
//            assert.equal('Второй', selector._selectedKey, 'Option selectedKey doesn\'t work (Enum)');
//            assert.equal(1, selector._selectedIndex, 'Option selectedKey doesn\'t work (Enum)');
//         });
//
//         it('_beforeUpdate', function () {
//            var selector = new Selector({
//               selectedKey : 2,
//               items: dataRs,
//               idProperty: 'id'
//            });
//
//            selector._beforeUpdate({
//               selectedKey : 3,
//               items: dataRs,
//               idProperty: 'id'
//            });
//            assert.equal(3, selector._selectedKey, '_beforeUpdate doesn\'t change key correctly');
//            assert.equal(2, selector._selectedIndex, '_beforeUpdate doesn\'t change key correctly');
//
//            selector._beforeUpdate({
//               selectedIndex : 0,
//               items: dataRs,
//               idProperty: 'id'
//            });
//            assert.equal(1, selector._selectedKey, '_beforeUpdate doesn\'t change index correctly');
//            assert.equal(0, selector._selectedIndex, '_beforeUpdate doesn\'t change index correctly');
//
//            selector._beforeUpdate({
//               selectedKey : 5,
//               items: dataRs,
//               idProperty: 'id'
//            });
//            assert.equal(undefined, selector._selectedKey, '_beforeUpdate doesn\'t change index correctly');
//            assert.equal(-1, selector._selectedIndex, '_beforeUpdate doesn\'t change index correctly');
//
//         });
//
//         describe('GetData', function(){
//
//            it('_isItemSelected', function () {
//               var rs = new RecordSet({
//                     rawData: data,
//                     idProperty : 'id'
//                  }),
//                  cfg = {
//                     items : rs,
//                     idProperty: 'id',
//                     displayProperty: 'title',
//                     selectedIndex: 1
//                  },
//                  ctrl = new Selector(cfg);
//               ctrl.saveOptions(cfg);
//               var proj = ctrl._display;
//               var isSel = ctrl._isItemSelected(proj.at(0));
//               assert.isFalse(isSel, 'selected in itemData in not correct');
//               isSel = ctrl._isItemSelected(proj.at(1));
//               assert.isTrue(isSel, 'selected in itemData in not correct');
//            })
//         });
//
//
//         it('_SetSelectedByHash', function () {
//
//            var cfg = {
//               selectedIndex : 2,
//               items: dataRs,
//               idProperty: 'id'
//            };
//            var selector = new Selector(cfg);
//            selector.saveOptions(cfg);
//
//            var display = selector._display;
//            var hash = display.at(1).getHash();
//
//            selector._setSelectedByHash(hash);
//            assert.equal(1, selector._selectedIndex, 'Method _setSelectedByHash doesn\'t work');
//            assert.equal(2, selector._selectedKey, 'Method _setSelectedByHash doesn\'t work');
//         });
//      });
//   });
//});