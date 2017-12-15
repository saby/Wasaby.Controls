/**
 * Created by am.gerasimov on 28.11.2017.
 */
/**
 * Created by am.gerasimov on 28.11.2017.
 */
define(
   [
      'js!Controls/Input/resources/SuggestController',
      'Core/core-instance'
   ],
   function(SuggestController, cInstance) {
      'use strict';
      if (typeof mocha !== 'undefined') {
         //Из-за того, что загрузка через Core/moduleStubs добавляет в global Deprecated/Controls/LoadingIndicator/LoadingIndicator,
         //чтобы потом брать его из кэша
         mocha.setup({globals: ['Controls/Input/resources/SuggestPopupController']});
      }
      describe('Controls.Input.SuggestController', function () {
   
         it('.search', function(done) {
            var self = {},
                result = false;
            
            self._options = {};
            SuggestController._private.getSearchController(self).addCallback(function(controller) {
               controller.search = function() {result = true};
               SuggestController._private.search(self);
               assert.isTrue(result);
               done();
            });
         });
   
         it('.getSearchController', function(done) {
            var self = {};
            self._options = {};
            SuggestController._private.getSearchController(self).addCallback(function(controller) {
               assert.isTrue(cInstance.instanceOfModule(controller, 'js!Controls/Input/resources/SuggestPopupController'));
               assert.isTrue(cInstance.instanceOfModule(self._searchController, 'js!Controls/Input/resources/SuggestPopupController'));
               done();
            });
         });
   
         it('.abortSearch', function(done) {
            var self = {},
               result = false;
      
            self._options = {};
            self.once = function() {};
            SuggestController._private.getSearchController(self).addCallback(function(controller) {
               controller.abort = function() {result = true};
               SuggestController._private.abortSearch(self);
               assert.isTrue(result);
               done();
            });
         });
   
         it('.onChangeValueHandler', function(done) {
            var self = {},
               searchResult = false,
               abortResult = false;
      
            self.once = function() {};
            self._options = {};
            self._options.minSearchLength = 3;
   
            SuggestController._private.getSearchController(self).addCallback(function(controller) {
               controller.abort = function() {abortResult = true};
               controller.search = function() {searchResult = true;};
   
               SuggestController._private.onChangeValueHandler(self, null, '');
               
               assert.isFalse(searchResult);
               assert.isTrue(abortResult);
   
               SuggestController._private.onChangeValueHandler(self, null, 'te');
   
               assert.isFalse(searchResult);
               assert.isTrue(abortResult);
   
               SuggestController._private.onChangeValueHandler(self, null, 'test');
   
               assert.isTrue(searchResult);
               done();
            });
         });
         
      });
      
   }
);