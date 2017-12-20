define('js!Controls/Input/resources/SuggestPopupController',
   [
      'Core/Abstract',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'js!Controls/Popup/Opener/Sticky',
      'js!Controls/Input/resources/SuggestView'
      
   ],
   function(Abstract, cMerge, Search, StickyOpener) {
      
      'use strict';
      
      var _private = {
         /**
          * Контроллер для запроса за данными
          */
         getSearchController: function(self) {
            if (!self._search) {
               self._search = new Search({
                  dataSource: self._options.dataSource,
                  searchDelay: self._options.searchDelay
               });
            }
   
            return self._search;
         },
         
         getPopupOpener: function(self) {
            if (!self._suggestOpener) {
               self._suggestOpener = new StickyOpener();
               self._suggestOpener.subscribe('onResult', function(event, result) {
                  self._notify('onSelect', result);
               });
            }
            
            return self._suggestOpener;
         },
         
         showPopup: function(self, options) {
            if (!self._suggestOpener) {
               self._suggestOpener = new StickyOpener();
               self._suggestOpener.subscribe('onResult', function(event, result) {
                  self._notify('onSelect', result);
               });
            }
            self._suggestOpener.open(options);
         }
      };
      
      var SuggestPopupController = Abstract.extend({
         
         constructor: function(options) {
            SuggestPopupController.superclass.constructor.call(this, options);
            this._options = options;
         },
         
         search: function(filter, popupOptions) {
            var self = this;
            
            _private.getSearchController(self).search({filter: filter}).addCallback(function(searchResult) {
               if (!popupOptions.componentOptions) {
                  popupOptions.componentOptions = {};
               }
               popupOptions.componentOptions.items = searchResult;
               _private.getPopupOpener(self).open(popupOptions);
            });
         },
         
         abort: function() {
            _private.getSearchController(this).abort();
         },
   
         _moduleName: 'Controls/Input/resources/SuggestPopupController'
      });
   
      /** For tests **/
      SuggestPopupController._private = _private;
      
      return SuggestPopupController;
   }
);