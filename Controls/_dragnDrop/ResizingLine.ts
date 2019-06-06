import template = require('wml!Controls/_dragnDrop/ResizingLine/ResizingLine');

import * as Entity from './Entity';
import {Control, IControlOptions} from 'UI/Base';

export interface IContainerOptions extends IControlOptions {
   maxOffset?: number;
   direction?: string;
}

interface IResizingLineCoords {
   cOffset: number;
   cLeft: string;
   cRight: string;
}

/*TODO Kingo*/
/**
 * Контрол, позволяющий визуально отображать процесс изменения других контролов при помощи перемещения мышью
 *
 *
 * @class Controls/_dragnDrop/ResizingLine
 * @extends Core/Control
 * @control
 * @public
 * @author Журавлев М.С.
 * @category DragnDrop
 * @demo Controls-demo/ResizingLine/ResizingLine
 */

/**
 * @name Controls/_dragnDrop/ResizingLine#maxOffset
 * @cfg {Number} Максимальное значение сдвига при изменении значения размера
 * @default 1000
 * @remark
 * Сдвиге больше указанного визуально отображаться не будет
 */

/**
 * @name Controls/_toggle/Checkbox#direction
 * @cfg {String} Задает направление оси для сдвига
 * @variant direct Прямое направление. Слева направо
 * @variant reverse Обратное направление. Справа налево
 * @remark
 * Влияет на то, каким будет результат события offset. Если сдвиг идет вдоль направления оси, offset положительный. Если против, то отрицательный
 * @see event offset()
 */

/**
 * @event Controls/_toggle/Checkbox#offset Происходит после перетаскивания мыши, когда клавиша мыши отпущена
 * @param {Number|null} Значение сдвига
 * @remark Зависит от направления оси
 * @see direction
 */
class ResizingLine extends Control<IContainerOptions, void> {
   protected _dragging: boolean = false;
   protected _styleArea: string = '';
   protected _template: Function = template;
   protected _theme: string[] = ['Controls/dragnDrop'];
   protected _offset: number;
   protected _width: number;

   protected _afterMount(): void {
      this._width = this._container.get ? this._container.get(0).clientWidth : this._container.clientWidth;
   }

   protected _beginDragHandler(event: SyntheticEvent): void {
      this._children.dragNDrop.startDragNDrop(new Entity({
         itemId: this.getInstanceId()
      }), event);
   }

   protected _onStartDragHandler(): void {
      this._dragging = true;
   }

   private _calculateCoordinates(offsetX: number, maxOffset: number,
                                 controlWidth: number, direction: string): IResizingLineCoords {
      let offset: number = null;
      let left: string;
      let right: string;

      if (offsetX > 0) {
         if (direction === 'reverse') {
            offset = -Math.min(Math.abs(offsetX), maxOffset);
            left = '0';
            right = offset + 'px';
         } else {
            offset = Math.min(Math.abs(offsetX), maxOffset);
            left = controlWidth + 'px';
            right = -offset + 'px';
         }
      } else {
         if (direction === 'reverse') {
            offset = Math.min(Math.abs(offsetX), maxOffset);
            left = -offset + 'px';
            right = controlWidth + 'px';
         } else {
            offset = -Math.min(Math.abs(offsetX), maxOffset);
            right = '0';
            left = offset + 'px';
         }
      }
      return {
         cOffset: offset,
         cLeft: left,
         cRight: right
      };
   }

   protected _onDragHandler(event: SyntheticEvent, dragObject): void {
      const coords: IResizingLineCoords = this._calculateCoordinates(
         dragObject.offset.x,
         this._options.maxOffset,
         this._width, this._options.direction
      );

      this._offset = coords.cOffset;
      this._styleArea = 'top:' + 0 + ';right:' + coords.cRight + ';bottom:' + 0 + ';left:' + coords.cLeft + ';';
   }

   protected _onEndDragHandler(e, dragObject): void {
      this._dragging = false;
      if (dragObject.entity._options.itemId === this.getInstanceId()) {
         this._notify('offset', [this._offset]);
      }
   }

   static getDefaultOptions(): object {
      return {
         maxOffset: 1000
      };
   }
}

export default ResizingLine;
