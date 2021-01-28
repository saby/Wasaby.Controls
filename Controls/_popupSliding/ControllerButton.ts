import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/ControllerButton/ControllerButton';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IDragObject} from 'Controls/dragnDrop';

export default class Template extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _startDragNDrop(event: SyntheticEvent<Event>): void {
        this._children.dragNDrop.startDragNDrop(null, event);
    }

    protected _documentDragEndHandler(event: SyntheticEvent<Event>): void {
        event.stopPropagation();
        this._notify('dragEnd', []);
    }

    protected _dragMoveHandler(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        event.stopPropagation();
        this._notify('dragMove', [dragObject]);
    }

    static _theme: string[] = ['Controls/popupSliding'];
}
