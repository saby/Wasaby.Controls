interface IModel {
   calculateDragTargetPosition(itemData);
   setDragTargetPosition(dragPosition): void;
}

export default class Controller {
   private _useNewModel: boolean;
   private _model: IModel;
   private _draggingEntity;
   private _unprocessedDragEnteredItem;

   constructor() {}

   update() {}

   startDragNDrop(domEvent, itemData) {
      if (_private.canStartDragNDrop(domEvent, self._options, self._context?.isTouch?.isTouch)) {
         const key = self._options.useNewModel ? itemData.getContents().getKey() : itemData.key;

         //Support moving with mass selection.
         //Full transition to selection will be made by: https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
         const selection = _private.getSelectionForDragNDrop(self._options.selectedKeys, self._options.excludedKeys, key);
         selection.recursive = false;
         const recordSet = self._options.useNewModel ? self._listViewModel.getCollection() : self._listViewModel.getItems();

         // Ограничиваем получение перемещаемых записей до 100 (максимум в D&D пишется "99+ записей"), в дальнейшем
         // количество записей будет отдавать selectionController https://online.sbis.ru/opendoc.html?guid=b93db75c-6101-4eed-8625-5ec86657080e
         getItemsBySelection(selection, self._options.source, recordSet, self._options.filter, LIMIT_DRAG_SELECTION).addCallback((items) => {
            const dragKeyPosition = items.indexOf(key);
            // If dragged item is in the list, but it's not the first one, move
            // it to the front of the array
            if (dragKeyPosition > 0) {
               items.splice(dragKeyPosition, 1);
               items.unshift(key);
            }
            const dragStartResult = self._notify('dragStart', [items]);
            if (dragStartResult) {
               if (self._options.dragControlId) {
                  dragStartResult.dragControlId = self._options.dragControlId;
               }
               self._children.dragNDropController.startDragNDrop(dragStartResult, domEvent);
               self._draggingItem = itemData;
            }
         });
      }
   }

   handleDragStart() {}

   handleDragEnd() {}

   handleDragLeave() {}

   handleDragEnter() {}

   handleMouseMove() {}

   handleMouseEnter() {}

   handleMouseLeave() {}

   _canStartDragNDrop(domEvent: any, cfg: any, isTouch: boolean): boolean {
      return !isTouch &&
         (!cfg.canStartDragNDrop || cfg.canStartDragNDrop()) &&
         cfg.itemsDragNDrop &&
         !(domEvent.nativeEvent.button) &&
         !cfg.readOnly &&
         !domEvent.target.closest('.controls-DragNDrop__notDraggable');
   }

   _processItemMouseEnterWithDragNDrop(_, itemData): void {
      const dragEntity = this._useNewModel ? this._draggingEntity : this._model.getDragEntity();
      let dragPosition;
      if (dragEntity) {
         dragPosition = this._useNewModel ?
            { position: 'before', item: itemData.getContents() } :
            this._model.calculateDragTargetPosition(itemData);
         if (dragPosition && this._notify('changeDragTarget', [dragEntity, dragPosition.item, dragPosition.position]) !== false) {
            if (this._useNewModel) {
               this._model = dragPosition.item;
            } else {
               this._model.setDragTargetPosition(dragPosition);
            }
         }
         this._unprocessedDragEnteredItem = null;
      }
   }
}
