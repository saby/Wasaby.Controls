/**
 * Created by am.gerasimov on 28.11.2017.
 */
/**
 * Created by am.gerasimov on 28.11.2017.
 */
define(
   [
      'Controls/Input/resources/SuggestController',
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
   
         it('.destroy', function() {
            var selfTest = getTestAbstract(),
                isAborted = false;
            
            selfTest._suggestPopupController = {
               abort: function(){
                  isAborted = true;
               }
            };
            
            SuggestController._private.destroy(selfTest);
            
            assert.isTrue(isAborted, 'search query is not aborted');
            assert.equal(selfTest._suggestPopupController, null, 'suggestPopupController is not destroyed');
         });
         
         it('.search', function(done) {
            var selfTest = getTestAbstract(),
                result = false;
   
            //Заглушка для тестирования
            selfTest._options.textComponent = {
               _container: {offsetWidth: 0}
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
               assert.isTrue(cInstance.instanceOfModule(controller, 'Controls/Input/resources/SuggestPopupController'));
               assert.isTrue(cInstance.instanceOfModule(selfTest._suggestPopupController, 'Controls/Input/resources/SuggestPopupController'));
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
         
         it('.getSearchFilter', function() {
            var selfTest = getTestAbstract();
            selfTest._options.searchParam = 'test';
            assert.deepEqual(SuggestController._private.getSearchFilter(selfTest, 'testText'), {test: 'testText'});
         });
   
         it('.getPopupOptions', function() {
            var selfTest = getTestAbstract();
            selfTest._options.textComponent = {
               _container: {offsetWidth: 0}
            };
            assert.equal(SuggestController._private.getPopupOptions(selfTest).componentOptions.width, 0);
         });
   
         it('.onChangeValueHandler', function(done) {
            var selfTest = getTestAbstract(),
               searchResult = false,
               abortResult = false;
   
            selfTest._options = {};
            selfTest._options.minSearchLength = 3;
            //Заглушка для тестирования
            selfTest._options.textComponent = {
               _container: {offsetWidth: 0}
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
   
         it('.searchStart', function() {
            var selfTest = getTestAbstract(),
                searching = false;
      
            selfTest._options = {};
   
            SuggestController._private.searchStart(selfTest);
            assert.isFalse(searching);
            
            selfTest._options.searchStartCallback = function(){searching = true};
            SuggestController._private.searchStart(selfTest);
            assert.isTrue(searching);
         });
   
         it('.searchEnd', function() {
            var selfTest = getTestAbstract(),
               searching = true;
   
            selfTest._options = {};
   
            SuggestController._private.searchEnd(selfTest);
            assert.isTrue(searching);
   
            selfTest._options.searchEndCallback = function(){searching = false};
            SuggestController._private.searchEnd(selfTest);
            assert.isFalse(searching);
         });
         
      });
      
   }
);