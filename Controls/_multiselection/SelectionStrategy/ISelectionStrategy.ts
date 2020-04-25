import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { Record } from 'Types/entity';
import { IFlatSelectionStrategyOptions, ITreeSelectionStrategyOptions } from '../interface';

/**
 * Интерфейс базового класс стратегий выбора
 */
export default interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys): void;
   unselect(selection: ISelection, keys: TKeys): void;
   selectAll(selection: ISelection): void;
   toggleAll(selection: ISelection, hasMoreData: boolean): void;
   unselectAll(selection: ISelection): void;
   getSelectionForModel(selection: ISelection): Map<boolean|null, Record[]>;
   getCount(selection: ISelection, hasMoreData: boolean): number|null;
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}
