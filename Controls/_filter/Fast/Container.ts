/**
 * Created by am.gerasimov on 22.03.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_filter/Fast/Container');

/**
 * Special container for {@link Controls/Filter/Fast}.
 * Listens for child's "filterChanged" event and notify bubbling event "filterChanged".
 * Receives props from context and pass to {@link Controls/Filter/Fast}.
 * NOTE: Must be located inside Controls/Filter/Controller.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * @class Controls/Filter/Fast/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @control
 * @public
 */



var Container = Control.extend(/** @lends Controls/Filter/Fast/Container.prototype */{

   _template: template,

   _itemsChanged: function(event, items) {
      this._notify('filterItemsChanged', [items], {bubbling: true});
   }
});

export = Container;

