define('js!Controls/Input/Suggest/PopupSearchController',
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
            this._search = new Search({
               dataSource: options.dataSource,
               searchDelay: options.searchDelay
            });
            this._filter = options.filter;
            this._searchParam = options.searchParam;
            this._popupOpener = options.popupOpener;
            this._popupTarget = options.popupTarget;
            this._popupTemplate = options.popupTemplate;
         },
         
         search: function(textValue) {
            var filter = cMerge({}, this._filter || {}),
                self = this;
            
            filter[this._searchParam] = textValue;
            requirejs([self._popupTemplate]);
            this._search.search({filter: filter}).addCallback(function(searchResult) {
               PapupManager.show(
                  {
                     dialogOptions: {
                        componentOptions: {
                           items: searchResult
                        },
                        template: self._popupTemplate
                     }
                  },
                  self._popupOpener,
                  new StickyStrategy({
                     corner: {
                        vertical: 'bottom',
                        horizontal: 'left'
                     },
                     target: self._popupTarget || self._popupOpener.getContainer()
                  })
               );
            });
         },
         
         abort: function() {
            this._search.abort();
         }
      });
      
      return PopupSearchController;
   }
);