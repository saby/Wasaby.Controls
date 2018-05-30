/**
 * Created by am.gerasimov on 22.03.2018.
 */
define('Controls/Container/Filter/Button',
   [
      'Core/Control',
      'tmpl!Controls/Container/Filter/Button/Button',
      'Controls/Container/Filter/FilterContextField',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, isEqual) {
      
      /**
       * Container component for FilterButton
       * Receives props from context and pass to FilterButton.
       * Should be located inside Controls/Container/Filter.
       * @class Controls/Container/Filter/Button
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
      
      var FilterButton = Control.extend({
         
         _template: template,
   
         _beforeUpdate: function(options, context) {
            //context from Filter layout
            var filterItems = context.filterLayoutField.filterButtonItems;
            if (!isEqual(this.context.get('filterLayoutField').filterButtonItems, filterItems)) {
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
            this._notify('itemsChanged', [items], {bubbling: true});
         }
      });
   
      FilterButton.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      return FilterButton;
   });
