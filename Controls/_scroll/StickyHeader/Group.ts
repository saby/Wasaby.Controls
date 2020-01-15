import {SyntheticEvent} from "Vdom/Vdom";
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {isStickySupport, getNextId, getOffset, POSITION, IOffset, IFixedEventData, TRegisterEventData} from 'Controls/_scroll/StickyHeader/Utils';
import template = require('wml!Controls/_scroll/StickyHeader/Group');

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

export default class Group extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _index: number = null;
    protected _isStickySupport: boolean = false;

    protected _fixed: boolean = false;

    protected _stickyHeadersIds: IHeadersIds = {
        top: [],
        bottom: []
    };
    protected _shadowVisible: boolean = false;

    protected _headers: IHeadersMap = {};
    protected _isRegistry: boolean = false;
    private _top: number;

    protected _beforeMount(options: IControlOptions): void {
        this._isStickySupport = isStickySupport();
        this._index = getNextId();
    }

    protected _afterMount(): void {
        this._notify('register', ['updateStickyShadow', this, this._updateStickyShadow], {bubbling: true});
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['updateStickyShadow', this], {bubbling: true});
    }

    getOffset(parentElement, position): number {
        return getOffset(parentElement, this._container, position);
    }

    get height(): number {
        // Group can be with style display: content. Use the height of the first header as the height of the group.
        const headersIds: number[] = Object.keys(this._headers);
        return headersIds.length ? this._headers[headersIds[0]].inst.height : 0;
    }

    set top(value: number) {
        for (var id in this._headers) {
            this._headers[id].inst.top = value;
        }
        this._top = value;
    }

    set bottom(value: number) {
        for (let id in this._headers) {
            this._headers[id].inst.bottom = value;
        }
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
            this._fixed = true;
            this._notifyFixed(fixedHeaderData);
        } else if (!fixedHeaderData.fixedPosition && this._fixed &&
            this._stickyHeadersIds.top.length === 0 && this._stickyHeadersIds.bottom.length === 0) {
            this._fixed = false;
            this._notifyFixed(fixedHeaderData);
        }
    }

    protected _updateStickyShadow(ids: []): void {
        if (ids.indexOf(this._index) !== -1) {
            this._shadowVisible = true;

            this._children.stickyHeaderShadow.start(this._stickyHeadersIds.top.concat(this._stickyHeadersIds.bottom));
        }
    }

    protected _stickyRegisterHandler(event: SyntheticEvent<Event>, data: TRegisterEventData, register: boolean): void {
        event.stopImmediatePropagation();
        if (register) {
            if (this._top) {
                data.inst.top = this._top;
            }
            this._headers[data.id] = data;

            // Register group after first header is registred
            if (!this._isRegistry) {
                this._notify('stickyRegister', [{
                    id: this._index,
                    inst: this,
                    position: data.position,
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

    private _notifyFixed(fixedHeaderData: IFixedEventData): void {
        this._notify(
            'fixed',
            [{
                id: this._index,
                offsetHeight: fixedHeaderData.offsetHeight,
                fixedPosition: fixedHeaderData.fixedPosition,
                prevPosition: fixedHeaderData.prevPosition,
                mode: fixedHeaderData.mode
            }],
            {bubbling: true}
        );
    }
}
