import { TKeysSelection as TKeys, ISelectionObject as ISelection} from 'Controls/interface';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { Map } from 'Types/shim';
import { IFlatSelectionStrategyOptions, ISelectionModel, ITreeSelectionStrategyOptions } from '../interface';

/**
 * Интерфейс базового класс стратегий выбора
 */
export default interface ISelectionStrategy {
   select(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   unselect(selection: ISelection, keys: TKeys, model: ISelectionModel): void;
   selectAll(selection: ISelection, model: ISelectionModel): void;
   toggleAll(selection: ISelection, model: ISelectionModel): void;
   unselectAll(selection: ISelection, model: ISelectionModel): void;
   getCount(selection: ISelection, model: ISelectionModel): number|null;
   getSelectionForModel(selection: ISelection, model: ISelectionModel): Map<boolean, Array<CollectionItem<Model>>>;
   update(options: ITreeSelectionStrategyOptions | IFlatSelectionStrategyOptions): void;
}
