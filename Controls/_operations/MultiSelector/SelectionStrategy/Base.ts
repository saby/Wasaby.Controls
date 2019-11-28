import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');

import { Collection } from 'Controls/display';
import { Rpc, PrefetchProxy } from 'Types/source';
import { ListViewModel } from 'Controls/list';
import { TKeySelection as TKey, ISelectionObject as ISelection,
   ISelectionStrategy, ISelectionStrategyOptions, ISelectionQuery as IQueryParams } from 'Controls/interface/';

function _getOriginalSource(source: Rpc|PrefetchProxy): Rpc {
   if (source.getOriginal) {
      source = source.getOriginal();
   }

   return source;
}

function getCountBySource(selection: ISelection, queryParams: IQuertyParams, selectionCountMethodName: string, recursive: boolean): Promise<number|null> {
   let originalSource: Rpc = _getOriginalSource(queryParams.source);
   let filter = {... queryParams.filter};

   filter.selection = selectionToRecord(selection, originalSource.getAdapter(), 'all', recursive);

   return new Promise((resolve) => {
      originalSource.call(selectionCountMethodName, {filter: filter})
         .addCallback((itemsSelectedCount) => {
            resolve(itemsSelectedCount);
         })
         .addErrback(() => {
            resolve(null);
         });
   });
};

export default abstract class BaseSelectionStrategy implements ISelectionStrategy {
   protected _selectionCountMethodName: string;
   protected _recursive: boolean = false;

   constructor(options: ISelectionStrategyOptions) {
      this._selectionCountMethodName = options.selectionCountMethodName;
   }

   select(): ISelection {}

   unSelect(): ISelection {}

   getCount(selection: ISelection, model: Collection|ListViewModel, queryParams: IQueryParams): Promise<number|null> {
      let selectionCount: number|null = this._getCount(...arguments);

      if (selectionCount === null && this._selectionCountMethodName) {
         return getCountBySource(selection, queryParams, this._selectionCountMethodName, this._recursive);
      } else {
         return Promise.resolve(selectionCount);
      }
   }

   getSelectionForModel(): Map<TKey, boolean|null> {}

   isAllSelected(): boolean {}

   protected _getCount(): number|null {}
}
