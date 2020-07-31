import * as Control from 'Core/Control';
import IDropdownHistoryController, {IDropdownHistoryControllerOptions} from 'Controls/_dropdown/interface/IDropdownHistoryController';
import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';
import {getSourceFilter, isHistorySource, getSource, getMetaHistory} from 'Controls/_dropdown/dropdownHistoryUtils';
import * as cInstance from 'Core/core-instance';
import {Model} from 'Types/entity';

/**
 * Контроллер для истории выпадающих списков.
 *
 * @class Controls/_dropdown/HistoryController
 * @extends Core/Control
 * @mixes Controls/_dropdown/interface/IDropdownHistoryController
 * @author Мельникова Е.А.
 * @control
 * @private
 */

/*
 * Controller for history of dropdown lists
 *
 * @class Controls/_dropdown/HistoryController
 * @extends Core/Control
 * @mixes Controls/_dropdown/interface/IDropdownHistoryController
 * @author Мельникова Е.А.
 * @control
 * @private
 */

export default class HistoryController implements IDropdownHistoryController {
   protected _options: IDropdownHistoryControllerOptions = null;

   constructor(options: IDropdownHistoryControllerOptions) {
      this._options = options;
      this.prepareSource(options);
   }

   update(newOptions: IDropdownHistoryControllerOptions): void {
      this._options = newOptions;
      this.prepareSource(newOptions);
   }

   setHistory(history?: RecordSet): void {
      if (history) {
         this._options.source.setHistory(history);
      }
   }

   prepareSource(options: IDropdownHistoryControllerOptions): void {
      let sourcePromise;

      if (this.hasHistory(options) && this._isLocalSource(options.source) && !options.historyNew) {
         sourcePromise = getSource(options.source, options.historyId);
      } else {
         sourcePromise = Promise.resolve(options.source);
      }
      sourcePromise.then((source) => {
         this._options.source = source;
      });
   }

   getPreparedSource(): Promise<RecordSet> {
      return this._options.source;
   }

   getPreparedFilter(): Promise<RecordSet> {
      let filter = this._options.filter;

      if (this.hasHistory(this._options)) {
         if (this._isLocalSource(this._options.source) || !this._options.historyNew) {
            filter = getSourceFilter(this._options.filter, this._options.source);
         } else {
            filter.historyIds = [this._options.historyId];
         }
      }

      return filter;
   }

   getPreparedItem(item: Model): Model {
      if (isHistorySource(this._options.source)) {
         return this._options.source.resetHistoryFields(item, this._options.keyProperty);
      } else {
         return item;
      }
   }

   getPreparedItems(items?: RecordSet, history?: RecordSet): RecordSet {
      return history ? this._options.source.prepareItems(items) : items;
   }

   updateHistory(items: RecordSet): void {
      if (isHistorySource(this._options.source)) {
         this._options.source.update(items, getMetaHistory());
      }
   }

   handleSelectorResult(newItems: RecordSet, items: RecordSet): void {
      if (isHistorySource(this._options.source)) {
         if (newItems.length) {
            this._sourceController = null;
         }
         this.updateHistory(factory(items).toArray());
      }
   }

   hasHistory(options: IDropdownHistoryControllerOptions): boolean {
      return options.historyId || isHistorySource(options.source);
   }

   private _isLocalSource(source: RecordSet): boolean {
      return cInstance.instanceOfModule(source, 'Types/source:Local');
   }
}
