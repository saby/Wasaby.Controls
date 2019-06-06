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
         minWidth: 0,
         maxWidth: 99999
      };
   }
}

export default ResizingLine;
