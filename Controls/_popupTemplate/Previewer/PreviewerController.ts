import Deferred = require('Core/Deferred');
import StickyController = require('Controls/_popupTemplate/Sticky/StickyController');
import {IPopupItem} from 'Controls/_popupTemplate/BaseController';
import 'css!theme?Controls/popupTemplate';

class PreviewerController extends StickyController.constructor {
    _openedPopupId: string|null = null;
    _destroyDeferred: object = {};
    TYPE: string = 'Previewer';

    elementCreated(item: IPopupItem, container: HTMLDivElement, id: string): boolean {
        /**
         * Only one window can be opened.
         */
        if (this._openedPopupId) {
            require('Controls/popup').Controller.remove(this._openedPopupId);
        }
        this._openedPopupId = id;
        return super.elementCreated.apply(this, arguments);
    }

    elementDestroyed(item: IPopupItem): boolean {
        if (item.id === this._openedPopupId) {
            this._openedPopupId = null;
        }

        this._destroyDeferred[item.id] = new Deferred();
        item.popupOptions.className = (item.popupOptions.className || '') + ' controls-PreviewerController_close';
        return this._destroyDeferred[item.id];
    }

    elementAnimated(item: IPopupItem): boolean {
        if (this._destroyDeferred[item.id]) {
            this._destroyDeferred[item.id].callback();
            delete this._destroyDeferred[item.id];
            return true;
        }
        return false;
    }

    needRestoreFocus(isActive: boolean): boolean {
        return isActive;
    }
}

export = new PreviewerController();
