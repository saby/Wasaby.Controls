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
   getIndexByKey(key: number|string): number;

   // это будет один метод в старой и новой модели, вроде это уже написано, надо заюзать
   getCollection();
   getItems();

   /*
      по идее все эти сеттеры и геттеры нужны только для старой модели, так как в новой модели это не хранится
      но вопрос: они влияют на версию, то есть это нужно доабвить в новую модель или как-то вытащить из старой
    */
   setDragTargetPosition(dragPosition): void;
   setDragItemData();
   setDragEntity(entity);

   getDragEntity();
   getDragItemData();
   getDragTargetPosition();
}

export interface IDragNDropListController {
   // TODO dnd нужно исправить интерфейс

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

   set draggingItem(val) { this._draggingItem = val; }

   set unprocessedDragEnteredItem(val) { this._unprocessedDragEnteredItem = val; }

   set dragEndResult(val) { this._dragEndResult = val; }

   get dragEntity() { return this._useNewModel ? this._draggingEntity : this._model.getDragEntity(); }

   get unprocessedDragEnteredItem() { return this._unprocessedDragEnteredItem; }

   get dragEndResult() { return this._dragEndResult; }

   // TODO dnd может в setter переделать когда модели будут совместимы по интерфейсу
   setDraggingItem(dragEntity, dragEnterResult = null) {
      let draggingItem;

      // TODO dnd какая-то хрень, не понимаю что тут делается
      if (cInstance.instanceOfModule(dragEnterResult, 'Types/entity:Record')) {
         draggingItem = this._model._prepareDisplayItemForAdd(dragEnterResult);
      } else {
         draggingItem = this._draggingItem.dispItem;

         if (dragEnterResult === true) {
            this._model.setDragEntity(dragEntity);
         }
      }

      if (this._useNewModel) {
         this._draggingEntity = dragEntity;
      } else {
         this._model.setDragItemData(this._model.getItemDataByItem(draggingItem));
         this._model.setDragEntity(dragEntity);
      }
   }

   getDragPosition(itemData) {
      const dragEntity = this.dragEntity;

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
      }
      return dragPosition;
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

   reset() {
      if (this._useNewModel) {
         this._draggingEntity = null;
         this._draggingItem = null;
      } else {
         this._model.setDragTargetPosition(null);
         this._model.setDragItemData(null);
         this._model.setDragEntity(null);
      }
   }

   /**
    * Сортировать список ключей элементов
    * Ключи сортируются по порядку, в котором они идут в списке
    * @param keys
    * @private
    */
   private _sortKeys(keys: number|string[]) {
      keys.sort((a, b) => {
         const indexA = this._model.getIndexByKey(a),
            indexB = this._model.getIndexByKey(b);
         return indexA > indexB ? 1 : -1
      });
   }
}
