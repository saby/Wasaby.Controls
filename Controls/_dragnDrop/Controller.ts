import cClone = require('Core/core-clone');
import cInstance = require('Core/core-instance');``
import getItemsBySelection = require('Controls/Utils/getItemsBySelection');
import { CollectionItem } from "Controls/display";
import { SyntheticEvent } from "Vdom/Vdom";
import { Model } from "Types/entity";

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

const LIMIT_DRAG_SELECTION = 100;

export default class Controller {
   private _useNewModel: boolean; // TODO потом избавиться
   private _model: IModel;
   private _draggingEntity;
   private _draggingItem: CollectionItem<Model>;
   private _unprocessedDragEnteredItem;
   private _dragNDropContainer;
   private _itemsDragNDrop;
   private _dragEndResult;
   private _draggingTargetItem;

   constructor() {}

   update() {}

   startDragNDrop(domEvent, itemData: CollectionItem<Model>, selectedKeys, excludedKeys, source, filter, dragControlId, notifyDragStart: Function) {
      const key = this._useNewModel ? itemData.getContents().getKey() : itemData.key;

      //Support moving with mass selection.
      //Full transition to selection will be made by: https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
      const selection = this._getSelectionForDragNDrop(selectedKeys, excludedKeys, key);
      selection.recursive = false;
      const recordSet = this._useNewModel ? this._model.getCollection() : this._model.getItems();

      // Ограничиваем получение перемещаемых записей до 100 (максимум в D&D пишется "99+ записей"), в дальнейшем
      // количество записей будет отдавать selectionController https://online.sbis.ru/opendoc.html?guid=b93db75c-6101-4eed-8625-5ec86657080e
      getItemsBySelection(selection, source, recordSet, filter, LIMIT_DRAG_SELECTION).addCallback((items) => {
         const dragKeyPosition = items.indexOf(key);
         // If dragged item is in the list, but it's not the first one, move
         // it to the front of the array
         if (dragKeyPosition > 0) {
            items.splice(dragKeyPosition, 1);
            items.unshift(key);
         }
         const dragStartResult = notifyDragStart(items); // self._notify('dragStart', [items]);
         if (dragStartResult) {
            if (dragControlId) {
               dragStartResult.dragControlId = dragControlId;
            }
            // TODO может аргументом передавать, так как только тут используется
            // а когда контроллер будем создавать в beforeMount он же еще может быть не создан вроде
            this._dragNDropContainer.startDragNDrop(dragStartResult, domEvent);
            this._draggingItem = itemData;
         }
      });
   }

   handleMouseMove(itemData: CollectionItem<Model>) : boolean {
      if (
         !this._useNewModel &&
         (!this._itemsDragNDrop || !this._model.getDragEntity() && !this._model.getDragItemData()) &&
         !this._showActions
      ) {
         // TODO гавно, надо подумать. Я планировал возвращать значение для notifyIfDragging,
         // ак как все проверки связаны с драг, но нужны еще менять _showActions
         this._showActions = true;
      }

      return this._isDragging();
   }

   handleMouseEnter(
      event: SyntheticEvent<MouseEvent>,
      itemData: CollectionItem<Model>,
      notifyChangeDragTarget: Function
   ): void {
      if (this._itemsDragNDrop) {
         this._unprocessedDragEnteredItem = itemData;
         this._processItemMouseEnterWithDragNDrop(itemData, notifyChangeDragTarget);
      }
   }

   handleMouseLeave(): boolean {
      if (this._itemsDragNDrop) {
         this._unprocessedDragEnteredItem = null;
      }

      return this._isDragging();
   }

   handleDragStart(event, dragObject, notifyChangeDragTarget: Function): void {
      if (this._useNewModel) {
         this._draggingEntity = dragObject.entity;
      } else {
         this._model.setDragEntity(dragObject.entity);
         this._model.setDragItemData(this._model.getItemDataByItem(this._draggingItem.dispItem));

         // Cобытие mouseEnter на записи может сработать до dragStart.
         // И тогда перемещение при наведении не будет обработано.
         // В таком случае обрабатываем наведение на запись сейчас.
         //
         //TODO: убрать после выполнения https://online.sbis.ru/opendoc.html?guid=0a8fe37b-f8d8-425d-b4da-ed3e578bdd84
         if (this._unprocessedDragEnteredItem) {
            this._processItemMouseEnterWithDragNDrop(this._unprocessedDragEnteredItem, notifyChangeDragTarget);
         }
      }
   }

   handleDragEnd(dragObject, notifyDragEnd: Function) {
      if (this._itemsDragNDrop) {
         if (!this._useNewModel) {
            var targetPosition = this._model.getDragTargetPosition();
            if (targetPosition) {
               this._dragEndResult = notifyDragEnd(dragObject.entity, targetPosition.item, targetPosition.position);
               // this._notify('dragEnd', [dragObject.entity, targetPosition.item, targetPosition.position]);
            }
         }
      }
   }

   handleDragLeave() {
      if (this._useNewModel) {
         this._draggingTargetItem = null;
      } else {
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

   _resetDragFields() {
      if (this._useNewModel) {
         this._draggingEntity = null;
         this._draggingItem = null;
         this._draggingTargetItem = null;
      } else {
         this._model.setDragTargetPosition(null);
         this._model.setDragItemData(null);
         this._model.setDragEntity(null);
      }
   }

   _processItemMouseEnterWithDragNDrop(itemData: CollectionItem<Model>, notifyChangeDragTarget: Function): void {
      const dragEntity = this._useNewModel ? this._draggingEntity : this._model.getDragEntity();
      let dragPosition;
      if (dragEntity) {
         dragPosition = this._useNewModel ?
            { position: 'before', item: itemData.getContents() } :
            this._model.calculateDragTargetPosition(itemData);
         /* this._notify('changeDragTarget', [dragEntity, dragPosition.item, dragPosition.position]) */
         if (dragPosition && notifyChangeDragTarget(dragEntity, dragPosition.item, dragPosition.position) !== false) {
            if (this._useNewModel) {
               this._model = dragPosition.item;
            } else {
               this._model.setDragTargetPosition(dragPosition);
            }
         }
         this._unprocessedDragEnteredItem = null;
      }
   }

   _getSelectionForDragNDrop(selectedKeys, excludedKeys, dragKey) {
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

   // TODO понять шо це такое
   _isDragging(): boolean {
      // TODO Make available for new model as well
      return !this._useNewModel && (this._model.getDragEntity() || this._model.getDragItemData()) && this._itemsDragNDrop;
   }
}
