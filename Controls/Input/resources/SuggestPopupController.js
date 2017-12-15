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
         
         showPopup: function(self, options) {
            if (!self._suggestOpener) {
               self._suggestOpener = new StickyOpener();
               self._suggestOpener.saveOptions({
               popupOptions: {
                  target: self._options.popupOpener.getContainer(),
                  autoHide: true,
                  template: 'js!Controls/Input/resources/SuggestView',
                  corner: {
                     vertical: 'bottom'
                  },
                  verticalAlign: {
                     side: 'top'
                  }
               }});
               self._suggestOpener.subscribe('onResult', function(event, result) {
                  self._notify('onSelect', result);
               })
            }
            self._suggestOpener.open(options, self._options.popupOpener);
         }
      };
      
      var SuggestPopupController = Abstract.extend({
         constructor: function(options) {
            SuggestPopupController.superclass.constructor.call(this, options);
            this._options = options;
         },
         search: function(textValue) {
            var filter = cMerge({}, this._options.filter || {}),
                self = this;
            
            filter[this._options.searchParam] = textValue;
            _private.getSearchController(self).search({filter: filter}).addCallback(function(searchResult) {
               _private.showPopup(self, {
                  componentOptions: {
                     items: searchResult,
                     template: self._options.popupTemplate,
                     width: self._options.popupOpener.getContainer()[0].offsetWidth
                  }
               });
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