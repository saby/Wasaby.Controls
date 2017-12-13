define('js!Controls/Input/resources/SuggestPopupController',
   [
      'Core/core-extend',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'Controls/Popup/Manager',
      'Controls/Popup/Opener/Sticky/Strategy'
   ],
   function(extend, cMerge, Search, PopupManager, StickyStrategy) {
      
      'use strict';
      
      var _private = {
         getSearchController: function(self) {
            if (!self._search) {
               self._search = new Search({
                  dataSource: self._options.dataSource,
                  searchDelay: self._options.searchDelay
               });
            }
   
            return self._search;
         }
      };
      
      var SuggestPopupController = extend({
         constructor: function(options) {
            this._options = options;
         },
         search: function(textValue) {
            var filter = cMerge({}, this._options.filter || {}),
                self = this;
            
            filter[this._options.searchParam] = textValue;
            requirejs([self._options.popupTemplate]);
            _private.getSearchController(this).search({filter: filter}).addCallback(function(searchResult) {
               //TODO Жду правок от Лощинина, чтобы доделать выбор из попапа и отображение
               PopupManager.show(
                  {
                     catchFocus: false,
                     dialogOptions: {
                        componentOptions: {
                           items: searchResult
                        },
                        template: self._options.popupTemplate
                     }
                  },
                  self._popupOpener,
                  new StickyStrategy({
                     corner: {
                        vertical: 'bottom',
                        horizontal: 'left'
                     },
                     target: self._options.popupOpener.getContainer()
                  })
               );
            });
         },
         
         abort: function() {
            if (this._search) {
               this._search.abort();
            }
         },
         
         _moduleName: 'Controls/Input/resources/SuggestPopupController'
      });
   
      /** For tests **/
      SuggestPopupController._private = _private;
      
      return SuggestPopupController;
   }
);