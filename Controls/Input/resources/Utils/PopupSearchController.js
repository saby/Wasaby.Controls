define('js!Controls/Input/resources/Utils/PopupSearchController',
   [
      'Core/core-extend',
      'Core/core-merge',
      'js!Controls/List/resources/utils/Search',
      'js!WSControls/Windows/PopupManager',
      'js!WSControls/Windows/Strategy/StickyPositioningStrategy'
   ],
   function(extend, cMerge, Search, PapupManager, StickyStrategy) {
      
      'use strict';
      
      var PopupSearchController = extend({
         constructor: function(options) {
            this._options = options;
         },
         search: function(textValue) {
            var filter = cMerge({}, this._options.filter || {}),
                self = this;
            
            if (!this._search) {
               this._search = new Search({
                  dataSource: this._options.dataSource,
                  searchDelay: this._options.searchDelay
               });
            }
            
            filter[this._options.searchParam] = textValue;
            requirejs([self._options.popupTemplate]);
            this._search.search({filter: filter}).addCallback(function(searchResult) {
               PapupManager.show(
                  {
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
         }
      });
      
      return PopupSearchController;
   }
);