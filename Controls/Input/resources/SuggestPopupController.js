define('js!Controls/Input/resources/SuggestPopupController',
   [
      'Core/core-extend',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'Core/constants',
      'Core/core-clone',
      'js!Controls/Input/resources/SuggestView/SuggestView'
      
   ],
   function(extend, cMerge, Search, constants, clone) {
      
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
         
         showPopup: function(self, searchResult, popupOptions) {
            popupOptions = clone(popupOptions);
            popupOptions.componentOptions.items = searchResult.result;
            popupOptions.componentOptions.hasMore = searchResult.hasMore;
            
            self._popupOptions = popupOptions;
            self._popupOpener.open(popupOptions);
         },
         
         updatePopupSelectedIndex: function(self, selectedIndex) {
            self._popupOptions.componentOptions.selectedIndex = selectedIndex;
            self._popupOpener.open(self._popupOptions);
         },
   
         decreaseSelectedIndex: function(self) {
            if (self._selectedIndex > 0) {
               self._selectedIndex--;
            }
            _private.updatePopupSelectedIndex(self, self._selectedIndex);
         },
         
         increaseSelectedIndex: function(self) {
            if (self._selectedIndex < self._popupOptions.componentOptions.items.getCount() - 1) {
               self._selectedIndex++;
            }
            _private.updatePopupSelectedIndex(self, self._selectedIndex);
         }
   
   
      };
      
      var SuggestPopupController = extend({
         
         _selectedIndex: 0,
         
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
            _private.getSearchController(self).search({filter: filter}).addCallback(function(searchResult) {
               _private.showPopup(self, searchResult, popupOptions);
            });
         },
         
         keyDown: function(event) {
            if (this._popupOpener.isOpened()) {
               switch (event.nativeEvent.which) {
                  case constants.key.up:
                     _private.decreaseSelectedIndex(this);
                     event.preventDefault();
                     break;
                     
                  case constants.key.down:
                     _private.increaseSelectedIndex(this);
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