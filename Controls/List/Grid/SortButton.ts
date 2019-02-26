import Control = require('Core/Control');
import template = require('wml!Controls/List/Grid/SortButton');
require('css!theme?Controls/List/Grid/SortButton');

/**
 * Graphical control element that used for changing sorting in Grid control
 *
 * @class Controls/List/Grid/SortButton
 * @extends Core/Control
 * @mixes Controls/List/Grid/SortButton/Styles
 */

/**
 * @name Controls/List/Grid/SortButton#type
 * @cfg {String} Type of sorting.
 * @variant single Sorting by single field.
 * @variant multi Allows you to sort by multiple fields.
 */

/**
 * @name Controls/List/Grid/SortButton#property
 * @cfg {String} Sorting property.
 */
export = Control.extend({
    _template: template,

    _clickHandler: function () {
        this._notify('sortingChanged', [this._options.property, this._options.type], {bubbling: true});
    }

});
