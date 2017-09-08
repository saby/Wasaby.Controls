
define(['js!WSControls/Lists/MultiSelector'], function (MultiSelector) {
   'use strict';
   
   describe('MultiSelector', function () {
      var items = ['one', 'two', 'three'];
      
      describe('MultiSelector with multiSelect: true', function() {

         it('_setSelectedKeys', function() {
            var cfg = {
               multiSelect: true
            };
            var ms = new MultiSelector(cfg);
            ms.saveOptions(cfg);
            ms._setSelectedKeys([1, 2, 3]);
            assert.deepEqual([1, 2, 3], ms._selectedKeys);
   
            ms._setSelectedKeys([1]);
            assert.deepEqual([1], ms._selectedKeys);
         });
         
      });
   
      describe('MultiSelector with multiSelect: false', function() {
         it('_setSelectedKeys', function() {
            var cfg = {
               multiSelect: false
            };
            var ms = new MultiSelector(cfg);
            ms.saveOptions(cfg);
            ms._setSelectedKeys([1, 2, 3]);
            assert.deepEqual([1], ms._selectedKeys);
      
            ms._setSelectedKeys([2]);
            assert.deepEqual([2], ms._selectedKeys);
         });
      });
   
      describe('MultiSelector with allowEmptyMultiSelection: true', function() {
         it('check selectedKeys', function() {
            var cfg = {
               allowEmptyMultiSelection: true,
               items: items
            };
            var ms = new MultiSelector(cfg);
            ms.saveOptions(cfg);
            assert.deepEqual(null, ms._selectedKeys);
         });
      });
   
      describe('MultiSelector with allowEmptyMultiSelection: false', function() {
         it('check selectedKeys', function() {
            var cfg = {
               allowEmptyMultiSelection: false,
               items: items
            };
            var ms = new MultiSelector(cfg);
            ms.saveOptions(cfg);
            assert.deepEqual(['one'], ms._selectedKeys);
         });
      });
      
   });
   
});