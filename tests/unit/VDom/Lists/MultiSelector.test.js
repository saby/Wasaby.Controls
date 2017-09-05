
define(['js!WSControls/Lists/MultiSelector'], function (MultiSelector) {
   'use strict';
   
   describe('MultiSelector', function () {
      var items = ['one', 'two', 'three'];
      
      describe('MultiSelector with multiSelect: true', function() {
         var ms;
         
         before(function() {
            ms = new MultiSelector({
               multiSelect: true
            });
         });
         
         after(function() {
            ms.destroy();
         });
         
         it('_setSelectedKeys', function() {
            ms._setSelectedKeys([1, 2, 3]);
            assert.deepEqual([1, 2, 3], ms._selectedKeys);
   
            ms._setSelectedKeys([1]);
            assert.deepEqual([1], ms._selectedKeys);
         });
         
      });
   
      describe('MultiSelector with multiSelect: false', function() {
         var ms;
   
         before(function() {
            ms = new MultiSelector({
               multiSelect: false
            });
         });
   
         after(function() {
            ms.destroy();
         });
   
         it('_setSelectedKeys', function() {
            ms._setSelectedKeys([1, 2, 3]);
            assert.deepEqual([1], ms._selectedKeys);
      
            ms._setSelectedKeys([2]);
            assert.deepEqual([2], ms._selectedKeys);
         });
      });
   
      describe('MultiSelector with allowEmptyMultiSelection: true', function() {
         var ms;
   
         before(function() {
            ms = new MultiSelector({
               allowEmptyMultiSelection: true,
               items: items
            });
         });
   
         after(function() {
            ms.destroy();
         });
         
         it('check selectedKeys', function() {
            assert.deepEqual(null, ms._selectedKeys);
         });
      });
   
      describe('MultiSelector with allowEmptyMultiSelection: false', function() {
         var ms;
   
         before(function() {
            ms = new MultiSelector({
               allowEmptyMultiSelection: false,
               items: items
            });
         });
   
         after(function() {
            ms.destroy();
         });
   
         it('check selectedKeys', function() {
            assert.deepEqual(['one'], ms._selectedKeys);
         });
      });
      
   });
   
});