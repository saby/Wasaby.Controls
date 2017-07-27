/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!WSControls/Lists/Selector',
      'js!WS.Data/Collection/RecordSet',
      'js!WSControls/Lists/resources/utils/ItemsUtil',
      'js!WS.Data/Types/Enum'],
   function (Selector,
             RecordSet,
             ItemsUtil,
               Enum) {

   'use strict';

   describe('WSControls.Selector', function () {
      var data, dataRs, myEnum;

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

      });

      describe('Base Func', function () {

         it('SelectedIndex', function () {
            var selector = new Selector({
               selectedIndex : 2,
               items: dataRs,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (RS)');
            assert.equal(3, selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (RS)');

            selector = new Selector({
               selectedIndex : 2,
               items: data,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (Array)');
            assert.equal(3, selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (Array)');

            selector = new Selector({
               selectedIndex : 2,
               items: myEnum,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedIndex(), 'Option selectedIndex doesn\'t work (Enum)');
            assert.equal('Третий', selector.getSelectedKey(), 'Option selectedIndex doesn\'t work (Enum)');
         });

         describe('AllowEmpty', function () {
            it('true', function () {
               var selector = new Selector({
                  allowEmptySelection: true,
                  items: dataRs,
                  idProperty: 'id'
               });
               assert.equal(-1, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(null, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + index', function () {
               var selector = new Selector({
                  allowEmptySelection: false,
                  selectedIndex: 2,
                  items: dataRs,
                  idProperty: 'id'
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(3, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false + key', function () {
               var selector = new Selector({
                  allowEmptySelection: false,
                  selectedKey: 3,
                  items: dataRs,
                  idProperty: 'id'
               });
               assert.equal(2, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(3, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            });

            it('false', function () {
               var selector = new Selector({
                  allowEmptySelection: false,
                  items: dataRs,
                  idProperty: 'id'
               });
               assert.equal(0, selector.getSelectedIndex(), 'Option allowEmptySelection doesn\'t work');
               assert.equal(1, selector.getSelectedKey(), 'Option allowEmptySelection doesn\'t work');
            })
         });
         it('SetSelectedIndex', function () {
            var selector = new Selector({
               selectedIndex : 2,
               items: dataRs,
               idProperty: 'id'
            });
            selector.setSelectedIndex(3);
            assert.equal(3, selector.getSelectedIndex(), 'Method setSelectedIndex doesn\'t work');
            assert.equal(4, selector.getSelectedKey(), 'Method setSelectedIndex doesn\'t work');
         });

         it('SelectedKey', function () {
            var selector = new Selector({
               selectedKey : 2,
               items: dataRs,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedKey(), 'Option selectedKey doesn\'t work (RS)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (RS)');

            selector = new Selector({
               selectedKey : 2,
               items: data,
               idProperty: 'id'
            });
            assert.equal(2, selector.getSelectedKey(), 'Option selectedKey doesn\'t work (Array)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (Array)');

            selector = new Selector({
               selectedKey : 'Второй',
               items: myEnum,
               idProperty: 'id'
            });
            assert.equal('Второй', selector.getSelectedKey(), 'Option selectedKey doesn\'t work (Enum)');
            assert.equal(1, selector.getSelectedIndex(), 'Option selectedKey doesn\'t work (Enum)');
         });

         it('SetSelectedKey', function () {
            var selector = new Selector({
               selectedIndex : 2,
               items: dataRs,
               idProperty: 'id'
            });
            selector.setSelectedKey(3);
            assert.equal(2, selector.getSelectedIndex(), 'Method setSelectedKey doesn\'t work');
            assert.equal(3, selector.getSelectedKey(), 'Method setSelectedKey doesn\'t work');
         });



      });
   });
});