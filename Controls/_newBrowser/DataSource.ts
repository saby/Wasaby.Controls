import {Logger} from 'UI/Utils';
import {RecordSet} from 'Types/collection';
import {TKey} from 'Controls/_interface/IItems';
import {IDetailOptions} from 'Controls/newBrowser';
import {ControllerClass as SearchController} from 'Controls/search';
import {NewSourceController as SourceController} from 'Controls/dataSource';
import {QueryWhereExpression} from 'Types/source';

export class DataSource {

    readonly sourceController: SourceController;

    private searchController: SearchController;

    get root(): TKey {
        return this.sourceController.getRoot();
    }

    constructor(private sourceOptions: IDetailOptions) {
        this.sourceController = new SourceController(sourceOptions);
    }

    destroy(): void {
        this.sourceController.destroy();
    }

    getFilter(): QueryWhereExpression<unknown> {
        return this.sourceController.getFilter();
    }

    setFilter(filter: QueryWhereExpression<unknown>): void {
        this.sourceController.setFilter(filter);
    }

    updateFilterAfterSearch(): void {
        this.sourceController.setFilter(
            this.searchController.getFilter()
        );
    }

    setRoot(root: TKey): void {
        this.sourceController.setRoot(root);
        if (this.searchController && this.sourceOptions.searchStartingWith === 'current') {
            this.searchController.setRoot(root);
        }
    }

    setItems(items: RecordSet): RecordSet {
        return this.sourceController.setItems(items);
    }

    setSearchString(searchString: string): Promise<RecordSet> {
        return this.getSearchController()
            .then((sc) => sc.search(searchString))
            .then((result) => {
                if (!(result instanceof RecordSet)) {
                    return;
                }

                return result;
            });
    }

    /**
     * Сбрасывает значение поиска в фильтре
     */
    resetSearchString(): Promise<void> {
        return this.getSearchController()
            .then((sc) => {
                const filter = sc.reset(true);
                this.sourceController.setFilter(filter);
            });
    }

    loadData(): Promise<RecordSet> {
        return (this.sourceController.load() as Promise<RecordSet>)
            .catch((error) => {
                Logger.error('Возникла ошибка при загрузке данных', this, error);
                return error;
            });
    }

    updateOptions(ops: IDetailOptions): void {
        this.sourceOptions = ops;
        this.sourceController.updateOptions(ops);
    }

    private getSearchController(): Promise<SearchController> {
        if (this.searchController) {
            return Promise.resolve(this.searchController);
        }

        return import('Controls/search').then((result) => {
            return this.searchController = new result.ControllerClass({
                root: this.sourceOptions.searchStartingWith === 'current' ? this.sourceController.getRoot() : null,
                parentProperty: this.sourceOptions.parentProperty,
                sourceController: this.sourceController,
                searchValue: '',
                searchDelay: 300,
                minSearchLength: 3,
                startingWith: this.sourceOptions.searchStartingWith,
                searchValueTrim: true,
                searchParam: (this.sourceOptions as any).searchParam,
                searchNavigationMode: (this.sourceOptions as any).searchNavigationMode
            });
        });
    }
}
