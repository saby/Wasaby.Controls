/**
 * Created by as.krasilnikov on 10.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/Edit/Container');
import {ContextOptions} from 'Controls/context';

/**
 * Контрол используют в качестве контейнера для {@link Controls/popup:Edit}. Он обеспечивает синхронизацию отредактированной записи с набором данных, который хранится в {@link Controls/list:DataContainer}.
 * @class Controls/_popup/Opener/Edit/Container
 * @control
 * @category Popup
 * @extends Core/Control
 * @see Controls/popup:Edit
 * @see Controls/list:DataContainer
 * @see Controls/popupTemplate:Stack
 * @see Controls/form:Controller
 * @see https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/editing-dialog/
 * @remark
 * Подробнее об использовании контейнера читайте [@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/editing-dialog/ здесь}.
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

