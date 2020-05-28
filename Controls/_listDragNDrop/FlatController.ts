import cClone = require('Core/core-clone');
import { CollectionItem } from "Controls/display";
import { Model } from "Types/entity";
import { ItemsEntity } from "Controls/dragnDrop";

export interface IModel {
   setDraggedItems(avatarItem, draggedItems): void;
   setAvatarPosition(position): void;
   resetDraggedItems(): void;

   calculateDragTargetPosition(itemData);
   getItemDataByItem(item);

   getIndexByKey(key: number|string): number;
}

export interface IDragNDropListController {
   update(useNewModel: boolean, model: IModel);

   startDragNDrop(avatarItem, draggedItems): void;

   changeAvatarPosition(newPosition?): void;

   getDragPosition(itemData): object;

   getSelectionForDragNDrop(selectedKeys, excludedKeys, dragKey);

   reset(): void;
}

export class FlatController implements IDragNDropListController{
   // этот элемент тут запоминается, пока на нем стрелка мыши
   // и после dragStart этот элемент берется как перетаскиваемый и здесь обнуляется
   private _unprocessedDragEnteredItem: CollectionItem<Model>;

   // это то что прикладники вернули на dragEnd
   // и после того как документ перетащили, то смотрим не нужно ли что-то подождать и если есть промис то ожидаем
   private _dragEndResult;

   protected _avatarItem;
   private _avatarPosition;
   private _draggedItems;
   private _isDragging = false;

   constructor(protected _model: IModel) {}

   update(model: IModel) {
      this._model = model;
   }

   set unprocessedDragEnteredItem(val) { this._unprocessedDragEnteredItem = val; }

   get unprocessedDragEnteredItem() { return this._unprocessedDragEnteredItem; }

   set dragEndResult(val) { this._dragEndResult = val; }

   get dragEndResult() { return this._dragEndResult; }

   setDraggedItems(avatarItem, draggedItems): void {
      this._avatarItem = avatarItem;
      this._draggedItems = draggedItems;
   }

   startDragNDrop(event?) {
      this._isDragging = true;
      this._model.setDraggedItems(this._avatarItem, this._draggedItems);

      // проставляем изначальную позицию аватара
      const startPosition = this.calculateDragPosition(this._avatarItem, event);
      this.changeAvatarPosition(startPosition);
   }

   changeAvatarPosition(newPosition) {
      this._avatarPosition = newPosition;
      this._model.setAvatarPosition(newPosition);
   }

   /**
    * Возвращает выбранные элементы, где
    * в выбранные добавлен элемент, за который начали drag-n-drop, если он отсутствовал,
    * выбранные элементы отсортированы по порядку их следования в модели(по индексам перед началом drag-n-drop),
    * из исключенных элементов удален элемент, за который начали drag-n-drop, если он присутствовал
    *
    * @param selectedKeys
    * @param excludedKeys
    * @param dragKey
    */
   getSelectionForDragNDrop(selectedKeys, excludedKeys, dragKey) {
      const allSelected = selectedKeys.indexOf(null) !== -1;

      const selected = cClone(selectedKeys) || [];
      if (selected.indexOf(dragKey) === -1 && !allSelected) {
         selected.push(dragKey);
      }
      this._sortKeys(selected);

      const excluded = cClone(excludedKeys) || [];
      const dragItemIndex = excluded.indexOf(dragKey);
      if (dragItemIndex !== -1) {
         excluded.splice(dragItemIndex, 1);
      }

      return {
         selected: selected,
         excluded: excluded
      };
   }

   calculateDragPosition(itemData, event?) {
      return this._calculateDragTargetPosition(itemData);
   }

   getCurrentDragPosition() {
      return this._avatarPosition;
   }

   reset() {
      this._isDragging = false;
      this._avatarItem = null;
      this._draggedItems = null;
      this._dragEndResult = null;
      this._unprocessedDragEnteredItem = null;
      this._avatarPosition = null;
      this._model.resetDraggedItems();
   }

   isDragging(): boolean {
      return this._isDragging;
   }

   /**
    * Сортировать список ключей элементов
    * Ключи сортируются по порядку, в котором они идут в списке
    * @param keys
    * @private
    */
   private _sortKeys(keys: Array<number|string>) {
      keys.sort((a, b) => {
         const indexA = this._model.getIndexByKey(a),
            indexB = this._model.getIndexByKey(b);
         return indexA > indexB ? 1 : -1
      });
   }

   protected _calculateDragTargetPosition(targetData) {
      let position, prevIndex = -1;

      //If you hover on a record that is being dragged, then the position should not change.
      if (this._avatarItem && this._avatarItem.index === targetData.index) {
         return null;
      }

      if (this._avatarPosition) {
         prevIndex = this._avatarPosition.index;
      } else if (this._avatarItem) {
         prevIndex = this._avatarItem.index;
      }

      if (prevIndex === -1) {
         position = 'before';
      } else if (targetData.index > prevIndex) {
         position = 'after';
      } else if (targetData.index < prevIndex) {
         position = 'before';
      } else if (targetData.index === prevIndex) {
         position = this._avatarPosition.position === 'after' ? 'before' : 'after';
      }

      return {
         index: targetData.index,
         item: targetData.item,
         data: targetData,
         position: position
      };
   }
}
