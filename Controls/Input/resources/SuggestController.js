/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('js!Controls/Input/resources/SuggestController',
   [
      'Core/Abstract',
      'Core/moduleStubs',
      'Core/core-clone'
   ], function (Abstract, moduleStubs, cClone) {
   
   'use strict';
   
   var _private = {
      searchStart: function(self) {
         if (self._options.searchStartCallback) {
            self._options.searchStartCallback();
         }
      },
      
      searchEnd: function(self) {
         if (self._options.searchEndCallback) {
            self._options.searchEndCallback();
         }
      },
      /**
       * Search and show popup
       * @param self
       * @param {Object} fitler
       */
      search: function(self, fitler) {
         _private.searchStart(self);
         _private.getSearchController(self).addCallback(function(searchController) {
            searchController.search(fitler, _private.getPopupOptions(self)).addBoth(function(res) {
               _private.searchEnd(self);
               return res;
            });
            return searchController;
         });
      },
   
      /**
       * Abort search
       * @param self
       */
      abortSearch: function(self) {
         _private.getSearchController(self).addCallback(function (searchController) {
            searchController.abort();
            _private.searchEnd(self);
            return searchController;
         });
      },
      
      getSearchFilter: function(self, textValue) {
         var filter = cClone(self._options.filter || {});
         filter[self._options.searchParam] = textValue;
         return filter;
      },
      
   
      onChangeValueHandler: function(self, text) {
         self._value = text;
         if (text.length >= self._options.minSearchLength) {
            _private.search(self, _private.getSearchFilter(self, text));
         } else {
            _private.abortSearch(self);
         }
      },
      
      getPopupOptions: function(self) {
         var container = self._options.textComponent._container;
         return {
            target: container,
            componentOptions: {
               width: container.offsetWidth,
               template: self._options.suggestTemplate,
               dataSource: self._options.dataSource,
               showAllOpener: self._options.showAllOpener,
               filter: _private.getSearchFilter(self, self._value)
            }
         };
      },
   
      getSearchController: function(self) {
         /* loading SuggestPopupController and preloading suggest template */
         return moduleStubs.require(['js!Controls/Input/resources/SuggestPopupController', self._options.suggestTemplate]).addCallback(function(result) {
            if (!self._suggestPopupController) {
               self._suggestPopupController = new result[0]({
                  dataSource: self._options.dataSource,
                  searchDelay: self._options.searchDelay,
                  popupOpener: self._options.suggestOpener,
                  navigation: self._options.navigation,
                  selectCallback: self._options.selectCallback,
                  searchParam: self._options.searchParam
               });
            }
            return self._suggestPopupController;
         });
      },
      
      destroy: function(self) {
         if (self._suggestPopupController) {
            self._suggestPopupController.abort();
            self._suggestPopupController = null;
         }
      }
   };
   
   var SuggestController = Abstract.extend({
      
      constructor: function(options) {
         SuggestController.superclass.constructor.call(this, options);
         this._options = options;
      },
      
      setValue: function(value) {
         _private.onChangeValueHandler(this, value);
      },
      
      keyDown: function(event) {
         if (this._suggestPopupController) {
            this._suggestPopupController.keyDown(event);
         }
      },
      
      destroy: function() {
         _private.destroy(this);
         SuggestController.superclass.destroy.call(this);
      },
   
      _moduleName: 'Controls/Input/resources/SuggestController'
   });
   
   /** For test **/
   SuggestController._private = _private;
   
   return SuggestController;
   
});