import {Model} from 'Types/entity';
import {IBaseCollection} from 'Controls/display';
import {IMovableItem} from './IMovableItem';

export interface IMovableItemsCollection extends IBaseCollection<Model, IMovableItem>{
    '[Controls/_list/Mover/interface/IMovableItemsCollection]': boolean;
}
