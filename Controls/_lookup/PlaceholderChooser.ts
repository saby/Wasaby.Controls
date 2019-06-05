import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/PlaceholderChooser/PlaceholderChooser');
import collection = require('Types/collection');


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
