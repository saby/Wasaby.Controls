/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Controllers/ListSelector',
      'js!WS.Data/Collection/RecordSet',
      'js!WSControls/Lists/resources/utils/ItemsUtil',
      'js!WS.Data/Types/Enum'],
   function (ListSelector,
             RecordSet,
             ItemsUtil,
               Enum) {

   'use strict';

   describe('WSControls.Selector', function () {
      var data, dataRs, myEnum, projectionRs, projectionArray, projectionEnum;

      beforeEach(function() {
         data = [
            {id : 1, title : 'Первый'},
            {id : 2, title : 'Второй'},
            {id : 3, title : 'Третий'},
            {id : 4, title : 'Четвертый'}
         ];
         myEnum = new Enum({
            dictionary: ['Первый', 'Второй', 'Третий', 'Четвертый']
         });
         dataRs = new RecordSet({
            rawData: data,
            idProperty : 'id'
         });

         projectionRs = ItemsUtil.getDefaultDisplayFlat(dataRs, {});
         projectionArray = ItemsUtil.getDefaultDisplayFlat(data, {});
         projectionEnum = ItemsUtil.getDefaultDisplayFlat(myEnum, {});
      });

      describe('Base Func', function () {

         it('SelectedIndex', function () {
            var selector = new ListSelector({
               selectedIndex : 2,
               projection: projectionRs,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (RS)');
            assert.equal(3, selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (RS)');

            selector = new ListSelector({
               selectedIndex : 2,
               projection: projectionArray,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (Array)');
            assert.equal(3, selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (Array)');

            selector = new ListSelector({
               selectedIndex : 2,
               projection: projectionEnum,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (Enum)');
            assert.equal('Третий', selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (Enum)');
         });

         describe('AllowEmpty', function () {
            it('true', function () {
               var selector = new ListSelector({
                  allowEmptySelection: true,
                  projection: projectionRs,
                  idProperty: 'id'
               });
               assert.equal(-1, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(null, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + index', function () {
               var selector = new ListSelector({
                  allowEmptySelection: false,
                  selectedIndex: 2,
                  projection: projectionRs,
                  idProperty: 'id'
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(3, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + key', function () {
               var selector = new ListSelector({
                  allowEmptySelection: false,
                  selectedKey: 3,
                  projection: projectionRs,
                  idProperty: 'id'
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(3, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false', function () {
               var selector = new ListSelector({
                  allowEmptySelection: false,
                  projection: projectionRs,
                  idProperty: 'id'
               });
               assert.equal(0, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(1, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            })
         });
         it('SetSelectedIndex', function () {
            var selector = new ListSelector({
               selectedIndex : 2,
               projection: projectionRs,
               idProperty: 'id'
            });
            selector.setSelectedIndex(3);
            assert.equal(3, selector.getSelectedIndex(), 'Method setSelectedIndex doesn\'t work');
            assert.equal(4, selector.getSelectedKey(), 'Method setSelectedIndex doesn\'t work');
         });

         it('SelectedKey', function () {
            var selector = new ListSelector({
               selectedKey : 2,
               projection: projectionRs,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedKey(), 'Option selectedKey doesn\'t work (RS)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (RS)');

            selector = new ListSelector({
               selectedKey : 2,
               projection: projectionArray,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedKey(), 'Option selectedKey doesn\'t work (Array)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (Array)');

            selector = new ListSelector({
               selectedKey : 'Второй',
               projection: projectionEnum,
               idProperty: 'id'
            });
            assert.equal('Второй', selector.getSelectedKey(), 'Option selectedKey doesn\'t work (Enum)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (Enum)');
         });

         it('SetSelectedKey', function () {
            var selector = new ListSelector({
               selectedIndex : 2,
               projection: projectionRs,
               idProperty: 'id'
            });
            selector.setSelectedKey(3);
            assert.equal(2, selector.getSelectedIndex(), 'Method setSelectedKey doesn\'t work');
            assert.equal(3, selector.getSelectedKey(), 'Method setSelectedKey doesn\'t work');
         });



      });
   });
});