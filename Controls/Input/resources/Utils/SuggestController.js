/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('js!Controls/Input/resources/Utils/SuggestController',
   [
      'Core/Abstract',
      'Core/moduleStubs'
   ], function (Abstract, moduleStubs) {
   
   function getSearchController() {
      var self = this;
      return moduleStubs.require('js!Controls/Input/resources/Utils/PopupSearchController').addCallback(function(res) {
         if (!self._searchController) {
            self._searchController = new res[0]({
               dataSource: self._options.dataSource,
               searchParam: self._options.searchParam,
               searchDelay: self._options.searchDelay,
               filter: self._options.filter,
               popupTemplate: self._options.suggestTemplate,
               popupOpener: self._options.textComponent
            });
         }
         return self._searchController;
      });
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
   
   var SuggestController = Abstract.extend({
      constructor: function(options) {
         SuggestController.superclass.constructor.call(this, options);
         this._options = options;
         this.subscribeTo(options.textComponent, 'onChangeValue', onChangeValueHandler.bind(this));
      },
      
      destroy: function() {
         SuggestController.superclass.destroy.call(this, arguments);
         if (this._searchController) {
            this._searchController.destroy();
            this._searchController = null;
         }
         this._options = null;
      }
   });
   
   return SuggestController;
   
});