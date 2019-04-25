import Control = require('Core/Control');
import template = require('wml!Controls/_list/AddButton/AddButton');
import entity = require('Types/entity');
import 'css!theme?Controls/_list/AddButton/AddButton';

/**
 *
 * @mixes Controls/_list/AddButton/Styles
 *
 */

var AddButton = Control.extend({
    _template: template,

    clickHandler: function (e) {
        if (this._options.readOnly) {
            e.stopPropagation();
        }
    }
});

AddButton.getOptionTypes = function getOptionTypes() {
    return {
        caption: entity.descriptor(String)
    };
};

export = AddButton;
