import {mixin} from 'Types/util';
import {IVersionable, VersionableMixin} from 'Types/entity';
import {SCROLL_POSITION} from '../Utils/Scroll';
import {IScrollState} from '../Utils/ScrollState';
import {IArrowState} from '../../_paging/Paging';
/**
 * @typedef {String} TPagingModeScroll
 * @variant hidden Предназначен для отключения отображения пейджинга в реестре.
 * @variant basic Предназначен для пейджинга в реестре с подгрузкой по скроллу.
 * @variant edge Предназначен для пейджинга с отображением одной команды прокрутки. Отображается кнопка в конец, либо в начало, в зависимости от положения.
 * @variant end Предназначен для пейджинга с отображением одной команды прокрутки. Отображается только кнопка в конец.
 */
export type TPagingModeScroll = 'hidden' | 'basic' | 'edge' | 'end';

export default class PagingModel extends mixin<VersionableMixin>(VersionableMixin) implements IVersionable {
    readonly '[Types/_entity/VersionableMixin]': true;

    private _arrowState: IArrowState = {};
    private _isVisible: boolean = false;
    private _position: SCROLL_POSITION;
    private _pagingMode: TPagingModeScroll = 'hidden';
    private _showEndButton: boolean = false;

    update(scrollState: IScrollState): void {
        if (this._position !== scrollState.verticalPosition) {
            this._position = scrollState.verticalPosition;
            if (scrollState.verticalPosition === SCROLL_POSITION.START) {
                this._arrowState = {
                    begin: 'readonly',
                    prev: 'readonly',
                    next: 'visible',
                    end: 'visible'
                };
            } else if (scrollState.verticalPosition === SCROLL_POSITION.END) {
                this._arrowState = {
                    begin: 'visible',
                    prev: 'visible',
                    next: 'readonly',
                    end: 'readonly'
                };
            } else {
                this._arrowState = {
                    begin: 'visible',
                    prev: 'visible',
                    next: 'visible',
                    end: 'visible'
                };
            }
            if (this.pagingMode === 'numbers') {
                this._arrowState.prev = 'hidden';
                this._arrowState.next = 'hidden';
                this._showEndButton = true;
            }
            if (this._isVisible) {
                this._nextVersion();
            }
        }
    }

    set isVisible(value: boolean) {
        if (value !== this._isVisible) {
            this._isVisible = value;
            this._nextVersion();
        }
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    get arrowState(): IArrowState {
        switch (this.pagingMode) {
            case 'edge':
                this. _arrowState.prev = 'hidden';
                this._arrowState.next = 'hidden';
                if (this._arrowState.end === 'visible') {
                    this._arrowState.begin = 'hidden';
                    this._showEndButton = true;
                } else if (this._arrowState.begin === 'visible') {
                    this._arrowState.end = 'hidden';
                }
                break;

            case 'end':
                this._arrowState.prev = 'hidden';
                this._arrowState.next = 'hidden';
                this._arrowState.begin = 'hidden';
                if (this._arrowState.end === 'visible') {
                    this._showEndButton = true;
                } else {
                    this._arrowState.end = 'hidden';
                }
                break;
        }
        return this._arrowState;
    }

    get showEndButton(): boolean {
        return this._showEndButton;
    }

    set pagingMode(pagingMode: TPagingModeScroll): void {
        this._pagingMode = pagingMode;
    }

    get pagingMode(): TPagingModeScroll {
        return this._pagingMode || 'basic';
    }
}
