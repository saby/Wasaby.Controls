import { IDraggableCollection, IDraggableItem, IDragStrategy, IDragStrategyParams } from './interface';
import { SyntheticEvent } from 'UI/Vdom';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDragPosition } from 'Controls/display';
import { ISelectionObject } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';

/**
 * Контроллер, управляющий состоянием отображения драг'н'дропа
 * @class Controls/_listDragNDrop/Controller
 * @public
 * @author Панихин К.А.
 */

export default class Controller<
    P extends IDragStrategyParams<T>,
    S extends Model = Model,
    T extends IDraggableItem<S> = IDraggableItem<S>
> {
   private _model: IDraggableCollection<S, T>;
   private _strategy: IDragStrategy<T, P>;
   private _strategyConstructor: new (model: IDraggableCollection<S, T>, draggableItem: T) => IDragStrategy<T>;

   private _draggableItem: T;
   private _dragPosition: IDragPosition<T>;
   private _entity: ItemsEntity;

   constructor(
       model: IDraggableCollection<S, T>,
       strategyConstructor: new (model: IDraggableCollection<S, T>, draggableItem: T) => IDragStrategy<T>
   ) {
      this._model = model;
      this._strategyConstructor = strategyConstructor;
   }

   /**
    * Запускает отображение в списке начала драг н дропа.
    * Позволяет отобразить перетаскиеваемый элемент особым образом, отличным от остальных элементов.
    * @param draggableItem - ключ записи, за которую осуществляется перетаскивание
    * @param entity - сущность перемещения, содержит весь список перемещаемых записей
    */
   startDrag(draggableItem: T, entity: ItemsEntity): void {
      this.setDraggedItems(entity, draggableItem);
      this._strategy = new this._strategyConstructor(this._model, draggableItem);
   }

   /**
    * Отображает перетаскивание в списке.
    * Позволяет отобразить перетаскиеваемые элементы особым образом, отличным от остальных элементов.
    * @param entity - сущность перемещения, содержит весь список перемещаемых записей
    * @param draggedItem - запись, за которую осуществляется перетаскивание
    */
   setDraggedItems(entity: ItemsEntity, draggedItem: T = null): void {
      this._entity = entity;
      this._draggableItem = draggedItem;
      this._model.setDraggedItems(draggedItem.getContents().getKey(), entity.getItems());
   }

   /**
    * Отображает перетаскиваемые сущности в указанной позиции списка
    * @param position - позиция в которой надо отобразить перемещаемые записи
    */
   setDragPosition(position: IDragPosition<T>): void {
      if (this._dragPosition === position) {
         return;
      }

      this._dragPosition = position;
      this._model.setDragPosition(position);
   }

   getDraggableItem(): T {
      return this._draggableItem;
   }

    /**
     * Заканчивает драг'н'дроп в списке. Все записи отображаются обычным образом
     */
   endDrag(): void {
      this._draggableItem = null;
      this._dragPosition = null;
      this._entity = null;
      this._strategy = null;
      this._model.resetDraggedItems();
   }

   /**
    * Возвращает true если в данный момент происходит перемещение
    */
   isDragging(): boolean {
      return !!this._entity;
   }

   /**
    * Возвращает текущую позицию
    */
   getDragPosition(): IDragPosition<T> {
      return this._dragPosition;
   }

   /**
    * Возвращает сущность перемещаемых записей
    */
   getDragEntity(): ItemsEntity {
      return this._entity;
   }

   /**
    * Рассчитывает итоговую позицию для перемещения
    * @param params
    */
   calculateDragPosition(params: P): IDragPosition<T> {
      return this._strategy.calculatePosition({ ...params, currentPosition: this._dragPosition });
   }

   static canStartDragNDrop(
       canStartDragNDropOption: boolean|Function,
       event: SyntheticEvent<MouseEvent>,
       isTouch: boolean
   ): boolean {
      return (!canStartDragNDropOption || typeof canStartDragNDropOption === 'function' && canStartDragNDropOption())
          && !event.nativeEvent.button
          && !(event.target as Element).closest('.controls-DragNDrop__notDraggable')
          && !isTouch;
   }

   /**
    * Возвращает выбранные элементы, где
    * в выбранные добавлен элемент, за который начали drag-n-drop, если он отсутствовал,
    * выбранные элементы отсортированы по порядку их следования в модели(по индексам перед началом drag-n-drop),
    * из исключенных элементов удален элемент, за который начали drag-n-drop, если он присутствовал
    *
    * @param model
    * @param selection
    * @param dragKey
    */
   static getSelectionForDragNDrop(
       model: IDraggableCollection,
       selection: ISelectionObject,
       dragKey: CrudEntityKey
   ): ISelectionObject {
      const allSelected = selection.selected.indexOf(null) !== -1;

      const selected = [...selection.selected];
      if (selected.indexOf(dragKey) === -1 && !allSelected) {
         selected.push(dragKey);
      }

      this._sortKeys(model, selected);

      const excluded = [...selection.excluded];
      const dragItemIndex = excluded.indexOf(dragKey);
      if (dragItemIndex !== -1) {
         excluded.splice(dragItemIndex, 1);
      }

      return {
         selected,
         excluded,
         recursive: false
      };
   }

   /**
    * Сортировать список ключей элементов
    * Ключи сортируются по порядку, в котором они идут в списке
    * @param model
    * @param keys
    * @private
    */
   private static _sortKeys(model: IDraggableCollection, keys: Array<number|string>): void {
      keys.sort((a, b) => {
         const indexA = model.getIndexByKey(a);
         const indexB = model.getIndexByKey(b);
         return indexA > indexB ? 1 : -1;
      });
   }
}
