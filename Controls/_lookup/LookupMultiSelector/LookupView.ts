import BaseLookupView = require('Controls/_lookup/BaseLookupView');
import getWidthUtil = require('Controls/Utils/getWidth');
import showSelectorTemplate = require('wml!Controls/_lookup/BaseLookupView/resources/showSelectorTemplate');
import inputRender = require('wml!Controls/_lookup/LookupMultiSelector/resources/inputRender');

import 'css!theme?Controls/_lookup/LookupMultiSelector/Lookup';


var
    OUTER_INDENT_INPUT = 0,
    SHOW_SELECTOR_WIDTH = 0,
    LIST_OF_DEPENDENT_OPTIONS = ['items', 'displayProperty', 'readOnly', 'placeholder', 'isInputVisible'];

var _private = {
    initializeConstants: function () {
        if (!SHOW_SELECTOR_WIDTH) {
            SHOW_SELECTOR_WIDTH = getWidthUtil.getWidth(showSelectorTemplate());
            OUTER_INDENT_INPUT = getWidthUtil.getWidth(inputRender());
        }
    },

    getAvailableWidthCollection: function (self, options) {
        var
            placeholderWidth,
            availableWidthCollection = self._getFieldWrapperWidth();

        if (!options.readOnly) {
            availableWidthCollection -= SHOW_SELECTOR_WIDTH;
        }

        if (self._isInputVisible(options)) {
            placeholderWidth = _private.getPlaceholderWidth(options.placeholder);
            availableWidthCollection -= placeholderWidth + OUTER_INDENT_INPUT;
        }

        return availableWidthCollection;
    },

    getPlaceholderWidth: function (placeholder) {
        if (placeholder && placeholder.func instanceof Function) {
            placeholder = placeholder.func();
        }

        return placeholder ? getWidthUtil.getWidth(placeholder) : 0;
    }
};

var LookupMultiSelectorView = BaseLookupView.extend({
    _showClearButton: false,

    _beforeMount: function () {
        LookupMultiSelectorView.superclass._beforeMount.apply(this, arguments);
        this._listOfDependentOptions = LIST_OF_DEPENDENT_OPTIONS;
    },

    _afterMount: function () {
        _private.initializeConstants();
        LookupMultiSelectorView.superclass._afterMount.apply(this, arguments);
    },

    _calculatingSizes: function (options) {
        this._maxVisibleItems = options.items.getCount();
        this._availableWidthCollection = _private.getAvailableWidthCollection(this, options);
    },

    _isInputVisible: function (options) {
        return !options.readOnly && options.items.getCount() < options.maxVisibleItems;
    },

    _isNeedUpdate: function() {
        return !this._options.readOnly;
    },

    _isNeedCalculatingSizes: function(options) {
        return !options.readOnly && !this._isEmpty(options);
    }
});

LookupMultiSelectorView._private = _private;
export = LookupMultiSelectorView;
