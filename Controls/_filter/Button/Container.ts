import Control = require('Core/Control');
import template = require('wml!Controls/_filter/Button/Container');

      /**
       * Special container for {@link Controls/_filter/Button}.
       * Listens for child's "filterChanged" event and notify bubbling event "filterChanged".
       * Receives props from context and pass to {@link Controls/_filter/Button}.
       * NOTE: Must be located inside Controls/_filter/Controller.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
       *
       * @class Controls/_filter/Button/Container
       * @extends Core/Control
       * @author Герасимов А.М.
       * @control
       * @public
       */

/**
 * @event Controls/_filter/Button/Container#filterItemsChanged Happens when items changed.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */



var Container = Control.extend(/** @lends Controls/_filter/Button/Container.prototype */{

   _template: template,

   _itemsChanged: function(event, items) {
      this._notify('filterItemsChanged', [items], {bubbling: true});
   }
});


      export = Container;

