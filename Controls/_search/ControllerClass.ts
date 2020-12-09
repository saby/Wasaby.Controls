import {QueryWhereExpression} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {ISearchControllerOptions, ISearchController} from './interface';
import {NewSourceController} from 'Controls/dataSource';
import {Logger} from 'UI/Utils';

type Key = string|number|null;

const SERVICE_FILTERS = {
   HIERARCHY: {
      'Разворот': 'С разворотом',
      'usePages': 'full'
   }
};

export default class ControllerClass implements ISearchController {
   protected _options: ISearchControllerOptions = null;

   protected _searchValue: string = '';
   protected _sourceController: NewSourceController = null;
   private _root: Key = null;
   private _path: RecordSet = null;

   constructor(options: ISearchControllerOptions) {
      this._options = options;

      if (options.sourceController) {
         this._sourceController = options.sourceController;
      } else {
         Logger.error('_search/ControllerClass: sourceController option has incorrect type');
      }

      if (options.root !== undefined) {
         this.setRoot(options.root);
      }
   }

   reset(dontLoad?: boolean): Promise<RecordSet | Error> | QueryWhereExpression<unknown> {
      const filter = {...this._sourceController.getFilter()};
      filter[this._options.searchParam] = this._searchValue = '';

      if (this._options.parentProperty) {
         for (const i in SERVICE_FILTERS.HIERARCHY) {
            if (SERVICE_FILTERS.HIERARCHY.hasOwnProperty(i)) {
               delete filter[i];
            }
         }

         this._deleteRootFromFilter(filter);
      }

      if (!dontLoad) {
         return this._updateFilterAndLoad(filter);
      }

      return filter;
   }

   search(value: string): Promise<RecordSet | Error> {
      const filter: QueryWhereExpression<unknown> = {...this._sourceController.getFilter()};

      filter[this._options.searchParam] = this._searchValue = this._trim(value);

      if (this._root !== undefined && this._options.parentProperty) {
         if (this._options.startingWith === 'current') {
            filter[this._options.parentProperty] = this._root;
         } else {
             const root = ControllerClass._getRoot(this._path, this._root, this._options.parentProperty);
             if (root !== undefined) {
                 filter[this._options.parentProperty] = root;
             } else {
                 delete filter[this._options.parentProperty];
             }
         }
      }

      if (this._options.parentProperty) {
         Object.assign(filter, SERVICE_FILTERS.HIERARCHY);
      }

      return this._updateFilterAndLoad(filter);
   }

   update(options: Partial<ISearchControllerOptions>): void | Promise<RecordSet|Error> | QueryWhereExpression<unknown> {
      let updateResult: void | Promise<RecordSet|Error> | QueryWhereExpression<unknown>;
      let needLoad = false;
      const searchValue = options.hasOwnProperty('searchValue') ? options.searchValue : this._options.searchValue;

      if (this._options.root !== options.root) {
         this.setRoot(options.root);
      }

      if (options.sourceController && options.sourceController !== this._sourceController) {
         this._sourceController = options.sourceController;
         needLoad = true;
      }

      if (options.hasOwnProperty('searchValue')) {
         if (options.searchValue !== this._options.searchValue) {
            needLoad = true;
         }
      }
      if (needLoad) {
         if (searchValue) {
            updateResult = this.search(searchValue);
         } else {
            // TODO: Убрать флаг в аргументе после выполнения
            // https://online.sbis.ru/doc/fe106611-647d-4212-908f-87b81757327b
            updateResult = this.reset(true);
         }
      }
      this._options = {
         ...this._options,
         ...options
      };
      return updateResult;
   }

   setRoot(value: Key): void {
      this._root = value;
   }

   getRoot(): Key {
      return this._root;
   }

   getSearchValue(): string {
      return this._searchValue;
   }

   private _updateFilterAndLoad(filter: QueryWhereExpression<unknown>): Promise<Error|RecordSet> {
      this._sourceController.setFilter(filter);

      // TODO: Без прямой передачи фильтра в load фильтр не учитывается в sourceController (setFilter тут бесполезен)
      return this._sourceController.load(undefined, undefined, filter).then((recordSet) => {
         if (recordSet instanceof RecordSet) {
            this._path = recordSet.getMetaData().path;

            return recordSet as RecordSet;
         }
      });
   }

   private _deleteRootFromFilter(filter: QueryWhereExpression<unknown>): void {
      if (this._options.startingWith === 'current') {
         delete filter[this._options.parentProperty];
      }
   }

   private _trim(value: string): string {
      return this._options.searchValueTrim && value ? value.trim() : value;
   }

    static _getRoot(path: RecordSet, currentRoot: Key, parentProperty: string): Key {
        let root;

        if (path && path.getCount() > 0) {
            root = path.at(0).get(parentProperty);
        } else {
            root = currentRoot;
        }

        return root;
    }
}
