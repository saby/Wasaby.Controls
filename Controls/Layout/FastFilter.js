/**
 * Created by am.gerasimov on 22.03.2018.
 */
define('Controls/Layout/FastFilter',
   [
      'Core/Control',
      'tmpl!Controls/Layout/FastFilter/FastFilter',
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
            //context from Filter layout
            var filterItems = context.filterLayoutField.fastFilterItems;
            if (!isEqual(this.context.get('filterLayoutField').fastFilterItems, filterItems)) {
               this._items = filterItems;
            }
         },
   
         _beforeMount: function (options, context) {
            if (context.filterLayoutField.fastFilterItems) {
               this._items = context.filterLayoutField.fastFilterItems;
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