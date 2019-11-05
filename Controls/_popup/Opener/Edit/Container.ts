/**
 * Created by as.krasilnikov on 10.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/Edit/Container');
import {ContextOptions} from 'Controls/context';

/**
 * edit container
 * @class Controls/_popup/Opener/Edit/Container
 * @control
 * @category Popup
 * @extends Core/Control
 */
let Container = Control.extend({
    _template: template,

    _beforeMount(options, context) {
        this._updateItems(context);
    },
    _beforeUpdate(options, context) {
        this._updateItems(context);
    },
    _updateItems(context) {
        if (context.dataOptions && context.dataOptions.items) {
            this._items = context.dataOptions.items;
        }
    }
});

Container.contextTypes = function() {
    return {
        dataOptions: ContextOptions
    };
};

export = Container;
