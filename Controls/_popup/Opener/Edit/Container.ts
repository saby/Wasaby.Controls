/**
 * Created by as.krasilnikov on 10.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/Edit/Container');
import {ContextOptions} from 'Controls/context';

/**
 * Контрол используют в качестве контейнера для {@link Controls/popup:Edit}. Он получает данные и передаёт их в Controls/popup:Edit.
 * @class Controls/_popup/Opener/Edit/Container
 * @control
 * @category Popup
 * @extends Core/Control
 * @see Controls/popup:Edit
 * @see Controls/list:DataContainer
 * @see Controls/popupTemplate:Stack
 * @see Controls/form:Controller
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/ здесь}.
 * Подробнее о классификации контролов Wasaby и схеме их взаимодействия читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/component-kinds/ здесь}.
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

