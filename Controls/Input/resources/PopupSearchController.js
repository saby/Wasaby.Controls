define('js!Controls/Input/resources/PopupSearchController',
   [
      'Core/core-extend',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'js!WSControls/Windows/Popup/Popup',
      'js!WSControls/Windows/Strategy/StickyPositioningStrategy'
   ],
   function(extend, cMerge, Search, PapupManager, StickyStrategy) {
      
      'use strict';
      
      function getSearchController() {
         if (!this._search) {
            this._search = new Search({
               dataSource: this._options.dataSource,
               searchDelay: this._options.searchDelay
            });
         }
         
         return this._search;
      }
      
      var PopupSearchController = extend({
         constructor: function(options) {
            this._options = options;
         },
         search: function(textValue) {
            var filter = cMerge({}, this._options.filter || {}),
                self = this;
            
            filter[this._options.searchParam] = textValue;
            requirejs([self._options.popupTemplate]);
            getSearchController.call(this).search({filter: filter}).addCallback(function(searchResult) {
               PapupManager.show(
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
         
         _moduleName: 'Controls/Input/resources/PopupSearchController'
      });
      
      return PopupSearchController;
   }
);