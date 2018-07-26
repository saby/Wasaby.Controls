define('Controls/Filter/Button/Container',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Container',
      'Controls/Container/Filter/FilterContextField',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, isEqual) {
      
      /**
       * Container component for FilterButton
       * Receives props from context and pass to FilterButton.
       * Should be located inside Controls/Filter/Container.
       * @class Controls/Filter/Button/Container
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
   
      var _private = {
         updateHistoryId: function(self, context) {
            if (context.filterLayoutField.historyId) {
               self._historyId = context.filterLayoutField.historyId;
            }
         }
      };
      
      var Container = Control.extend({
         
         _template: template,
   
         _beforeUpdate: function(options, context) {
            //context from Filter layout
            var filterItems = context.filterLayoutField.filterButtonItems;
            if (!isEqual(this._items, filterItems)) {
               this._items = filterItems;
            }
            _private.updateHistoryId(this, context);
         },
   
         _beforeMount: function(options, context) {
            if (context.filterLayoutField.filterButtonItems) {
               this._items = context.filterLayoutField.filterButtonItems;
            }
            _private.updateHistoryId(this, context);
         },
   
         _itemsChanged: function(event, items) {
            this._items = items;
            this._notify('filterItemsChanged', [items], {bubbling: true});
         }
      });
   
   
      Container.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      
      return Container;
   });
