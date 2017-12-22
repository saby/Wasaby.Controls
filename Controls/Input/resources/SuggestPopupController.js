define('js!Controls/Input/resources/SuggestPopupController',
   [
      'Core/Abstract',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'js!Controls/Input/resources/SuggestView'
      
   ],
   function(Abstract, cMerge, Search) {
      
      'use strict';
      
      var _private = {
         /**
          * Контроллер для запроса за данными
          */
         getSearchController: function(self) {
            if (!self._search) {
               self._search = new Search({
                  dataSource:  self._dataSource,
                  searchDelay: self._searchDelay
               });
            }
   
            return self._search;
         }
      };
      
      var SuggestPopupController = Abstract.extend({
         
         _selectedIndex: 0,
         
         constructor: function(options) {
            SuggestPopupController.superclass.constructor.call(this, options);
            
            this._popupOpener = options.popupOpener;
            this._dataSource = options.dataSource;
            this._searchDelay = options.searchDelay;
         },
   
         increaseSelectedIndex: function() {
            if (this._popupOpener.isOpened()) {
               this._selectedIndex++;
            }
         },
   
         decreaseSelectedIndex: function() {
            if (this._popupOpener.isOpened()) {
               this._selectedIndex--;
            }
         },
         
         search: function(filter, popupOptions) {
            var self = this;
            
            _private.getSearchController(self).search({filter: filter}).addCallback(function(searchResult) {
               if (!popupOptions.componentOptions) {
                  popupOptions.componentOptions = {};
               }
               popupOptions.componentOptions.items = searchResult;
               self._popupOpener.open(popupOptions);
            });
         },
         
         abort: function() {
            _private.getSearchController(this).abort();
            this._popupOpener.close();
         },
   
         _moduleName: 'Controls/Input/resources/SuggestPopupController'
      });
   
      /** For tests **/
      SuggestPopupController._private = _private;
      
      return SuggestPopupController;
   }
);