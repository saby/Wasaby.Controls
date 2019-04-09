import Control = require('Core/Control');
import template = require('wml!Controls/_lists/Container');
import DataOptions = require('Controls/Container/Data/ContextOptions');

/**
 * Container component for List. Pass options from context to list.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/component-kinds/'>here</a>.
 *
 * @class Controls/_lists/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @public
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
