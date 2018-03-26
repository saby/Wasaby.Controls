/**
 * Created by am.gerasimov on 22.03.2018.
 */
define('Controls/Layout/FilterButton',
   [
      'Core/Control',
      'tmpl!Controls/Layout/FilterButton/FilterButton',
      'Controls/Layout/Filter/FilterContextField',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, FilterContextField, isEqual) {
      
      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var FilterComponents = Control.extend({
         
         _template: template,
   
         _beforeUpdate: function (options, context) {
            var filterItems = context.filterLayoutField.filterButtonItems;
            if (!isEqual(this.context.get('filterLayoutField').filterButtonItems, filterItems)) {
               this._items = filterItems;
            }
         },
   
         _beforeMount: function (options, context) {
            if (context.filterLayoutField.filterButtonItems) {
               this._items = context.filterLayoutField.filterButtonItems;
            }
         }
      });
   
      FilterComponents.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      return FilterComponents;
   });