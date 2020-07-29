import {Query, ICrud, DataSet} from 'Types/source';
import {CrudWrapper} from './CrudWrapper';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue, INavigationSourceConfig} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {QueryOrderSelector, QueryWhereExpression, PrefetchProxy} from 'Types/source';
import {IAdditionalQueryParams} from 'Controls/_interface/IAdditionalQueryParams';
import {default as groupUtil} from './GroupUtil';
import {isEqual} from 'Types/object';

interface IControllerOptions {
    keyProperty: string;
    source: ICrud;

    filter: QueryWhereExpression<any>;
    sorting: QueryOrderSelector;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    root: string;

    // for grouping
    groupProperty: string;
    groupingKeyCallback: Function;
    groupHistoryId: string;
    historyIdCollapsedGroups: string;
}

class Controller {
    private _options: IControllerOptions;
    private _filter: QueryWhereExpression<any>;
    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    private _items: RecordSet;

    constructor(cfg: IControllerOptions) {
        this._options = cfg;
        this._filter = cfg.filter;
    }
    load(): Promise<RecordSet> {
        if (this._options.source) {
            // todo можно передавать меньше опций здесь, просто из-за совместимости юзается 4 опции для групп вместо 2х
            return this._getFilterForCollapsedGroups(this._filter, this._options).then((filter) => {
                this._filter = filter;
                const crudWrapper = this._getCrudWrapper(this._options.source);
                let params = {
                    filter: this._filter,
                    sorting: this._options.sorting
                } as IAdditionalQueryParams;

                if (this._options.navigation) {
                    const navigationController = this._getNavigationController(this._options.navigation);
                    params = navigationController.getQueryParams({
                        filter: params.filter,
                        sorting: params.sorting
                    });
                }
                return crudWrapper.query(params, this._options.keyProperty);
            });
        } else {
            Logger.error('source/Controller: Source option has incorrect type');
            return Promise.reject(new Error('source/Controller: Source option has incorrect type'));
        }
    }

    setItems(items: RecordSet): RecordSet {
        this._items = items;
    }

    setFilter(): void {
        return;
    }

    update(newOptions: IControllerOptions): boolean {
        const isFilterChanged = !isEqual(newOptions.filter, this._options.filter);
        if (isFilterChanged) {
            this._filter = newOptions.filter;
        }

        const isChanged =
            isFilterChanged ||
            !isEqual(newOptions.navigation, this._options.navigation) ||
            newOptions.sorting !== this._options.sorting ||
            newOptions.keyProperty !== this._options.keyProperty ||
            newOptions.root !== this._options.root;

        this._options = newOptions;
        return isChanged;
    }

    getPrefetchSource(data: RecordSet|DataSet|Error): PrefetchProxy {
        let source = this._options.source;
        source = source instanceof PrefetchProxy ? source.getOriginal() : source;
        return new PrefetchProxy({
            target: source,
            data: {
                query: data
            }
        });
    }

    private _getCrudWrapper(sourceOption: ICrud): CrudWrapper {
        if (!this._crudWrapper) {
            this._crudWrapper = new CrudWrapper({source: sourceOption});
        }
        return this._crudWrapper;
    }

    private _getNavigationController(
        navigationOption: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        if (!this._navigationController) {
            this._navigationController = new NavigationController({
                navigationType: navigationOption.source,
                navigationConfig: navigationOption.sourceConfig
            });
        }
        return this._navigationController;
    }

    private _getFilterForCollapsedGroups(
        initialFilter: QueryWhereExpression<any>,
        options: IControllerOptions
    ): Promise<QueryWhereExpression<any>> {
        const hasGrouping = !!options.groupProperty || !!options.groupingKeyCallback;
        const historyId = hasGrouping ? (options.groupHistoryId || options.historyIdCollapsedGroups) : undefined;

        if (historyId) {
            return groupUtil.restoreCollapsedGroups(historyId).then((collapsedGroups?: TArrayGroupId) => {
                let modifiedFilter = {};
                if (collapsedGroups && collapsedGroups.length) {
                    modifiedFilter = { ...initialFilter };
                    modifiedFilter.collapsedGroups = collapsedGroups;
                }
                return modifiedFilter;
            });
        } else {
            return Promise.resolve(initialFilter);
        }
    }

}
export default Controller;
