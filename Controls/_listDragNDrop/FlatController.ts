import cClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');``
import { CollectionItem } from "Controls/display";
import { SyntheticEvent } from "Vdom/Vdom";
import { Model } from "Types/entity";
import { ItemsEntity } from "Controls/dragnDrop";

export interface IModel {
   calculateDragTargetPosition(itemData);
   getItemDataByItem();
   _prepareDisplayItemForAdd(); // TODO жесткая хрень, надо понять для чего

   // это будет один метод в старой и новой модели, вроде это уже написано, надо заюзать
   getCollection();
   getItems();

   /*
      по идее все эти сеттеры и геттеры нужны только для старой модели, так как в новой модели это не хранится
      но вопрос: они влияют на версию, то есть это нужно доабвить в новую модель или как-то вытащить из старой
    */
   setDragTargetPosition(dragPosition): void;
   setDragItemData();
   setDragEntity();

   getDragEntity();
   getDragItemData();
   getDragTargetPosition();
}

export interface IDragNDropListController {
   update(useNewModel: boolean, model: IModel);

   startDragNDrop(itemData, items, dragControlId, notifyDragStart);

   handleMouseMove(itemData, nativeEvent, notifyChangeDragTarget);

   handleMouseLeave();

   handleMouseEnter(event: SyntheticEvent<MouseEvent>, itemData: CollectionItem<Model>, notifyChangeDragTarget: Function): void;

   handleDragStart(dragObject, notifyChangeDragTarget: Function): void;

   handleDragEnter(dragObject, notifyDragEnter: Function);

   handleDragLeave();

   handleDragEnd(dragObject, notifyDragEnd);

   handleDocumentDragEnd(showIndicator: Function, hideIndicator: Function);

   getSelectionForDragNDrop(selectedKeys, excludedKeys, dragKey);
}

export class FlatController implements IDragNDropListController{
   // это то что перетаскиваем, прикладники сверху сюда что-то могут положить,
   // но обязательно есть items - список перетаскиваемых элементов
   private _draggingEntity: ItemsEntity;

   // элемент который перетаскивают, наверное это фантомный элемент
   private _draggingItem: CollectionItem<Model>;

   // этот элемент тут запоминается, пока на нем стрелка мыши
   // и после dragStart этот элемент берется как перетаскиваемый и здесь обнуляется
   private _unprocessedDragEnteredItem: CollectionItem<Model>;

   // это то что прикладники вернули на dragEnd
   // и после того как документ перетащили, то смотрим не нужно ли что-то подождать и если есть промис то ожидаем
   private _dragEndResult;

   constructor(private _useNewModel: boolean, protected _model: IModel) {}

   update(useNewModel: boolean, model: IModel) {
      this._useNewModel = useNewModel;
      this._model = model;
   }

   startDragNDrop(itemData, items, dragControlId, notifyDragStart) {
      const key = this._useNewModel ? itemData.getContents().getKey() : itemData.key;

      const dragKeyPosition = items.indexOf(key);
      // If dragged item is in the list, but it's not the first one, move
      // it to the front of the array
      if (dragKeyPosition > 0) {
         items.splice(dragKeyPosition, 1);
         items.unshift(key);
      }
      const dragStartResult = notifyDragStart(items);
      if (dragStartResult) {
         if (dragControlId) {
            dragStartResult.dragControlId = dragControlId;
         }
         this._draggingItem = itemData;
      }
      return dragStartResult;
   }

   handleMouseMove(itemData, nativeEvent, notifyChangeDragTarget) {
      // в плоской делать вроде тут нечего
   }

   handleMouseLeave() {
      this._unprocessedDragEnteredItem = null;
   }

   handleMouseEnter(
      event: SyntheticEvent<MouseEvent>,
      itemData: CollectionItem<Model>,
      notifyChangeDragTarget: Function
   ): void {
      this._unprocessedDragEnteredItem = itemData;
      this._processItemMouseEnterWithDragNDrop(itemData, notifyChangeDragTarget);
   }

   handleDragStart(dragObject, notifyChangeDragTarget: Function): void {
      if (this._useNewModel) {
         this._draggingEntity = dragObject.entity;
      } else {
         this._model.setDragEntity(dragObject.entity);
         this._model.setDragItemData(this._model.getItemDataByItem(this._draggingItem.dispItem));

         // Cобытие mouseEnter на записи может сработать до dragStart.
         // И тогда перемещение при наведении не будет обработано.
         // В таком случае обрабатываем наведение на запись сейчас.
         //TODO: убрать после выполнения https://online.sbis.ru/opendoc.html?guid=0a8fe37b-f8d8-425d-b4da-ed3e578bdd84
         if (this._unprocessedDragEnteredItem) {
            this._processItemMouseEnterWithDragNDrop(this._unprocessedDragEnteredItem, notifyChangeDragTarget);
         }
      }
   }

   handleDragEnter(dragObject, notifyDragEnter: Function) {
      if (
         dragObject && !this._useNewModel &&
         !this._model.getDragEntity() &&
         cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')
      ) {
         const dragEnterResult = notifyDragEnter(dragObject.entity);

         if (cInstance.instanceOfModule(dragEnterResult, 'Types/entity:Record')) {
            const draggingItemProjection = this._model._prepareDisplayItemForAdd(dragEnterResult);
            this._model.setDragItemData(this._model.getItemDataByItem(draggingItemProjection));
            this._model.setDragEntity(dragObject.entity);
         } else if (dragEnterResult === true) {
            this._model.setDragEntity(dragObject.entity);
         }
      }
   }

   handleDragLeave() {
      if (!this._useNewModel) {
         this._model.setDragTargetPosition(null);
      }
   }

   handleDragEnd(dragObject, notifyDragEnd) {
      if (!this._useNewModel) {
         const targetPosition = this._model.getDragTargetPosition();
         if (targetPosition) {
            this._dragEndResult = notifyDragEnd(dragObject.entity, targetPosition);
         }
      }
   }

   handleDocumentDragEnd(showIndicator: Function, hideIndicator: Function) {
      //Reset the state of the dragndrop after the movement on the source happens.
      if (this._dragEndResult instanceof Promise) {
         showIndicator();
         this._dragEndResult.addBoth(function() {
            this._resetDragFields();
            hideIndicator();
         });
      } else {
         this._resetDragFields();
      }
   }

   getSelectionForDragNDrop(selectedKeys, excludedKeys, dragKey) {
      let
         selected,
         excluded,
         dragItemIndex,
         isSelectAll;

      selected = cClone(selectedKeys) || [];
      isSelectAll = selected.indexOf(null) !== -1;
      dragItemIndex = selected.indexOf(dragKey);
      if (dragItemIndex !== -1) {
         selected.splice(dragItemIndex, 1);
      }
      if (!isSelectAll) {
         selected.unshift(dragKey);
      }

      excluded = cClone(excludedKeys) || [];
      dragItemIndex = excluded.indexOf(dragKey);
      if (dragItemIndex !== -1) {
         excluded.splice(dragItemIndex, 1);
      }

      return {
         selected: selected,
         excluded: excluded
      };
   }

   private _processItemMouseEnterWithDragNDrop(itemData: CollectionItem<Model>, notifyChangeDragTarget: Function): void {
      const dragEntity = this._useNewModel ? this._draggingEntity : this._model.getDragEntity();

      /*
         {
            data: CollectionItem<Model>,
            item: Model,
            index: number - индекс перетаскиваемого элемента
         }
         data.getContents() = item - и зачем хранить одну и ту инфу 2 раза я не понял
      */
      let dragPosition;
      if (dragEntity) {
         dragPosition = this._useNewModel ?
            { position: 'before', item: itemData.getContents() } :
            this._model.calculateDragTargetPosition(itemData);
         /* this._notify('changeDragTarget', [dragEntity, dragPosition.item, dragPosition.position]) */
         if (dragPosition && notifyChangeDragTarget(dragEntity, dragPosition) !== false) {
            if (!this._useNewModel) {
               this._model.setDragTargetPosition(dragPosition);
            }
         }
         this._unprocessedDragEnteredItem = null;
      }
   }

   private _resetDragFields() {
      if (this._useNewModel) {
         this._draggingEntity = null;
         this._draggingItem = null;
      } else {
         this._model.setDragTargetPosition(null);
         this._model.setDragItemData(null);
         this._model.setDragEntity(null);
      }
   }
}
