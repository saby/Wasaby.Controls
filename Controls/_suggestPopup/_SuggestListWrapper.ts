define('Controls/Container/Suggest/Layout/_SuggestListWrapper',
   [
      'Core/Control',
      'wml!Controls/Container/Suggest/Layout/_SuggestListWrapper',
      'Controls/Container/Suggest/Layout/_SuggestOptionsField',
      'Controls/Container/Async'
   ],
   
   function(Control, template, _SuggestOptionsField) {
      
      'use strict';
   
      /**
       * Proxy container for suggest options.
       *
       * @class Controls/Container/Suggest/Layout/_SuggestListWrapper
       * @extends Core/Control
       * @control
       */
   
      return Control.extend({
         
         _template: template,
         
         _getChildContext: function() {
            return {
               suggestOptionsField: new _SuggestOptionsField(this._options)
            };
         },
   
         _tabsSelectedKeyChanged: function(event, key) {
            this._notify('tabsSelectedKeyChanged', [key]);
         }
      });
      
   });

