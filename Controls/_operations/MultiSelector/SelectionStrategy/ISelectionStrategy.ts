import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { ISelectionModel } from 'Controls/list';
import { ITreeSelectionStrategyOptions } from './Tree';
import { IFlatSelectionStrategyOptions } from './Flat';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { Map } from 'Types/shim';

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
   getSelectionForModel(selection: ISelection, model: ISelectionModel): Map<boolean, Array<CollectionItem<Model>>>;
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}

export default ISelectionStrategy;
