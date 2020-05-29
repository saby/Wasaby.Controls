import { FlatController } from './FlatController';
import { IDragPosition, ITreeController, ITreeItem, ITreeModel, TPosition } from './interface';
import { SyntheticEvent } from 'Vdom/Vdom';

const DRAG_MAX_OFFSET = 15,
      EXPAND_ON_DRAG_DELAY = 1000;

export default class TreeController extends FlatController implements ITreeController {
   private _expandOnDragData: ITreeItem;
   private _timeoutForExpandOnDrag;

   protected _unprocessedDragEnteredItem: ITreeItem;
   protected _model: ITreeModel;
   protected _avatarItem: ITreeItem;

   constructor(model: ITreeModel, canStartDragNDropOption: boolean|Function) {
      super(model, canStartDragNDropOption);
   }

   /**
    * Если водим по узлу, то в зависимости от того в какой части контрола мы находимся,
    * меняется позиция перемещаемого элемента
    * То есть, если мышка близко к верхней части, то элемент перемещаем перед текущим,
    * если по центру то на текущем, если ближе к низу, то после
    * @param itemData
    * @param event
    */
   getPositionRelativeNode(itemData: ITreeItem, event: SyntheticEvent<MouseEvent>): IDragPosition {
      if (!itemData.dispItem.isNode()) {
         return;
      }

      let dragTargetPosition;
      const dragTarget = event.target.closest('.js-controls-TreeView__dragTargetNode');

      if (dragTarget) {
         const dragTargetRect = dragTarget.getBoundingClientRect();
         const topOffset = event.nativeEvent.pageY - dragTargetRect.top;
         const bottomOffset = dragTargetRect.top + dragTargetRect.height - event.nativeEvent.pageY;

         if (topOffset < DRAG_MAX_OFFSET || bottomOffset < DRAG_MAX_OFFSET) {
            if (this._avatarItem) {
               const position = topOffset < DRAG_MAX_OFFSET ? 'before' : 'after';
               dragTargetPosition = this._calculateDragTargetPosition(itemData, position);
            }
         }
      }

      return dragTargetPosition;
   }

   startCountDownForExpandNode(itemData: ITreeItem, expandNode: Function): void {
      // проверяем что навели на узел, что для него уже не запущен timeout, что он не раскрыт
      // и что навели не на перетаскиваемый элемент
      if (itemData.item.get(itemData.nodeProperty) !== null
            && (!this._expandOnDragData || this._expandOnDragData !== itemData)
            && !itemData.isExpanded
            && this._avatarItem.key !== itemData.key) {
         this._clearTimeoutForExpandOnDrag();
         this._expandOnDragData = itemData;
         this._setTimeoutForExpandOnDrag(this._expandOnDragData, expandNode);
      }
   }

   stopCountDownForExpandNode(): void {
      this._clearTimeoutForExpandOnDrag();
   }

   protected _calculateDragTargetPosition(targetData: ITreeItem, position: TPosition): IDragPosition {
      let result: IDragPosition;

      //If you hover over the dragged item, and the current position is on the folder,
      //then you need to return the position that was before the folder.
      const prevDragTargetPosition = this._model.getPrevDragTargetPosition();
      if (this._avatarItem && this._avatarItem.index === targetData.index) {
         result = prevDragTargetPosition || null;
      } else if (targetData.dispItem.isNode()) {
         if (position === 'after' || position === 'before') {
            let startPosition: TPosition,
               // TODO dnd было this._expandedItems.indexOf(ItemsUtil.getPropertyValue(itemData.dispItem.getContents(), this._options.keyProperty))
               afterExpandedNode = position === 'after' && this._model.getExpandedItems().indexOf(targetData.dispItem.getContents().getKey()) !== -1;

            //The position should not change if the record is dragged from the
            //bottom/top to up/down and brought to the bottom/top of the folder.
            if (prevDragTargetPosition) {
               if (prevDragTargetPosition.index === targetData.index) {
                  startPosition = prevDragTargetPosition.position;
               } else {
                  startPosition = prevDragTargetPosition.index < targetData.index ? 'before' : 'after';
               }
            }

            if (position !== startPosition && !afterExpandedNode) {
               result = {
                  index: targetData.index,
                  item: targetData.item,
                  data: targetData,
                  position: position
               };
            }
         } else {
            result = {
               index: targetData.index,
               position: 'on',
               item: targetData.item,
               data: targetData
            };
         }
      } else {
         result = super._calculateDragTargetPosition(targetData);
      }

      return result;
   }

   private _setTimeoutForExpandOnDrag(itemData: ITreeItem, expandNode: Function): void {
      this._timeoutForExpandOnDrag = setTimeout(() => {
            expandNode(itemData);
         }, EXPAND_ON_DRAG_DELAY);
   }

   private _clearTimeoutForExpandOnDrag(): void {
      if (this._timeoutForExpandOnDrag) {
         clearTimeout(this._timeoutForExpandOnDrag);
         this._timeoutForExpandOnDrag = null;
      }
      this._expandOnDragData = null;
   }
}