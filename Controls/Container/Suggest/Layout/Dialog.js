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
         _resizeTimeout: null,

         _getChildContext: function() {
            return {
               searchLayoutField: new SearchContextField(null),
               filterLayoutField: new FilterContextField({filter: this._options.filter})
            };
         },
         
         _afterMount: function() {
            /* Костыль до 400. В 400 сделано распростронение resize */
            var self = this;
            self._resizeTimeout = setTimeout(function() {
               self._children.scroll._children.scrollLayout._resizeHandler();
            });
         },
         
         _beforeUnmount: function() {
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = null;
         },
   
         _itemClick: function(event, item) {
            this._notify('sendResult', [item]);
            this._notify('close', []);
         }
         
      });
      
      return List;
   });

