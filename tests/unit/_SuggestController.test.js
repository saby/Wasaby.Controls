/**
 * Created by am.gerasimov on 28.11.2017.
 */
/**
 * Created by am.gerasimov on 28.11.2017.
 */
define(
   [
      'js!Controls/Input/resources/_SuggestController',
      'Core/core-instance'
   ],
   function(_SuggestController, cInstance) {
      'use strict';
      
      describe('Controls.Input._SuggestController', function () {
   
         it('.search', function(done) {
            var self = {},
                result = false;
            
            self._options = {};
            _SuggestController.getSearchController.call(self).addCallback(function(controller) {
               controller.search = function() {result = true};
               _SuggestController.search.call(self);
               assert.isTrue(result);
               done();
            });
         });
   
         it('.getSearchController', function(done) {
            var self = {};
            self._options = {};
            _SuggestController.getSearchController.call(self).addCallback(function(controller) {
               assert.isTrue(cInstance.instanceOfModule(controller, 'js!Controls/Input/resources/PopupSearchController'));
               assert.isTrue(cInstance.instanceOfModule(self._searchController, 'js!Controls/Input/resources/PopupSearchController'));
               done();
            });
         });
   
         it('.abortSearch', function(done) {
            var self = {},
               result = false;
      
            self._options = {};
            _SuggestController.getSearchController.call(self).addCallback(function(controller) {
               controller.abort = function() {result = true};
               _SuggestController.abort.call(self);
               assert.isTrue(result);
               done();
            });
         });
   
         it('.onChangeValueHandler', function(done) {
            var self = {},
               searchResult = false,
               abortResult = false;
      
            self._options = {};
            self._options.minSearchLength = 3;
            
            _SuggestController.getSearchController.call(self).addCallback(function(controller) {
               controller.abort = function() {abortResult = true};
               controller.search = function() {searchResult = true;};
               
               _SuggestController.onChangeValueHandler.call(self, null, '');
               
               assert.isFalse(searchResult);
               assert.isTrue(abortResult);
   
               _SuggestController.onChangeValueHandler.call(self, null, 'te');
   
               assert.isFalse(searchResult);
               assert.isTrue(abortResult);
   
               _SuggestController.onChangeValueHandler.call(self, null, 'test');
   
               assert.isTrue(searchResult);
               done();
            });
         });
         
      });
      
   }
);