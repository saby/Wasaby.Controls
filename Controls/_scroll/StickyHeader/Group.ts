import StickyHeaderContext = require('Controls/_scroll/StickyHeader/Context');
import {SyntheticEvent} from "Vdom/Vdom";
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {isStickySupport, getNextId, getOffset, POSITION, IOffset, IFixedEventData, TRegisterEventData} from 'Controls/_scroll/StickyHeader/Utils';
import template = require('wml!Controls/_scroll/StickyHeader/Group');
import {SHADOW_VISIBILITY} from './_StickyHeader';

/**
 * Allows you to combine sticky headers with the same behavior. It is necessary if you need to make
 * several headers fixed at the same level, which should simultaneously stick and stick out.
 * Behaves like one fixed header.
 *
 * @extends Core/Control
 * @class Controls/_scroll/StickyHeader/Group
 * @author Красильников А.С.
 * @public
 */

/**
 * @name Controls/_scroll/StickyHeader/Group#content
 * @cfg {Function} Content in which several fixed headers are inserted.
 */

/**
 * @event Controls/_scroll/StickyHeader/Group#fixed Change the fixation state.
 * @param {Vdom/Vdom:SyntheticEvent} event Event descriptor.
 * @param {Controls/_scroll/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
 */

interface IHeaderData extends TRegisterEventData {
    top: number;
    bottom: number;
}

interface IHeadersMap {
    [key: string]: IHeaderData;
}

interface IHeadersIds {
    top: number[];
    bottom: number[];
}

interface IOffsetCache {
    [key: string]: number;
}

export default class Group extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _index: number = null;
    protected _isStickySupport: boolean = false;

    protected _fixed: boolean = false;
    protected _cachedOffset: IOffsetCache = {};

    protected _stickyHeadersIds: IHeadersIds = {
        top: [],
        bottom: []
    };
    protected _offset: IOffset = {
        top: 0,
        bottom: 0
    };
    protected _shadowVisible: boolean = false;

    protected _headers: IHeadersMap = {};
    protected _isRegistry: boolean = false;

    private _delayedHeaders: number[] = [];

    private _updateContext(position: POSITION, value: number) {
        this._stickyHeaderContext[position] = value;
        this._stickyHeaderContext.updateConsumers();
    }

    protected _getChildContext() {
        return {
            stickyHeader: this._stickyHeaderContext
        };
    }

    protected _beforeMount(options: IControlOptions, context): void {
        this._isStickySupport = isStickySupport();
        this._index = getNextId();
        this._stickyHeaderContext = new StickyHeaderContext({
            shadowPosition: context?.stickyHeader?.shadowPosition
        });
    }

    protected _beforeUpdate(options: IControlOptions, context): void {
        this._stickyHeaderContext.shadowPosition = context?.stickyHeader?.shadowPosition;
        this._stickyHeaderContext.updateConsumers();
    }

    protected _afterMount(): void {
        this._notify('register', ['updateStickyShadow', this, this._updateStickyShadow], {bubbling: true});
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['updateStickyShadow', this], {bubbling: true});
    }

    getOffset(parentElement: HTMLElement, position: POSITION): number {
        return getOffset(parentElement, this._container, position);
    }

    resetSticky(): void {
        for (const id in this._headers) {
            this._headers[id].inst.resetSticky();
        }
    }

    restoreSticky(): void {
        for (const id in this._headers) {
            this._headers[id].inst.restoreSticky();
        }
    }

    get height(): number {
        // Group can be with style display: content. Use the height of the first header as the height of the group.
        const headersIds: number[] = Object.keys(this._headers);
        return headersIds.length ? this._headers[headersIds[0]].inst.height : 0;
    }

    set top(value: number) {
        this._setOffset(value, POSITION.top);
    }

    set bottom(value: number) {
        this._setOffset(value, POSITION.bottom);
    }

    get shadowVisibility(): SHADOW_VISIBILITY {
        for (let id in this._headers) {
            if (this._headers[id].inst.shadowVisibility === SHADOW_VISIBILITY.visible) {
                return SHADOW_VISIBILITY.visible;
            }
        }
        return SHADOW_VISIBILITY.hidden;
    }

    private _setOffset(value: number, position: POSITION): void {
        for (let id in this._headers) {
            const positionValue: number = this._headers[id][position] + value;
            this._headers[id].inst[position] = positionValue;
            this._updateContext(position, positionValue);
        }
        this._offset[position] = value;
    }

    protected _fixedHandler(event: SyntheticEvent<Event>, fixedHeaderData: IFixedEventData): void {
        event.stopImmediatePropagation();
        if (!!fixedHeaderData.fixedPosition) {
            this._stickyHeadersIds[fixedHeaderData.fixedPosition].push(fixedHeaderData.id);
            if (this._shadowVisible === true) {
                this._children.stickyHeaderShadow.start(this._stickyHeadersIds[fixedHeaderData.fixedPosition]);
            }
        } else if (!!fixedHeaderData.prevPosition && this._stickyHeadersIds[fixedHeaderData.prevPosition].indexOf(fixedHeaderData.id) > -1) {
            this._stickyHeadersIds[fixedHeaderData.prevPosition].splice(this._stickyHeadersIds[fixedHeaderData.prevPosition].indexOf(fixedHeaderData.id), 1);
        }

        if (!!fixedHeaderData.fixedPosition && !this._fixed) {
            if (!fixedHeaderData.isFakeFixed) {
                this._fixed = true;
            }
            this._notifyFixed(fixedHeaderData);
        } else if (!fixedHeaderData.fixedPosition && this._fixed &&
                this._stickyHeadersIds.top.length === 0 && this._stickyHeadersIds.bottom.length === 0) {
            if (!fixedHeaderData.isFakeFixed) {
                this._fixed = false;
            }
            this._notifyFixed(fixedHeaderData);
        }
    }

    protected _updateStickyShadow(ids: number[]): void {
        var shadowVisible = ids.indexOf(this._index) !== -1;
        if (this._shadowVisible !== shadowVisible) {
            this._shadowVisible = shadowVisible;
            if (shadowVisible) {
               this._children.stickyHeaderShadow.start(this._stickyHeadersIds.top.concat(this._stickyHeadersIds.bottom));
            } else {
               this._children.stickyHeaderShadow.start([]);
            }
        }
    }

    protected _stickyRegisterHandler(event: SyntheticEvent<Event>, data: TRegisterEventData, register: boolean): void {
        event.stopImmediatePropagation();
        if (register) {
            this._headers[data.id] = {
                ...data,
                top: 0,
                bottom: 0
            };

            this._updateTopBottom(data);

            // Register group after first header is registered
            if (!this._isRegistry) {
                this._notify('stickyRegister', [{
                    id: this._index,
                    inst: this,
                    container: this._container,position: data.position,
                    mode: data.mode,
                }, true], {bubbling: true});
                this._isRegistry = true;
            }
        } else {
            delete this._headers[data.id];

            // Unregister group after last header is unregistered
            if (!Object.keys(this._headers).length) {
                this._notify('stickyRegister', [{id: this._index}, false], {bubbling: true});
                this._isRegistry = false;
            }
        }
    }

    private _updateTopBottom(data: TRegisterEventData): void {
        // Проблема в том, что чтобы узнать положение заголовка относительно группы нам надо снять position: sticky.
        // Это приводит к layout. И так для каждой ячейки для заголвков в таблице. Создадим список всех заголовков
        // которые надо обсчитать в этом синхронном участке кода и обсчитаем их за раз в микротаске,
        // один раз сняв со всех загоовков position: sticky.
        if (!this._updateTopBottomDelayed.length) {
            Promise.resolve().then(this._updateTopBottomDelayed.bind(this));
        }
        this._delayedHeaders.push(data.id);
    }

    private _updateTopBottomDelayed(): void {
        let
            data: TRegisterEventData,
            offset: number;

        // Сбрасываем position: sticky у всех заголовков. Мы могли бы сбрасывать его только у this._delayedHeaders
        // заголовков. Но в таблицах заголовки лежат в контенере с display: contents и нельзя узнать его положение.
        // По этому положение такой группы определяется по самому верхниму и самому нижнему ребенку.
        // По этому приходится сбрасывать position: sticky у всех заголовков.
        this.resetSticky();

        for (const id of this._delayedHeaders) {
            data = this._headers[id];
            for (const position of [POSITION.top, POSITION.bottom]) {
                if (data.inst._options.position.indexOf(position) !== -1) {
                    offset = data.inst.getOffset(this._container, position);
                    this._headers[data.id][position] = offset;
                    const positionValue: number = this._offset[position] + offset;
                    data.inst[position] = positionValue;
                    this._updateContext(position, positionValue);
                }
            }
        }

        this.restoreSticky();

        this._delayedHeaders = [];
    }

    private _notifyFixed(fixedHeaderData: IFixedEventData): void {
        this._notify(
            'fixed',
            [{
                ...fixedHeaderData,
                id: this._index
            }],
            {bubbling: true}
        );
    }

    static contextTypes(): {} {
        return {
            stickyHeader: StickyHeaderContext
        };
    }
}
