import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { Record } from 'Types/entity';
import { IFlatSelectionStrategyOptions, ITreeSelectionStrategyOptions } from '../interface';

/**
 * Интерфейс базового класс стратегий выбора
 */
export default interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys): ISelection;
   unselect(selection: ISelection, keys: TKeys): ISelection;
   selectAll(selection: ISelection): ISelection;
   toggleAll(selection: ISelection, hasMoreData: boolean): ISelection;
   unselectAll(selection: ISelection): ISelection;
   getSelectionForModel(selection: ISelection): Map<boolean|null, Record[]>;
   getCount(selection: ISelection, hasMoreData: boolean): number|null;
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}
