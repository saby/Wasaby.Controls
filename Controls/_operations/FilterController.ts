import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_operations/FilterController';
import {isEqual} from 'Types/object';
import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');

import { TKeysSelection as TKeys } from 'Controls/interface/';
import { Rpc, PrefetchProxy } from 'Types/source';


export interface ISearchFilterController extends IControlOptions {
   selectedKeys: TKeys;
   excludedKeys: TKeys;
   source: Rpc|PrefetchProxy
   filter: Object;
}

export default class SearchFilterController extends Control<ISearchFilterController> {
   protected _template: TemplateFunction = template;
   protected _filter: object = null;
   protected _showSelectedEntries: boolean = false;

   protected _beforeMount(options: ISearchFilterController): void {
      this._filter = SearchFilterController.prepareFilter(options.filter, options.selectedKeys, options.excludedKeys, options.source, this._showSelectedEntries);
   }

   protected _beforeUpdate(newOptions: ISearchFilterController): void {
      if (!isEqual(this._options.filter, newOptions.filter)) {
         this._filter = SearchFilterController.prepareFilter(newOptions.filter, newOptions.selectedKeys, newOptions.excludedKeys, newOptions.source, this._showSelectedEntries);
      }
   }

   protected _viewModeChangedHandler(event: SyntheticEvent<null>, modeView: string) {
      let showSelectedEntries = modeView === 'showSelected';

      if (this._showSelectedEntries !== showSelectedEntries) {
         this._showSelectedEntries = showSelectedEntries;
         this._filter = SearchFilterController.prepareFilter(this._options.filter, this._options.selectedKeys, this._options.excludedKeys, this._options.source, showSelectedEntries);
      }
   }

   private static prepareFilter(filter: object, selectedKeys: TKeys, excludedKeys: TKeys, source: Rpc|PrefetchProxy, showSelectedEntries: boolean): object {
      const preparedFilter = {...filter};
      const source = source.getOriginal ? source.getOriginal() : source;

      if (showSelectedEntries) {
         preparedFilter.selectionWithPaths = selectionToRecord({
            selected: selectedKeys || [],
            excluded: excludedKeys || []
         }, source.getAdapter(), 'all', false);
      }

      return preparedFilter;
   }
}
