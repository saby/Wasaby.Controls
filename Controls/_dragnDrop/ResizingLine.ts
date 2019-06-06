import template = require('wml!Controls/_dragnDrop/ResizingLine/ResizingLine');

import * as Entity from './Entity';
import {Control, IControlOptions} from 'UI/Base';
import {ICoordinate} from 'Controls/interface';

export interface IContainerOptions extends IControlOptions {
   minWidth?: number;
   maxWidth?: number;
   direction?: string;
}

class ResizingLine extends Control<IContainerOptions, void> {
   protected _dragging: boolean = false;
   protected _styleArea: string = '';
   protected _template: Function = template;
   protected _theme: string[] = ['Controls/dragnDrop'];
   protected _offset: number;

   protected _beginDragHandler(event: SyntheticEvent): void {
      this._children.dragNDrop.startDragNDrop(new Entity({
         item: event.target
      }), event);
   }

   protected _borderStartDragHandler(): void {
      this._dragging = true;
   }

   protected _onDragHandler(event: SyntheticEvent, dragObject): void {
      const areaCoordinate: ICoordinate = {
         top: '0',
         bottom: '0',
         right: null,
         left: null
      };
      const width: number = this._container.offsetWidth;

      this._offset = null;

      if (dragObject.offset.x > 0) {
         if (this._options.direction === 'reverse') {
            areaCoordinate.left = '0';
            areaCoordinate.right = `${
               Math.max(this._options.minWidth, width - dragObject.offset.x)
               }px`;

            this._offset = Math.min(dragObject.offset.x, width - this._options.minWidth);
         } else {
            areaCoordinate.left = `${width}px`;
            areaCoordinate.right = `-${
               Math.min(this._options.maxWidth - width, dragObject.offset.x)
               }px`;

            this._offset = Math.min(dragObject.offset.x, this._options.maxWidth - width);
         }
      } else {
         if (this._options.direction === 'left') {
            areaCoordinate.right = `${width}px`;
            areaCoordinate.left = `${
               Math.max(width - this._options.maxWidth, dragObject.offset.x)
               }px`;

            this._offset = Math.max(dragObject.offset.x, width - this._options.maxWidth);
         } else {
            areaCoordinate.right = '0';
            areaCoordinate.left = `${
               Math.max(this._options.minWidth, width + dragObject.offset.x)
               }px`;

            this._offset = Math.max(dragObject.offset.x, this._options.minWidth - width);
         }
      }

      this._styleArea = `top:${areaCoordinate.top};right:${areaCoordinate.right};bottom:${areaCoordinate.bottom};left:${areaCoordinate.left};`;
   }

   protected _borderEndDragHandler(): void {
      this._dragging = false;
      this._notify('offset', [this._offset]);
   }

   static getDefaultOptions(): object {
      return {
         minWidth: 0,
         maxWidth: 99999
      };
   }
}

export default ResizingLine;
