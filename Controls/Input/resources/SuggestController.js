/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('js!Controls/Input/resources/SuggestController',
   [
      'Core/Abstract',
      'Core/moduleStubs'
   ], function (Abstract, moduleStubs) {
   
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
         return moduleStubs.require(['js!Controls/Input/resources/SuggestPopupController', self._options.suggestTemplate]).addCallback(function(result) {
            if (!self._searchController) {
               self._searchController = new result[0]({
                  dataSource: self._options.dataSource,
                  searchParam: self._options.searchParam,
                  searchDelay: self._options.searchDelay,
                  filter: self._options.filter,
                  popupTemplate: self._options.suggestTemplate,
                  popupOpener: self._options.textComponent,
                  displayProperty: self._options.displayProperty
               });
               
               //Надо подписаться, т.к. событие от контроллера не всплывает.
               self.subscribeTo(self._searchController, 'onSelect', function(event, result) {
                  self._notify('onSelect', result);
               });
   
               self.once('onDestroy', function() {
                  self._searchController.destroy();
                  self._searchController = null;
               });
            }
            return self._searchController;
         });
      }
   };
   
   var SuggestController = Abstract.extend({
      constructor: function(options) {
         SuggestController.superclass.constructor.call(this, options);
         this._options = options;
         this.subscribeTo(options.textComponent, 'onChangeValue', _private.onChangeValueHandler.bind(this, this));
      },
   
      _moduleName: 'Controls/Input/resources/SuggestController'
   });
   
   /** For test **/
   SuggestController._private = _private;
   
   return SuggestController;
   
});