import {Control} from 'UI/Base';
import * as template from 'wml!Controls/_filter/View/Container';

/**
 * Special container for {@link Controls/_filter/View}.
 * Listens for child's "itemsChanged" event and notify bubbling event "filterChanged".
 * Receives props from context and pass to {@link Controls/_filter/View}.
 * NOTE: Must be located inside Controls/_filter/Controller.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * @class Controls/_filter/View/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @control
 * @public
 */

/**
 * @event Controls/_filter/View/Container#filterItemsChanged Happens when items changed.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */



var Container = Control.extend(/** @lends Controls/_filter/View/Container.prototype */{

    _template: template,

    _itemsChanged: function(event, items) {
        this._notify('filterItemsChanged', [items], {bubbling: true});
    }
});

export default Container;