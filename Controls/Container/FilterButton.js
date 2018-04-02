/**
 * Created by am.gerasimov on 22.03.2018.
 */
define('Controls/Container/FilterButton',
   [
      'Core/Control',
      'tmpl!Controls/Container/FilterButton/FilterButton',
      'Controls/Container/Filter/FilterContextField',
      'Core/helpers/Object/isEqual',
      'WS.Data/Type/descriptor'
   ],
   
   function(Control, template, FilterContextField, isEqual, descriptor) {
      
      /**
       * Container component for FilterButton
       * Receives props from context and pass to FilterButton.
       * Should be located inside Controls/Container/Filter.
       * @class Controls/Container/FilterButton
       * @extends Controls/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var FilterButton = Control.extend({
         
         _template: template,
   
         _beforeUpdate: function (options, context) {
            //context from Filter layout
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
   
      FilterButton.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      return FilterButton;
   });