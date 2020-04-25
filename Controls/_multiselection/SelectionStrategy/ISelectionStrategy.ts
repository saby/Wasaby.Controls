import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { Record } from 'Types/entity';
import { IFlatSelectionStrategyOptions, ITreeSelectionStrategyOptions } from '../interface';
import { RecordSet } from 'Types/collection';

/**
 * Интерфейс базового класс стратегий выбора
 */
export default interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, items?: RecordSet): void;
   unselect(selection: ISelection, keys: TKeys, items: RecordSet): void;
   selectAll(selection: ISelection, items: RecordSet): void;
   toggleAll(selection: ISelection, items: RecordSet): void;
   unselectAll(selection: ISelection, items: RecordSet): void;
   getCount(selection: ISelection, items: RecordSet): number|null;
   getSelectionForModel(selection: ISelection, items: RecordSet): Map<boolean|null, Record[]>;
   isAllSelected(selection: ISelection, items: RecordSet): boolean;
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}
