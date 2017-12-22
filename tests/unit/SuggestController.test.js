/**
 * Created by am.gerasimov on 28.11.2017.
 */
/**
 * Created by am.gerasimov on 28.11.2017.
 */
define(
   [
      'js!Controls/Input/resources/SuggestController',
      'Core/core-instance',
      'Core/Abstract'
   ],
   function(SuggestController, cInstance, Abstract) {
      'use strict';
      if (typeof mocha !== 'undefined') {
         //Из-за того, что загрузка через Core/moduleStubs добавляет в global Deprecated/Controls/LoadingIndicator/LoadingIndicator,
         //чтобы потом брать его из кэша
         mocha.setup({globals: ['Controls/Input/resources/SuggestPopupController']});
      }
      
      function getTestAbstract() {
         var testAbstract = new Abstract({_options: {}});
         testAbstract._options = {};
         return testAbstract;
      }
      
      describe('Controls.Input.SuggestController', function () {
   
         it('.search', function(done) {
            var selfTest = getTestAbstract(),
                result = false;
   
            //Заглушка для тестирования
            selfTest._options.textComponent = {
               getContainer: function () {
                  return [{
                     offsetWidth: 0
                  }];
               }
            };
            
            SuggestController._private.getSearchController(selfTest).addCallback(function(controller) {
               controller.search = function() {result = true};
               SuggestController._private.search(selfTest);
   
               SuggestController._private.getSearchController(selfTest).addCallback(function() {
                  assert.isTrue(result);
                  done();
               });
            });
         });
   
         it('.getSearchController', function(done) {
            var selfTest = getTestAbstract();
            SuggestController._private.getSearchController(selfTest).addCallback(function(controller) {
               assert.isTrue(cInstance.instanceOfModule(controller, 'js!Controls/Input/resources/SuggestPopupController'));
               assert.isTrue(cInstance.instanceOfModule(selfTest._suggestPopupController, 'js!Controls/Input/resources/SuggestPopupController'));
               done();
            });
         });
         
         it('.abortSearch', function(done) {
            var selfTest = getTestAbstract(),
                result = false;
            
            SuggestController._private.getSearchController(selfTest).addCallback(function(controller) {
               controller.abort = function() {result = true};
               SuggestController._private.abortSearch(selfTest);
               
               SuggestController._private.getSearchController(selfTest).addCallback(function() {
                  assert.isTrue(result);
                  done();
               });
            });
         });
   
         it('.onChangeValueHandler', function(done) {
            var selfTest = getTestAbstract(),
               searchResult = false,
               abortResult = false;
   
            selfTest._options = {};
            selfTest._options.minSearchLength = 3;
            //Заглушка для тестирования
            selfTest._options.textComponent = {
               getContainer: function () {
                  return [{
                     offsetWidth: 0
                  }];
               }
            };
   
            SuggestController._private.getSearchController(selfTest).addCallback(function(controller) {
               controller.abort = function() {abortResult = true};
               controller.search = function() {searchResult = true;};
               
               SuggestController._private.onChangeValueHandler(selfTest, '');
               SuggestController._private.getSearchController(selfTest).addCallback(function() {
                  assert.isFalse(searchResult);
                  assert.isTrue(abortResult);
      
                  SuggestController._private.onChangeValueHandler(selfTest, 'te');
                  SuggestController._private.getSearchController(selfTest).addCallback(function() {
                     assert.isFalse(searchResult);
                     assert.isTrue(abortResult);
   
                     SuggestController._private.onChangeValueHandler(selfTest, 'test');
                     SuggestController._private.getSearchController(selfTest).addCallback(function() {
                        assert.isTrue(searchResult);
   
                        done();
                     });
                  });
               });
            });
         });
         
      });
      
   }
);