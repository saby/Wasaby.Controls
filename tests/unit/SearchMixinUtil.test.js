/**
 * Created by am.gerasimov on 27.06.2017.
 */
define(['SBIS3.CONTROLS/Mixins/SearchMixin/SearchMixinUtil'], function (SearchMixinUtil) {
   
   'use strict';
   describe('SBIS3.CONTROLS/Mixins/SearchMixin/SearchMixinUtil', function () {
      
      
      
      describe('.needSearch', function (){
         var startCharacter, emptyStartCharacter;
         
         before(function() {
            startCharacter = 3;
            emptyStartCharacter = null;
         });
         
         it('.needSearch startCharacter, not force', function (){
            assert.equal(SearchMixinUtil.needSearch('text', startCharacter, false), true);
         });
   
         it('.needSearch startCharacter, force', function (){
            assert.equal(SearchMixinUtil.needSearch('text', startCharacter, true), true);
         });
   
         it('.needSearch startCharacter, not force, emptyText', function (){
            assert.equal(SearchMixinUtil.needSearch('', startCharacter, false), false);
         });
   
         it('.needSearch startCharacter, force, emptyText', function (){
            assert.equal(SearchMixinUtil.needSearch('', startCharacter, true), false);
         });
   
         it('.needSearch startCharacter, not force, short text', function (){
            assert.equal(SearchMixinUtil.needSearch('t', startCharacter, false), false);
         });
   
         it('.needSearch startCharacter, force, short text', function (){
            assert.equal(SearchMixinUtil.needSearch('t', startCharacter, true), true);
         });
   
         it('.needSearch empty startCharacter, not force, short text', function (){
            assert.equal(SearchMixinUtil.needSearch('t', emptyStartCharacter, false), false);
         });
   
         it('.needSearch empty startCharacter, force, short text', function (){
            assert.equal(SearchMixinUtil.needSearch('t', emptyStartCharacter, true), true);
         });
         
      });
   
      describe('.needReset', function (){
         var startCharacter, emptyStartCharacter;
      
         before(function() {
            startCharacter = 3;
            emptyStartCharacter = null;
         });
      
         it('.needReset startCharacter, not force', function (){
            assert.equal(SearchMixinUtil.needReset('text', startCharacter, false), true);
         });
      
         it('.needReset startCharacter, force', function (){
            assert.equal(SearchMixinUtil.needReset('text', startCharacter, true), true);
         });
      
         it('.needReset startCharacter, not force, emptyText', function (){
            assert.equal(SearchMixinUtil.needReset('', startCharacter, false), true);
         });
      
         it('.needReset startCharacter, force, emptyText', function (){
            assert.equal(SearchMixinUtil.needReset('', startCharacter, true), true);
         });
      
         it('.needReset startCharacter, not force, short text', function (){
            assert.equal(SearchMixinUtil.needReset('t', startCharacter, false), true);
         });
      
         it('.needReset startCharacter, force, short text', function (){
            assert.equal(SearchMixinUtil.needReset('t', startCharacter, false), true);
         });
   
         it('.needReset empty startCharacter, not force, text', function (){
            assert.equal(SearchMixinUtil.needReset('text', emptyStartCharacter, false), false);
         });
   
         it('.needReset empty startCharacter, force, text', function (){
            assert.equal(SearchMixinUtil.needReset('text', emptyStartCharacter, true), true);
         });
   
         it('.needReset empty startCharacter, not force, emptyText', function (){
            assert.equal(SearchMixinUtil.needReset('', emptyStartCharacter, true), true);
         });
   
         it('.needReset empty startCharacter, not force, emptyText', function (){
            assert.equal(SearchMixinUtil.needReset('', emptyStartCharacter, false), true);
         });
      
      });
   
      describe('.textChangedHandler startCharacter: 3', function () {
         var self = {};
   
         self._onResetIsFired = true;
         self._options = {
            startCharacter: 3
         };
   
         it('.textChangedHandler empty text', function() {
            SearchMixinUtil.textChangedHandler(self, '');
            assert.isTrue(self._onResetIsFired);
         });
   
         it('.textChangedHandler text length is more then startCharacter', function() {
            SearchMixinUtil.textChangedHandler(self, 'test');
            assert.isFalse(self._onResetIsFired);
         });
         
      });
   
      describe('.textChangedHandler startCharacter: null', function () {
         var self = {};
      
         self._onResetIsFired = false;
         self._options = {
            startCharacter: null
         };
      
         it('.textChangedHandler empty text', function() {
            SearchMixinUtil.textChangedHandler(self, '');
            assert.isFalse(self._onResetIsFired);
         });
      
         it('.textChangedHandler text length 4', function() {
            SearchMixinUtil.textChangedHandler(self, 'test');
            assert.isFalse(self._onResetIsFired);
         });
      
      });
      
   });
});