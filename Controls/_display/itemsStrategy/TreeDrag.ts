import { Model } from 'Types/entity';
import Drag from 'Controls/_display/itemsStrategy/Drag';
import { IDragPosition } from 'Controls/_display/interface/IDragPosition';
import TreeItem from 'Controls/_display/TreeItem';

/**
 * Стратегия для премещения элементов в дереве.
 */
export default class TreeDrag<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>> extends Drag<S, T> {
   setPosition(newPosition: IDragPosition<T>): void {
      super.setPosition(newPosition);

      let avatarParent;

      const targetItem = newPosition.dispItem;
      const relativePosition = newPosition.position;
      if (targetItem.isNode()) {
         if (relativePosition === 'before' || relativePosition === 'after' && !targetItem.isExpanded()) {
            avatarParent = targetItem.getParent();
         } else if (relativePosition === 'after' && targetItem.isExpanded()) {
            avatarParent = targetItem;
         } else {
            // relativePosition = 'on'
            avatarParent = this.avatarItem.getParent();
         }
      } else {
         avatarParent = targetItem.getParent();
      }

      this.avatarItem.setParent(avatarParent);
   }

   protected _createItem(protoItem: T): T {
      const item = super._createItem(protoItem);
      if (item && protoItem) {
         item.setParent(protoItem.getParent());
      }
      return item;
   }
}
