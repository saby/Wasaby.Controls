import {TKey} from 'Controls/_interface/IItems';
import {NewSourceController as SourceController} from 'Controls/dataSource';
import {ISourceOptions} from 'Controls/_newBrowser/interfaces/ISourceOptions';
import {RecordSet} from 'Types/collection';
import {ControllerClass as SearchController} from 'Controls/search';
import {Logger} from 'UI/Utils';

export class DataSource {

    sourceController: SourceController;

    private searchController: SearchController;

    get root(): TKey {
        return this.sourceController.getRoot();
    }

    searchValue: string;

    constructor(private sourceOptions: ISourceOptions) {
        this.sourceController = new SourceController(this.sourceOptions);
    }

    destroy(): void {
        this.sourceController.destroy();
    }

    setRoot(root: TKey): void {
        this.sourceController.setRoot(root);
    }

    setItems(items: RecordSet): RecordSet {
        return this.sourceController.setItems(items);
    }

    setSearchString(searchString: string): Promise<RecordSet> {
        return this.getSearchController()
            .then((sc) => {
                this.searchValue = searchString;
                return sc.search(searchString);
            })
            .then((result) => {
                if (!(result instanceof RecordSet)) {
                    return;
                }

                // this.sourceController.setItems(result);
                return result;
            });
    }

    loadData(): Promise<RecordSet> {
        return (this.sourceController.load() as Promise<RecordSet>)
            .catch((error) => {
                Logger.error('Возникла ошибка при загрузке данных', this, error);
                return error;
            });
    }

    private getSearchController(): Promise<SearchController> {
        if (!this.searchController) {
            return import('Controls/search').then((result) => {
                return this.searchController = new result.ControllerClass({
                    root: this.root,
                    parentProperty: this.sourceOptions.parentProperty,
                    sourceController: this.sourceController,
                    searchValue: '',
                    searchDelay: 300,
                    minSearchLength: 3,
                    startingWith: 'root',
                    searchValueTrim: true,
                    searchParam: 'SearchString',
                    searchNavigationMode: 'open'
                });
            });
        }

        return Promise.resolve(this.searchController);
    }
}
