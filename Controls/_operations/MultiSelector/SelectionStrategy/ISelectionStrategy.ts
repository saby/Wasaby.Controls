import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface/';
import { ISelectionModel } from 'Controls/list';

/**
 * Интерфейс базового класс стратегий выбора
 */
// параметры keyProperty нужен для поддержки старой модели, с полным переходом на новую они уйдут
interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   unselect(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   selectAll(selection: ISelection, model: ISelectionModel, limit: number): void;
   toggleAll(selection: ISelection, model: ISelectionModel, limit: number): void;
   unselectAll(selection: ISelection, model: ISelectionModel): void;
   getCount(selection: ISelection, model: ISelectionModel, limit: number): number|null;
   getSelectionForModel(selection: ISelection, model: ISelectionModel, limit: number, keyProperty: string): Map<TKey, boolean>;
}

export default ISelectionStrategy;
