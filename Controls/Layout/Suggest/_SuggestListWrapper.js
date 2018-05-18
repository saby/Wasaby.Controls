define('Controls/Layout/Suggest/_SuggestListWrapper',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Suggest/_SuggestListWrapper',
      'Controls/Layout/Suggest/_SuggestOptionsField',
      'Controls/Container/Async'
   ],
   
   function(Control, template, _SuggestOptionsField) {
      
      'use strict';
      
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

