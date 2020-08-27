import {ISearchOptions} from 'Controls/interface';
import {NewSourceController} from 'Controls/dataSource';
import {QueryWhereExpression} from 'Types/source';
import {RecordSet} from 'Types/collection';

export interface IControllerClassOptions extends ISearchOptions {
   sourceController: NewSourceController;
}

export default class ControllerClass {

   protected _options: IControllerClassOptions = null;

   constructor(options: IControllerClassOptions) {
      this._options = options;
   }

   private _updateFilter(filter: QueryWhereExpression<unknown>): Promise<RecordSet> {
      const s = this._options.sourceController;
      s.setFilter(filter);
      return s.load().then(
         s.setItems
      );
   }

   reset(): Promise<void> {
      const filter = {...this._options.sourceController.getFilter()};
      delete filter[this._options.searchParam];
      return this._updateFilter(filter).then();
   }

   search(value: string): Promise<RecordSet> {
      const filter: QueryWhereExpression<unknown> = {...this._options.sourceController.getFilter()};

      filter[this._options.searchParam] = value;
      return this._updateFilter(filter);
   }

   update(options: IControllerClassOptions): void {
      this._options = options;
   }
}
