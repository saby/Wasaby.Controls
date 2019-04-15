import Control = require('Core/Control');
import template = require('wml!Controls/_scroll/StickyHeader/Controller/Controller');

// @ts-ignore

class Component extends Control {
    private _template: Function = template;

    private _headersHeight: object;

    // Register of all registered headers. Stores references to instances of headers.
    private _headers: object;
    // Ordered list of headers.
    private _headersStack: object;
    // The list of headers that are stuck at the moment.
    private _fixedHeadersStack: object;

    _beforeMount(options) {
        this._headersHeight = {
            top: 0,
            bottom: 0
        };
        this._headersStack = {
            top: [],
            bottom: []
        };
        this._fixedHeadersStack = {
            top: [],
            bottom: []
        };
        this._headers = {};
    }

    /**
     * Returns the tru if there is at least one fixed header.
     * @param position
     */
    hasFixed(position: string): boolean {
        return !!this._fixedHeadersStack[position].length;
    }

    getHeadersHeight(position: string): number {
        let height: number = 0;
        for (let headerId of this._headersStack[position]) {
            height += this._headers[headerId].inst.height
        }
        return height;
    }

    _stickyRegisterHandler(event, data: object, register: boolean) {
        if (register) {
            this._headers[data.id] = data;
            this._addToHeadersStack(data.id, data.position);
        } else {
            delete this._headers[data.id];
            this._removeFromHeadersStack(data.id, data.position);
        }
        event.stopImmediatePropagation();
    }

    /**
     * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event
     * @param {Controls/_scroll/StickyHeader/Types/InformationFixationEvent.typedef} fixedHeaderData
     * @private
     */
    _fixedHandler(event, fixedHeaderData) {
        this._updateFixationState(fixedHeaderData);

        // If the header is single, then it makes no sense to send notifications.
        // Thus, we prevent unnecessary force updates on receiving messages.
        if (Object.keys(this._headers).length < 2) {
            return;
        }
        this._children.stickyHeaderShadow.start([
            this._fixedHeadersStack.top[this._fixedHeadersStack.top.length - 1],
            this._fixedHeadersStack.bottom[this._fixedHeadersStack.bottom.length - 1]
        ]);

        event.stopImmediatePropagation();
    }

    _resizeHandler() {
        this._updateTopBottom();
    }

    /**
     * Update information about the fixation state.
     * @param {Controls/_scroll/StickyHeader/Types/InformationFixationEvent.typedef} data Data about the header that changed the fixation state.
     */
    private _updateFixationState(data: object) {
        if (!!data.fixedPosition) {
            this._fixedHeadersStack[data.fixedPosition].push(data.id);
            if (data.mode === 'stackable') {
                this._headersHeight[data.fixedPosition] += data.height;
            }
        } else if (!!data.prevPosition && this._fixedHeadersStack[data.prevPosition].indexOf(data.id) !== -1) {
            this._fixedHeadersStack[data.prevPosition].splice(this._fixedHeadersStack[data.prevPosition].indexOf(data.id), 1);
            if (data.mode === 'stackable') {
                this._headersHeight[data.prevPosition] -= data.height;
            }
        }
    }

    private _addToHeadersStack(id: number, position: string) {
        if (position === 'topbottom') {
            this._addToHeadersStack(id, 'top');
            this._addToHeadersStack(id, 'bottom');
            return;
        }
        //TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        let container = (this._container && this._container.get) ? this._container.get(0) : this._container;
        let index = this._headersStack[position].findIndex((headerId) => {
            return this._headers[headerId].inst.getOffset(container, position) < this._headers[id].inst.getOffset(container, position);
        });
        this._headersStack[position].splice(index + 1, 0, id);
        this._updateTopBottom();
    }

    private _removeFromHeadersStack(id: number, position: string) {
        var index = this._headersStack['top'].indexOf(id);
        if (index !== -1) {
            this._headersStack['top'].splice(index, 1);
        }
        index = this._headersStack['bottom'].indexOf(id);
        if (index !== -1) {
            this._headersStack['bottom'].splice(index, 1);
        }

        this._updateTopBottom();
    }

    private _updateTopBottom() {
        let offset = 0;
        for (let headerId of this._headersStack['top']) {
            this._headers[headerId].inst.top = offset;
            if (this._headers[headerId].mode === 'stackable') {
                offset += this._headers[headerId].inst.height;
            }
        }
        offset = 0;
        for (let headerId of this._headersStack['bottom']) {
            this._headers[headerId].inst.bottom = offset;
            if (this._headers[headerId].mode === 'stackable') {
                offset += this._headers[headerId].inst.height;
            }
        }
    }
}

export default Component;
