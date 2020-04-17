import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { ISelectionModel } from 'Controls/list';
import { ITreeSelectionStrategyOptions } from './Tree';
import { IFlatSelectionStrategyOptions } from './Flat';

/**
 * Интерфейс базового класс стратегий выбора
 */
// параметры keyProperty нужен для поддержки старой модели, с полным переходом на новую они уйдут
interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   unselect(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   selectAll(selection: ISelection, model: ISelectionModel): void;
   toggleAll(selection: ISelection, model: ISelectionModel): void;
   unselectAll(selection: ISelection, model: ISelectionModel): void;
   getCount(selection: ISelection, model: ISelectionModel): number|null;
   getSelectedItems(selection: ISelection, model: ISelectionModel): any[];
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}

export default ISelectionStrategy;
