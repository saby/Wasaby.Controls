import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_list/Container';
import {ContextOptions as DataOptions} from 'Controls/context';
import {ISourceControllerState} from 'Controls/dataSource';
import {SyntheticEvent} from 'Vdom/Vdom';
import { TKeysSelection as TKeys } from 'Controls/interface';

interface IDataContext {
    dataOptions: ISourceControllerState;
}

/**
 * Контрол-контейнер для списка. Передает опции из контекста в список.
 *
 * @remark
 * Контейнер ожидает поле контекста "dataOptions", которое поставляет Controls/list:DataContainer.
 * Из поля контекста "dataOptions" контейнер передает в список следующие опции: <a href="/docs/js/Controls/list/View/options/filter/">filter</a>, <a href="/docs/js/Controls/list/View/options/navigation/">navigation</a>, <a href="/docs/js/Controls/list/View/options/sorting/">sorting</a>, <a href="/docs/js/Controls/list/View/options/keyProperty/">keyProperty</a>, <a href="/docs/js/Controls/list/View/options/source/">source</a>, sourceController.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less переменные тем оформления}
 * * {@link Controls/list:DataContainer}
 *
 * @class Controls/_list/Container
 * @extends UI/Base:Control
 * @author Герасимов А.М.
 * @public
 */

/*
 * Container component for List. Pass options from context to list.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/component-kinds/'>here</a>.
 *
 * @class Controls/_list/Container
 * @extends UI/Base:Control
 * @author Герасимов А.М.
 * @public
 */
export default class ListContainer extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _dataOptions: ISourceControllerState = null;
    protected _listConfiguration = null;

    protected _beforeMount(options: IControlOptions, context: IDataContext): void {
        this._dataOptions = context.dataOptions;
        if (this._dataOptions.listConfigurations) {
            this._listConfiguration = this._dataOptions.listConfigurations[options.id];
        }
    }

    protected _beforeUpdate(options: IControlOptions, context: IDataContext): void {
        this._dataOptions = context.dataOptions;
        if (this._dataOptions.listConfigurations) {
            this._listConfiguration = this._dataOptions.listConfigurations[options.id];
        }
    }

    protected _notifyEventWithBubbling(e: SyntheticEvent, eventName: string): unknown {
        return this._notify(eventName, Array.prototype.slice.call(arguments, 2), {
            bubbling: true
        });
    }

    protected _listSelectedKeysChanged(e: SyntheticEvent,
                                       keys: TKeys,
                                       added: TKeys,
                                       deleted: TKeys): void {
        this._notify('listSelectedKeysChanged', [keys, added, deleted, this._options.id], {
            bubbling: true
        });
    }

    protected _listExcludedKeysChanged(e: SyntheticEvent,
                                       keys: TKeys,
                                       added: TKeys,
                                       deleted: TKeys): void {
        this._notify('listExcludedKeysChanged', [keys, added, deleted, this._options.id], {
            bubbling: true
        });
    }

    protected _listSelectedKeysCountChanged(e: SyntheticEvent,
                                            count: number,
                                            isAllSelected: boolean): void {
        e.stopPropagation();
        this._notify('listSelectedKeysCountChanged', [count, isAllSelected, this._options.id], {
            bubbling: true
        });
    }

    static contextTypes(): IDataContext {
        return {
            dataOptions: DataOptions
        };
    }
}