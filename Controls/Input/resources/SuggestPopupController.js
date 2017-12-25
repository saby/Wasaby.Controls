define('js!Controls/Input/resources/SuggestPopupController',
   [
      'Core/core-extend',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'Core/constants',
      'js!Controls/Input/resources/SuggestView/SuggestView'
      
   ],
   function(extend, cMerge, Search, constants) {
      
      'use strict';
      
      var _private = {
         /**
          * Контроллер для запроса за данными
          */
         getSearchController: function(self) {
            if (!self._search) {
               self._search = new Search({
                  dataSource:  self._dataSource,
                  searchDelay: self._searchDelay,
                  navigation: self._navigation
               });
            }
   
            return self._search;
         },
         
         updatePopupSelectedIndex: function(self, selectedIndex) {
            self._popupOptions.componentOptions.selectedIndex = selectedIndex;
            self._popupOpener.open(self._popupOptions);
         }
      };
      
      var SuggestPopupController = extend({
         
         _selectedIndex: -1,
         _searchResult: null,
         
         constructor: function(options) {
            SuggestPopupController.superclass.constructor.call(this, options);
            
            this._popupOpener = options.popupOpener;
            this._dataSource = options.dataSource;
            this._searchDelay = options.searchDelay;
            this._navigation = options.navigation;
            this._selectCallback = options.selectCallback;
         },
         
         search: function(filter, popupOptions) {
            var self = this;
            
            this._selectedIndex = 0;
            _private.getSearchController(self).search({filter: filter}).addCallback(function(searchResult) {
               popupOptions.componentOptions.items = searchResult.result;
               popupOptions.componentOptions.hasMore = searchResult.hasMore;
               popupOptions.componentOptions.selectedIndex = self._selectedIndex;
               
               self._popupOptions = popupOptions;
               self._popupOpener.open(popupOptions);
            });
         },
         
         keyDown: function(event) {
            if (this._popupOpener.isOpened()) {
               switch (event.nativeEvent.which) {
                  case constants.key.up:
                     if (this._selectedIndex > 0) {
                        this._selectedIndex--;
                     }
                     _private.updatePopupSelectedIndex(this, this._selectedIndex);
                     event.preventDefault();
                     break;
                     
                  case constants.key.down:
                     if (this._selectedIndex < this._popupOptions.componentOptions.items.getCount() - 1) {
                        this._selectedIndex++;
                     }
                     _private.updatePopupSelectedIndex(this, this._selectedIndex);
                     event.preventDefault();
                     break;
   
                  case constants.key.enter:
                     this._selectCallback(this._popupOptions.componentOptions.items.at(this._selectedIndex));
                     this._popupOpener.close();
                     break;
               }
            }
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