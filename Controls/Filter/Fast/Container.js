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
       * Special container for {@link Controls/Filter/Fast}.
       * Listens for child's "filterChanged" event and notify bubbling event "filterChanged".
       * Receives props from context and pass to {@link Controls/Filter/Fast}.
       * NOTE: Must be located inside Controls/Filter/Container.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
       *
       * @class Controls/Filter/Fast/Container
       * @extends Core/Control
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      'use strict';
      
      var Container = Control.extend(/** @lends Controls/Filter/Fast/Container.prototype */{
         
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
   
      Container.contextTypes = function() {
         return {
            filterLayoutField: FilterContextField
         };
      };
      
      return Container;
   });
