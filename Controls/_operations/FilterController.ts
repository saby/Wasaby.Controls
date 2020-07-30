import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
// @ts-ignore
import * as template from 'wml!Controls/_operations/FilterController';
import {isEqual} from 'Types/object';
import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');

import { TKeysSelection as TKeys } from 'Controls/interface';
import { Rpc, PrefetchProxy } from 'Types/source';
import {IHashMap} from 'Types/declarations';

export interface IOperationsFilterController extends IControlOptions {
   selectionViewMode: string;
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   source: Rpc|PrefetchProxy;
   filter: IHashMap<unknown>;
}

interface IFilterConfig {
   filter: IHashMap<unknown>;
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   source: Rpc|PrefetchProxy;
   parentProperty?: string;
   selectionViewMode?: string;
}

export default class OperationsFilterController extends Control<IOperationsFilterController> {
   protected _template: TemplateFunction = template;
   protected _filter: object = null;

   protected _beforeMount(options: IOperationsFilterController): void {
      this._filter = OperationsFilterController.prepareFilter(options);
   }

   protected _beforeUpdate(newOptions: IOperationsFilterController): void {
      if (!isEqual(this._options.filter, newOptions.filter) ||
          this._options.selectionViewMode !== newOptions.selectionViewMode) {
         this._filter = OperationsFilterController.prepareFilter(newOptions);
      }
   }

   private static prepareFilter({
        filter,
        selectedKeys= [],
        excludedKeys= [],
        source,
        selectionViewMode,
        parentProperty
     }: IFilterConfig): object {
      const preparedFilter = {...filter};
      const addSelectionToFilter = selectionViewMode === 'selected' ||
                                   (selectedKeys.length && parentProperty);

      if (addSelectionToFilter) {
         const listSource = (source as PrefetchProxy).getOriginal ? (source as PrefetchProxy).getOriginal() : source;
         const selection = selectionToRecord({
            selected: selectedKeys || [],
            excluded: excludedKeys || []
         }, (listSource as Rpc).getAdapter(), 'all', false);
         const filterField = selectionViewMode === 'selected' ? 'SelectionWithPath' : 'entries';

         preparedFilter[filterField] = selection;
      }

      return preparedFilter;
   }
}
