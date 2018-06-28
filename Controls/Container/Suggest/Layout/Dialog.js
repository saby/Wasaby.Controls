define('Controls/Container/Suggest/Layout/Dialog',
   [
      'Core/Control',
      'tmpl!Controls/Container/Suggest/Layout/Dialog',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'css!Controls/Container/Suggest/Layout/Dialog',
      'Controls/Container/Scroll',
      'Controls/Popup/Templates/Dialog/DialogTemplate'
   ],
   
   function(Control, template, SearchContextField, FilterContextField) {
      
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
               searchLayoutField: new SearchContextField(null),
               filterLayoutField: new FilterContextField({filter: this._options.filter})
            };
         },
   
         _itemClick: function(event, item) {
            this._notify('sendResult', [item]);
            this._notify('close', []);
         }
         
      });
      
      return List;
   });

