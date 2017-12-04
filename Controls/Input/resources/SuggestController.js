/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('js!Controls/Input/resources/SuggestController',
   [
      'Core/Abstract',
      'Core/Deferred'
   ], function (Abstract, Deferred) {
   
   var _private = {
      search: function(self, textValue) {
         _private.getSearchController(self).addCallback(function(searchController) {
            searchController.search(textValue);
            return searchController;
         });
      },
   
      abortSearch: function(self) {
         _private.getSearchController(self).addCallback(function (searchController) {
            searchController.abort();
            return searchController;
         });
      },
   
      onChangeValueHandler: function(self, event, text) {
         if (text.length >= self._options.minSearchLength) {
            _private.search(self, text)
         } else {
            _private.abortSearch(self);
         }
      },
   
      getSearchController: function(self) {
         if (self._searchController) {
            return Deferred.success(self._searchController);
         }
      
         if (self._loadSearchControllerDeferred) {
            return self._loadSearchControllerDeferred;
         }
   
         self._loadSearchControllerDeferred = new Deferred();
      
         requirejs(['js!Controls/Input/resources/PopupSearchController'], function (controller) {
            self._loadSearchControllerDeferred.callback(self._searchController = new controller({
               dataSource: self._options.dataSource,
               searchParam: self._options.searchParam,
               searchDelay: self._options.searchDelay,
               filter: self._options.filter,
               popupTemplate: self._options.suggestTemplate,
               popupOpener: self._options.textComponent
            }));
         
            self.once('onDestroy', function() {
               self._searchController.destroy();
               self._searchController = null;
            });
         });
      
         return self._loadSearchControllerDeferred;
      }
   };
   
   var SuggestController = Abstract.extend({
      constructor: function(options) {
         SuggestController.superclass.constructor.call(this, options);
         this._options = options;
         this.subscribeTo(options.textComponent, 'onChangeValue', _private.onChangeValueHandler.bind(this, this));
      }
   });
   
   /** For test **/
   SuggestController._private = _private;
   
   return SuggestController;
   
});