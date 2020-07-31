import {IControlOptions} from 'UI/Base';
import {ISourceOptions, IFilterOptions} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
export type TKey = string|number|null;
import {Model} from 'Types/entity';

export default interface IDropdownHistoryController {
    update(newOptions: IDropdownHistoryControllerOptions): void;
    setHistory(history?: RecordSet): void;
    prepareSource(options: IDropdownHistoryControllerOptions): void;
    getPreparedSource(): Promise<RecordSet>;
    getPreparedFilter(): Promise<RecordSet>;
    getPreparedItem(item: Model): Model;
    getPreparedItems(items?: RecordSet, history?: RecordSet): RecordSet;
    updateHistory(items: RecordSet): void;
    handleSelectorResult(newItems: RecordSet, items: RecordSet): void;
    hasHistory(options: IDropdownHistoryControllerOptions): boolean;
}

export interface IDropdownHistoryControllerOptions extends IControlOptions, IFilterOptions, ISourceOptions {
    historyId?: string;
    historyNew?: string;
}
