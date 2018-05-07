define('Controls/Layout/Suggest/Dialog',
   [
      'Core/Control',
      'tmpl!Controls/Layout/Suggest/Dialog',
      'Controls/Container/Search/SearchContextField',
      'css!Controls/Layout/Suggest/Dialog',
      'Controls/Container/Scroll',
      'Controls/Popup/Templates/Dialog/DialogTemplate'
   ],
   
   function(Control, template, SearchContextField) {
      
      /**
       * Dialog for list in Suggest component.
       * @class Controls/Container/Suggest/List
       * @extends Controls/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var List = Control.extend({
         
         _template: template,
         
         _getChildContext: function() {
            return {
               searchLayoutField: new SearchContextField(this._options.searchValue)
            };
         },
   
         _itemClick: function(event, item) {
            this._notify('sendResult', [item]);
            this._notify('close', []);
         }
         
      });
      
      return List;
   });

