import Control = require('Core/Control');
import template = require('wml!Controls/_list/Container');
import DataOptions = require('Controls/Container/Data/ContextOptions');

/**
 * Container component for List. Options from context -> List.
 * @param Control
 * @param template
 * @param DataOptions
 */

var List = Control.extend({

    _template: template,

    _beforeMount: function (options, context) {
        this._dataOptions = context.dataOptions;
    },

    _beforeUpdate: function (options, context) {
        this._dataOptions = context.dataOptions;
    }

});

List.contextTypes = function () {
    return {
        dataOptions: DataOptions
    };
};

export = List;
