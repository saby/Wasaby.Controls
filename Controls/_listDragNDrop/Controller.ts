import cClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');``
import { CollectionItem } from "Controls/display";
import { SyntheticEvent } from "Vdom/Vdom";
import { Model } from "Types/entity";
import { ItemsEntity } from "Controls/dragnDrop";

interface IModel {
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

export default class Controller {
   private _useNewModel: boolean; // TODO потом избавиться
   private _model: IModel;

   // это то что перетаскиваем, прикладники сверху сюда что-то могут положить,
   // но обязательно есть items - список перетаскиваемых элементов
   private _draggingEntity: ItemsEntity;

   // элемент который перетаскивают, наверное это фантомный элемент
   private _draggingItem: CollectionItem<Model>;

   // этот элемент тут запоминается, пока на нем стрелка мыши
   // и после dragStart этот элемент берется как перетаскиваемый и здесь обнуляется
   private _unprocessedDragEnteredItem;

   // это то что прикладники вернули на dragEnd
   // и после того как документ перетащили, то смотрим не нужно ли что-то подождать и если есть промис то ожидаем
   private _dragEndResult;

   set draggingItem(draggingItem) { this._draggingItem = draggingItem; }
   set unprocessedDragEnteredItem(item) { this._unprocessedDragEnteredItem = item; }

   constructor() {}

   update() {}

   handleMouseEnter(
      event: SyntheticEvent<MouseEvent>,
      itemData: CollectionItem<Model>,
      notifyChangeDragTarget: Function
   ): void {
      this._unprocessedDragEnteredItem = itemData;
      this.processItemMouseEnterWithDragNDrop(itemData, notifyChangeDragTarget);
   }

   // TODO может изменить название
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
            this.processItemMouseEnterWithDragNDrop(this._unprocessedDragEnteredItem, notifyChangeDragTarget);
         }
      }
   }

   handleDragLeave() {
      if (!this._useNewModel) {
         this._model.setDragTargetPosition(null);
      }
   }

   handleDragEnter(dragObject, notifyDragEnter: Function) {
      if (
         dragObject && !this._useNewModel &&
         !this._model.getDragEntity() &&
         cInstance.instanceOfModule(dragObject.entity, 'Controls/dragnDrop:ItemsEntity')
      ) {
         const dragEnterResult = notifyDragEnter(dragObject.entity); // this._notify('dragEnter', [dragObject.entity]);

         if (cInstance.instanceOfModule(dragEnterResult, 'Types/entity:Record')) {
            const draggingItemProjection = this._model._prepareDisplayItemForAdd(dragEnterResult);
            this._model.setDragItemData(this._model.getItemDataByItem(draggingItemProjection));
            this._model.setDragEntity(dragObject.entity);
         } else if (dragEnterResult === true) {
            this._model.setDragEntity(dragObject.entity);
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

   // TODO понять шо це такое, может можно переписать как-то лучше
   // вроде как это проверяет не перетаскивается ли сейчас элемент
   isDragging(): boolean {
      // TODO Make available for new model as well
      return !this._useNewModel && (this._model.getDragEntity() || this._model.getDragItemData());
   }

   processItemMouseEnterWithDragNDrop(itemData: CollectionItem<Model>, notifyChangeDragTarget: Function): void {
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

   _resetDragFields() {
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
