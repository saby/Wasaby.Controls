import Deferred = require('Core/Deferred');
import StickyController = require('Controls/_popupTemplate/Sticky/StickyController');
import 'css!theme?Controls/popupTemplate';

let PreviewerController = StickyController.constructor.extend({
    _openedPopupId: null,

    _destroyDeferred: {},

    elementCreated(element, container, id) {
        /**
         * Only one window can be opened.
         */
        if (this._openedPopupId) {
            require('Controls/popup').Controller.remove(this._openedPopupId);
        }
        this._openedPopupId = id;

        return PreviewerController.superclass.elementCreated.apply(this, arguments);
    },

    elementDestroyed(item) {
        if (item.id === this._openedPopupId) {
            this._openedPopupId = null;
        }

        this._destroyDeferred[item.id] = new Deferred();

        item.popupOptions.className = (item.popupOptions.className || '') + ' controls-PreviewerController_close';

        return this._destroyDeferred[item.id];
    },

    elementAnimated(item) {
        if (this._destroyDeferred[item.id]) {
            this._destroyDeferred[item.id].callback();
            delete this._destroyDeferred[item.id];
        }
    },
    needRestoreFocus(isActive) {
        return isActive;
    },
    TYPE: 'Previewer'
});

export = new PreviewerController();

