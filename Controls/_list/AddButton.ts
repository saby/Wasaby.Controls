import Control = require('Core/Control');
import template = require('wml!Controls/_list/AddButton/AddButton');
import entity = require('Types/entity');
import 'css!theme?Controls/list';

/**
 * Specialized type of button.
 *
 * @class Controls/_list/AddButton
 * @extends Core/Control
 * @control
 * @public
 * @author Михайловский Д.С.
 * @mixes Controls/_list/AddButton/Styles
 *
 *
 * @name Controls/_list/AddButton#caption
 * @cfg {String} Control caption text.
 * @example
 * <pre>
 *    <Controls.list:AddButton caption="add record"/>
 * </pre>
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
