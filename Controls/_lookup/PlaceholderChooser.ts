import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/PlaceholderChooser/PlaceholderChooser');
import collection = require('Types/collection');

/**
 * Обертка над "Lookup", которая следит за изменениями выбранных записей, и на основании них отдает один из возможных заранее сформированных "placeholders".
 * @class Controls/_lookup/PlaceholderChooser
 * @control
 * @extends Core/Control
 * @public
 * @author Капустин И.А.
 */
/*
 * A wrapper over the "Lookup" that monitors changes to the selected entries, and on the basis of them gives one of the possible pre-formed "placeholders".
 * @class Controls/_lookup/PlaceholderChooser
 * @control
 * @extends Core/Control
 * @public
 * @author Kapustin I.A.
 */

var _private = {
    getPlaceholder: function(items, placeholders, placeholderKeyCallback) {
        return placeholders[placeholderKeyCallback(items)];
    }
};

var PlaceholderChooser = Control.extend({
    _template: template,
    _placeholder: '',

    _beforeMount: function(options) {
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._placeholder = _private.getPlaceholder(new collection.List(), options.placeholders, options.placeholderKeyCallback);
    },

    _itemsChanged: function(event, items) {
        this._placeholder = _private.getPlaceholder(items, this._options.placeholders, this._options.placeholderKeyCallback);
    },

    _dataLoadCallback: function(items) {
        this._placeholder = _private.getPlaceholder(items, this._options.placeholders, this._options.placeholderKeyCallback);
        this._forceUpdate();
    }
});

PlaceholderChooser._private = _private;

export = PlaceholderChooser;
