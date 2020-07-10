import {Query, ICrud, DataSet} from 'Types/source';
import {CrudWrapper} from 'Controls/_dataSource/CrudWrapper';
import {NavigationController} from './NavigationController';
import {INavigationOptionValue, INavigationSourceConfig} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {QueryOrderSelector, QueryWhereExpression} from 'Types/source';
import {IAdditionalQueryParams} from 'Controls/_interface/IAdditionalQueryParams';

interface IControllerOptions {
    filter: QueryWhereExpression<any>;
    sorting: QueryOrderSelector;
    source: ICrud;
    navigation: INavigationOptionValue<INavigationSourceConfig>;
}

class Controller {
    private _filter: QueryWhereExpression<any>;
    private _sorting: QueryOrderSelector;
    private _source: ICrud;
    private _navigation: INavigationOptionValue<INavigationSourceConfig>;
    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    constructor(cfg: IControllerOptions) {
        this._source = cfg.source;
        this._navigation = cfg.navigation;
        this._filter = cfg.filter;
        this._sorting = cfg.sorting;
    }
    async load(): Promise<RecordSet> {
        if (this._source) {
            const crudWrapper = this._getCrudWrapper(this._source);
            let params = {
                filter: this._filter,
                sorting: this._sorting
            } as IAdditionalQueryParams;

            if (this._navigation) {
                const navigationController = this._getNavigationController(this._navigation);
                params = navigationController.getQueryParams({
                    filter: params.filter,
                    sorting: params.sorting
                });
            }
            return crudWrapper.query(params);

        } else {
            Logger.error('source/Controller: Source option has incorrect type');
            return Promise.reject(new Error('source/Controller: Source option has incorrect type'));
        }
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

}
export default Controller;
