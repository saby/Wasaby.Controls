import Control = require('Core/Control');
import template = require('wml!Controls/_grids/SortButton');
import 'css!theme?Controls/grids';

/**
 * Graphical control element that used for changing sorting in Grid control
 *
 * @class Controls/_grids/SortButton
 * @extends Core/Control
 * @mixes Controls/_grids/SortButton/Styles
 */

/**
 * @name Controls/_grids/SortButton#type
 * @cfg {String} Type of sorting.
 * @variant single Sorting by single field.
 * @variant multi Allows you to sort by multiple fields.
 */

/**
 * @name Controls/_grids/SortButton#property
 * @cfg {String} Sorting property.
 */
export = Control.extend({
    _template: template,

    _clickHandler: function () {
        this._notify('sortingChanged', [this._options.property, this._options.type], {bubbling: true});
    }

});
