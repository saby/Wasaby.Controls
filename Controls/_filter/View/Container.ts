import {Control} from 'UI/Base';
import * as template from 'wml!Controls/_filter/View/Container';
import {default as Store} from 'Controls/Store';
import mergeSource from 'Controls/_filter/Utils/mergeSource';
import clone = require('Core/core-clone');
/**
 * Контрол используют в качестве контейнера для {@link Controls/filter:View}. Он обеспечивает передачу параметров фильтрации между {@link Controls/filter:Controller} и {@link Controls/filter:View}.
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/ здесь}.
 * Подробнее о классификации контролов Wasaby и схеме их взаимодействия читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/component-kinds/ здесь}.
 *
 * @class Controls/_filter/View/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @control
 * @public
 */

/*
 * Special container for {@link Controls/_filter/View}.
 * Listens for child's "itemsChanged" event and notify bubbling event "filterChanged".
 * Receives props from context and pass to {@link Controls/_filter/View}.
 * NOTE: Must be located inside Controls/_filter/Controller.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * @class Controls/_filter/View/Container
 * @extends Core/Control
 * @author Герасимов А.М.
 * @control
 * @public
 */

/**
 * @event Controls/_filter/View/Container#filterItemsChanged Происходит при изменении элементов.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} items Новые элементы.
 */

/*
 * @event Controls/_filter/View/Container#filterItemsChanged Happens when items changed.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */

var Container = Control.extend(/** @lends Controls/_filter/View/Container.prototype */{

    _template: template,

    _beforeMount(options): void {
        this._initState(options);
    },

    _beforeUpdate(options): void {
        this._initState(options);
    },

    _initState(options): void {
        if (options.useStore && options.preloadedSources && options.preloadedSources[0]) {
            const mainSource = options.preloadedSources[0];
            this._historyId = mainSource.historyId;
            // если есть предзагруженные данные в истории, то нужно их подмержить в сурс
            // эта часть аналогична тому что делает _filter/Controller
            let historyItems = mainSource.historyItems;
            if (historyItems) {
                historyItems = historyItems.items || historyItems;
            }
            this._source = this._getSourceByHistory(mainSource.filterButtonSource, historyItems);
        }
    },

    _getSourceByHistory(source, historyItems) {
        let result;
        if (typeof source === 'function') {
            result = source(historyItems);
        } else if (historyItems) {
            result = mergeSource(this._cloneItems(source), historyItems);
        } else {
            result = this._cloneItems(source);
        }
        return result;
    },

    _cloneItems(items) {
        if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
        }
        return clone(items);
    },

    _itemsChanged(event: Event, items): void {
       event.stopPropagation();
       if (this._options.useStore) {
           Store.dispatch('filterSource', items);
       } else {
           this._notify('filterItemsChanged', [items], {bubbling: true});
       }
    },

   _filterChanged(event: Event): void {
      event.stopPropagation();
   },

    _historyApply(event: Event, history): void {
        this._notify('filterHistoryApply', [history], {bubbling: true});
    }
}, {});

export default Container;
