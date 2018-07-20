/**
 * Created by am.gerasimov on 22.03.2018.
 */
define('Controls/Filter/Fast/Container',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Fast/Container',
      'Controls/Container/Filter/FilterContextField',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, isEqual) {
      
      /**
       * Container component for FastFilter
       * Receives props from context and pass to FastFilter.
       * Should be located inside Controls/Container/Filter.
       * @class Controls/Container/Filter/Fast
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var FilterComponents = Control.extend({
         
         _template: template,
         
         _beforeUpdate: function(options, context) {
            //context from Filter layout
            var filterItems = context.filterLayoutField.fastFilterItems;
            if (!isEqual(this.context.get('filterLayoutField').fastFilterItems, filterItems)) {
               this._items = filterItems;
            }
         },
         
         _beforeMount: function(options, context) {
            if (context.filterLayoutField.fastFilterItems) {
               this._items = context.filterLayoutField.fastFilterItems;
            }
         },
         
         _filterChanged: function() {
            this._notify('filterItemsChanged', [this._items], {bubbling: true});
         }
      });
      
      FilterComponents.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      return FilterComponents;
   });
