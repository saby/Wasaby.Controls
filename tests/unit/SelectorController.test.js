/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Controllers/BaseListSelector',
   'js!WSControls/Controllers/RecordsetListSelector',
   'js!SBIS3.CONTROLS.ListView/ListViewHelpers'],
   function (BaseListSelector,
             RecordsetListSelector,
             ListViewHelpers) {

   'use strict';

   describe('WSControls.Selector', function () {
      var data, dataRs, projection;

      beforeEach(function() {
         data = [
            {id : 1, title : 'Первый'},
            {id : 2, title : 'Второй'},
            {id : 3, title : 'Третий'},
            {id : 4, title : 'Четвертый'}
         ];
         dataRs = ListViewHelpers.calculateItems(data, 'id').items;
         projection = ListViewHelpers.createDefaultProjection(dataRs, {idProperty : 'id'});
      });

      describe('Base', function () {

         it('SelectedIndex', function () {
            var selector = new BaseListSelector({
               selectedIndex : 2,
               projection: projection
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work');
         });

         describe('AllowEmpty', function () {
            it('true', function () {
               var selector = new BaseListSelector({
                  allowEmptySelection: true,
                  projection: projection
               });
               assert.equal(-1, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + index', function () {
               var selector = new BaseListSelector({
                  allowEmptySelection: false,
                  selectedIndex: 2,
                  projection: projection
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false', function () {
               var selector = new BaseListSelector({
                  allowEmptySelection: false,
                  projection: projection
               });
               assert.equal(0, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
            })
         });
         it('SetSelectedIndex', function () {
            var selector = new BaseListSelector({
               selectedIndex : 2,
               projection: projection
            });
            selector.setSelectedIndex(3);
            assert.equal(3, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work');
         });
      });

      describe('Recordset', function () {

         it('SelectedIndex', function () {
            var selector = new RecordsetListSelector({
               selectedIndex : 2,
               projection: projection
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work');
            assert.equal(3, selector.getSelectedKey(), 'Option selectedIndex doesn\'t work');
         });

         describe('AllowEmpty', function () {
            it('true', function () {
               var selector = new RecordsetListSelector({
                  allowEmptySelection: true,
                  projection: projection
               });
               assert.equal(-1, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(null, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + index', function () {
               var selector = new RecordsetListSelector({
                  allowEmptySelection: false,
                  selectedIndex: 2,
                  projection: projection
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(3, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false', function () {
               var selector = new RecordsetListSelector({
                  allowEmptySelection: false,
                  projection: projection
               });
               assert.equal(0, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(1, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            })
         });
         it('SetSelectedIndex', function () {
            var selector = new RecordsetListSelector({
               selectedIndex : 2,
               projection: projection
            });
            selector.setSelectedIndex(3);
            assert.equal(3, selector.getSelectedIndex(), 'Method setSelectedIndex doesn\'t work');
            assert.equal(4, selector.getSelectedKey(), 'Method setSelectedIndex doesn\'t work');
         });

         it('SetSelectedKey', function () {
            var selector = new RecordsetListSelector({
               selectedIndex : 2,
               projection: projection
            });
            selector.setSelectedKey(3);
            assert.equal(2, selector.getSelectedIndex(), 'Method setSelectedKey doesn\'t work');
            assert.equal(3, selector.getSelectedKey(), 'Method setSelectedKey doesn\'t work');
         });


         it('SelectedKey', function () {
            var selector = new RecordsetListSelector({
               selectedKey : 1,
               projection: projection
            });
            assert.equal(selector.getSelectedKey(), 1, 'Option selectedKey doesn\'t work');
            assert.equal(selector.getSelectedIndex(), 0, 'Option selectedKey doesn\'t work');
         });
      });
   });
});