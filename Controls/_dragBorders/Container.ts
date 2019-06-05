import template = require('wml!Controls/_dragBorders/Container/Container');

import {Entity} from 'Controls/dragnDrop';
import {Control, IControlOptions} from 'UI/Base';
import {IDraggableBordersOptions, IDraggableBorders, ICoordinate, Border} from 'Controls/interface';

export interface IContainerOptions extends IDraggableBordersOptions, IControlOptions {}

class Container extends Control<IContainerOptions, void> implements IDraggableBorders {
    protected _dragging: boolean = false;

    protected _styleArea: string = '';

    protected _template: Function = template;

    protected _theme: string[] = ['Controls/dragBorders'];

    '[Controls/_interface/IDraggableBorders]': true;

    protected _borderBeginDragHandler(event: SyntheticEvent): void {
        this._children.dragNDrop.startDragNDrop(new Entity({
            item: event.target
        }), event);
    }

    protected _borderStartDragHandler(): void {
        this._dragging = true;
    }

    protected _borderOnDragHandler(event: SyntheticEvent, dragObject): void {
        const areaCoordinate: ICoordinate = {
            top: '0',
            bottom: '0',
            right: null,
            left: null
        };
        const draggingBorders: Border = dragObject.entity._options.item.getAttribute('name');
        const width: number = this._container.offsetWidth;

        this._offset = {
            border: draggingBorders,
            value: null
        };

        if (dragObject.offset.x > 0) {
            if (draggingBorders === 'left') {
                areaCoordinate.left = '0';
                areaCoordinate.right = `${
                    Math.max(this._options.minWidth, width - dragObject.offset.x)
                }px`;

                this._offset.value = Math.min(dragObject.offset.x, width - this._options.minWidth);
            } else {
                areaCoordinate.left = `${width}px`;
                areaCoordinate.right = `-${
                    Math.min(this._options.maxWidth - width, dragObject.offset.x)
                }px`;

                this._offset.value = Math.min(dragObject.offset.x, this._options.maxWidth - width);
            }
        } else {
            if (draggingBorders === 'left') {
                areaCoordinate.right = `${width}px`;
                areaCoordinate.left = `${
                    Math.max(width - this._options.maxWidth, dragObject.offset.x)
                }px`;

                this._offset.value = Math.max(dragObject.offset.x, width - this._options.maxWidth);
            } else {
                areaCoordinate.right = '0';
                areaCoordinate.left = `${
                    Math.max(this._options.minWidth, width + dragObject.offset.x)
                }px`;

                this._offset.value = Math.max(dragObject.offset.x, this._options.minWidth - width);
            }
        }

        this._styleArea = `top:${areaCoordinate.top};right:${areaCoordinate.right};bottom:${areaCoordinate.bottom};left:${areaCoordinate.left};`;
    }

    protected _borderEndDragHandler(): void {
        this._dragging = false;
        this._notify('offset', [this._offset]);
    }

    static getDefaultOptions() {
        return {
            minWidth: 0,
            maxWidth: 99999
        };
    }
}

export default Container;
