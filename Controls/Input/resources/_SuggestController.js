define('js!Controls/Input/resources/_SuggestController',
   [
      'Core/Deferred'
   ], function (Deferred) {
      
      function getSearchController() {
         var self = this;
         
         if (this._searchController) {
            return Deferred.success(this._searchController);
         }
         
         if (this._loadSearchControllerDeferred) {
            return this._loadSearchControllerDeferred;
         }
         
         this._loadSearchControllerDeferred = new Deferred();
         
         requirejs(['js!Controls/Input/resources/PopupSearchController'], function (controller) {
            self._loadSearchControllerDeferred.callback(self._searchController = new controller({
               dataSource: self._options.dataSource,
               searchParam: self._options.searchParam,
               searchDelay: self._options.searchDelay,
               filter: self._options.filter,
               popupTemplate: self._options.suggestTemplate,
               popupOpener: self._options.textComponent
            }));
         });
         
         return this._loadSearchControllerDeferred;
      }
      
      function search(textValue) {
         getSearchController.call(this).addCallback(function(searchController) {
            searchController.search(textValue);
            return searchController;
         });
      }
      
      function abortSearch() {
         getSearchController.call(this).addCallback(function (searchController) {
            searchController.abort();
            return searchController;
         });
      }
      
      function onChangeValueHandler(event, text) {
         if (text.length >= this._options.minSearchLength) {
            search.call(this, text)
         } else {
            abortSearch.call(this);
         }
      }
      
      return {
         search: search,
         onChangeValueHandler: onChangeValueHandler,
         abort: abortSearch,
         getSearchController: getSearchController
      };
   });