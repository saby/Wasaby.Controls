import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');

import { Collection } from 'Controls/display';
import { Rpc, PrefetchProxy } from 'Types/source';
import { ListViewModel } from 'Controls/list';
import { relation } from 'Types/entity';
import { TKeySelection as TKey, ISelectionObject as ISelection} from 'Controls/interface/';

export interface IQueryParams {
   limit?: number,
   filter?: Object,
   source?: Rpc|PrefetchProxy
}

export interface ISelectionStrategyOptions {
   selectionCountMethodName?: string
}

/**
 * Интерфейс базового класс стратегий выбора
 */
// параметры hierarchyRelation и keyProperty нужен для поддержки старой модели, с полным переходом на новую они уйдут
export interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   unSelect(selection: ISelection, keys: TKeys, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   getCount(selection: ISelection, model: Collection|ListViewModel, queryParams: IQueryParams): Promise<number|null>;
   getSelectionForModel(selection: ISelection, model: Collection|ListViewModel, limit?: number, keyProperty?: string, hierarchyRelation?: relation.Hierarchy): Map<TKey, boolean|null>;
   isAllSelected(selection: ISelection, folderId: Tkey, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): boolean;
}

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

/**
 * Базовый класс стратегий выбора
 * @class Controls/_operations/MultiSelector/SelectionStrategy/Base
 * @public
 * @author Капустин И.А.
 */

/**
 * @name Controls/_operations/MultiSelector/SelectionStrategy/Base#selectionCountMethodName
 * @cfg {String} Название метода, который вернет количество выбранных элементов.
 * @remark Будет вызван, если стратегии, на основании известных ей данных, не удалось определить количество выбранных записей.
 */
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
