define('Controls/Filter/Button/Container',
   [
      'Core/Control',
      'wml!Controls/Filter/Button/Container'
   ],
   
   function(Control, template) {
      
      /**
       * Special container for {@link Controls/Filter/Button}.
       * Listens for child's "filterChanged" event and notify bubbling event "filterChanged".
       * Receives props from context and pass to {@link Controls/Filter/Button}.
       * NOTE: Must be located inside Controls/Filter/Controller.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
       *
       * @class Controls/Filter/Button/Container
       * @extends Core/Control
       * @author Герасимов А.М.
       * @control
       * @public
       */

      /**
       * @event Controls/Filter/Button/Container#filterItemsChanged Happens when items changed.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
       * @param {Object} items New items.
       */

      'use strict';
      
      var Container = Control.extend(/** @lends Controls/Filter/Button/Container.prototype */{
         
         _template: template,
   
         _itemsChanged: function(event, items) {
            this._notify('filterItemsChanged', [items], {bubbling: true});
         }
      });
      
      
      return Container;
   });
