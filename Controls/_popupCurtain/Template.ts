import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_popupCurtain/Template/Template';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IDragObject} from 'Controls/dragnDrop';
import {ICurtainTemplateOptions} from 'Controls/_popupCurtain/interface/ICurtainTemplate';

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupCurtain/Template
 * @implements Controls/_interface/IContrastBackground
 * @public
 * @author Красильников А.С.
 */
export default class Template extends Control<ICurtainTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _dragStartScrollHeight: number;
    protected _touchDragOffset: IDragObject['offset'];
    protected _showScrollContainer: boolean;
    protected _currentTouchYPosition: number = null;

    protected _dragEndHandler(): void {
        this._notifyDragEnd();
    }

    protected _dragMoveHandler(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        this._notifyDragStart(dragObject.offset);
    }

    /**
     * Запоминаем начальную позицию тача, чтобы считать offset от нее
     * @param {<TouchEvent>} event
     * @private
     */
    protected _touchStartHandler(event: SyntheticEvent<TouchEvent>): void {
        this._currentTouchYPosition = event.nativeEvent.targetTouches[0].clientY;
    }

    /**
     * Раворот шторки через свайп, делается аналогично, через события dragStart/dragEnd
     * @param {<TouchEvent>} event
     * @private
     */
    protected _touchMoveHandler(event: SyntheticEvent<TouchEvent>): void {
        const currentTouchY = event.nativeEvent.changedTouches[0].clientY;
        const offsetY = currentTouchY - this._currentTouchYPosition;
        this._currentTouchYPosition = currentTouchY;

        // Аналогичный drag'n'drop функционал. Собираем общий offset относительно начальной точки тача.
        if (this._touchDragOffset) {
            this._touchDragOffset.y += offsetY;
        } else {
            this._touchDragOffset = {
                x: 0,
                y: offsetY
            };
        }
        event.stopPropagation();
        this._notifyDragStart(this._touchDragOffset);
    }

    protected _touchEndHandler(): void {
        if (this._touchDragOffset) {
            this._notifyDragEnd();
            this._touchDragOffset = null;
        }
    }

    private _notifyDragStart(offset: IDragObject['offset']): void {
        /* Запоминаем высоту скролла, чтобы при увеличении проверять на то,
           что не увеличим шторку больше, чем есть контента */
        if (!this._dragStartScrollHeight) {
            this._dragStartScrollHeight =
                this._container.querySelector('.controls-Curtain__scrollContainer').clientHeight;
        }
        this._notify('popupDragStart', [
            this._getDragOffsetWithOverflowChecking(offset)
        ], {bubbling: true});
    }

    protected _notifyDragEnd(): void {
        this._notify('popupDragEnd', [], {bubbling: true});
        this._dragStartScrollHeight = null;
    }

    private _getDragOffsetWithOverflowChecking(dragOffset: IDragObject['offset']): IDragObject['offset'] {
        let offsetY = dragOffset.y;
        const contentHeight = this._children.customContent.clientHeight;

        // В зависимости от позиции высоту шторки увеличивает либо положительный, либо отрицательный сдвиг по оси "y"
        const realHeightOffset = this._options.position === 'top' ? offsetY : -offsetY;
        const scrollContentOffset = contentHeight - this._dragStartScrollHeight;
        if (realHeightOffset > scrollContentOffset) {
            offsetY = this._options.position === 'top' ? scrollContentOffset : -scrollContentOffset;
        }
        return {
            x: dragOffset.x,
            y: offsetY
        };
    }

    static _theme: string[] = ['Controls/popupCurtain'];
    static getDefaultOptions(): ICurtainTemplateOptions {
        return {
            showControlButton: true,
            contrastBackground: true,
            position: 'bottom'
        };
    }
}
