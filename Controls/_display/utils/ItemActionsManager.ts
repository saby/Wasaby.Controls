import CollectionItem from '../CollectionItem';
import IItemActions from '../interface/IItemActions';

export default class ItemActionsManager {
    public setItemActions(item: CollectionItem<unknown>, actions: IItemActions): void {
        item.setActions(actions);
    }
}
