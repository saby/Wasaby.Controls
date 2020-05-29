import cClone = require('Core/core-clone');
import { IDragPosition, IFlatController, IFlatItem, IFlatModel, ISelection, TKey, TPosition } from './interface';
import { SyntheticEvent } from 'Vdom/Vdom';


export class FlatController implements IFlatController{
   // этот элемент тут запоминается, пока на нем стрелка мыши
   // и после dragStart этот элемент берется как перетаскиваемый и здесь обнуляется
   protected _unprocessedDragEnteredItem: IFlatItem;

   // это то что прикладники вернули на dragEnd
   // и после того как документ перетащили, то смотрим не нужно ли что-то подождать и если есть промис то ожидаем
   private _dragEndResult: Promise<any>;

   protected _model: IFlatModel;
   protected _avatarItem: IFlatItem;
   private _canStartDragNDropOption: boolean|Function;
   private _avatarPosition: IDragPosition;
   private _draggedItems: Array<TKey|null>;
   private _isDragging: boolean = false;

   constructor(model: IFlatModel, canStartDragNDropOption: boolean|Function) {
      this._model = model;
      this._canStartDragNDropOption = canStartDragNDropOption;
   }

   update(model: IFlatModel, canStartDragNDropOption: boolean|Function) {
      this._model = model;
      this._canStartDragNDropOption = canStartDragNDropOption;
   }

   set unprocessedDragEnteredItem(val) { this._unprocessedDragEnteredItem = val; }

   get unprocessedDragEnteredItem() { return this._unprocessedDragEnteredItem; }

   set dragEndResult(val) { this._dragEndResult = val; }

   get dragEndResult() { return this._dragEndResult; }

   setDraggedItems(avatarItem: IFlatItem, draggedItems: Array<TKey>): void {
      this._avatarItem = avatarItem;
      this._draggedItems = draggedItems;
   }

   canStartDragNDrop(event: SyntheticEvent<MouseEvent>, isTouch: boolean): boolean {
      return (!this._canStartDragNDropOption || typeof this._canStartDragNDropOption === 'function' && this._canStartDragNDropOption())
         && !event.nativeEvent.button && !event.target.closest('.controls-DragNDrop__notDraggable') && !isTouch;
   }

   startDragNDrop(): void {
      this._isDragging = true;
      this._model.setDraggedItems(this._avatarItem, this._draggedItems);

      // проставляем изначальную позицию аватара
      const startPosition = this.calculateDragPosition(this._avatarItem);
      this.setAvatarPosition(startPosition);
   }

   setAvatarPosition(newPosition: IDragPosition): void {
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
   getSelectionForDragNDrop(selectedKeys: Array<TKey|null>, excludedKeys: Array<TKey|null>, dragKey: TKey): ISelection {
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

   calculateDragPosition(itemData: IFlatItem): IDragPosition {
      return this._calculateDragTargetPosition(itemData);
   }

   getCurrentDragPosition(): IDragPosition {
      return this._avatarPosition;
   }

   reset(): void {
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
   private _sortKeys(keys: Array<number|string>): void {
      keys.sort((a, b) => {
         const indexA = this._model.getIndexByKey(a),
            indexB = this._model.getIndexByKey(b);
         return indexA > indexB ? 1 : -1
      });
   }

   protected _calculateDragTargetPosition(targetData: IFlatItem, position?: TPosition): IDragPosition {
      let prevIndex = -1;

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
