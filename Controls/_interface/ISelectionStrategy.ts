import { SbisService, PrefetchProxy } from 'Types/source';
import { relation } from 'Types/entity';
import { Collection } from 'Controls/display';
import { ListViewModel } from 'Controls/list';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/_interface/ISelectionType';

export interface IQueryParams {
   limit?: number,
   filter?: Object,
   source?: SbisService|PrefetchProxy
}

export interface ISelectionStrategyOptions {
   selectionCountMethodName?: string
}

/**
 * Интерфейс стратегий выбора.
 *
 * @interface Controls/_interface/ISelectionStrategy
 * @public
 * @author Капустин И.А.
 */
// параметры hierarchyRelation и keyProperty нужен для поддержки старой модели, с полным переходом на новую они уйдут
export default interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   unSelect(selection: ISelection, keys: TKeys, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): ISelection;
   getCount(selection: ISelection, model: Collection|ListViewModel, queryParams: IQueryParams): Promise<number|null>;
   getSelectionForModel(selection: ISelection, model: Collection|ListViewModel, limit?: number, keyProperty?: string, hierarchyRelation?: relation.Hierarchy): Map<TKey, boolean|null>;
   isAllSelected(selection: ISelection, folderId: Tkey, model?: Collection|ListViewModel, hierarchyRelation?: relation.Hierarchy): boolean;
}

/**
 * @name Controls/_interface/ISelectionStrategy#selectionCountMethodName
 * @cfg {String} Название метода, который вернет количество выбранных элементов.
 * @remark Будет вызван, если стратегии, на основании известных ей данных, не удалось определить количество выбранных записей.
 */
