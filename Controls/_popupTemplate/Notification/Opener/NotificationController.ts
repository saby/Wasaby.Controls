import Deferred = require('Core/Deferred');
import collection = require('Types/collection');
import BaseController = require('Controls/_popupTemplate/BaseController');
import NotificationStrategy = require('Controls/_popupTemplate/Notification/Opener/NotificationStrategy');
import NotificationContent = require('Controls/_popupTemplate/Notification/Opener/NotificationContent');

const timeAutoClose = 5000;

const _private = {
    setNotificationContent(item) {
        item.popupOptions.content = NotificationContent;
    },
    findItemById(popupItems, id) {
        const index = popupItems && popupItems.getIndexByValue('id', id);
        if (index > -1) {
            return popupItems.at(index);
        }
        return null;
    },
    isLinkedPopup(popupItems, parentItem, item): Boolean {
        while (item && item.parentId) {
            item = _private.findItemById(popupItems, item.parentId);
            if (item === parentItem) {
                return true;
            }
        }
        return false;
    }
};

/**
 * Notification Popup Controller
 * @class Controls/_popupTemplate/Notification/Opener/NotificationController
 * @control
 * @private
 * @category Popup
 * @extends Controls/_popupTemplate/BaseController
 */
const NotificationController = BaseController.extend({
    constructor(cfg) {
        NotificationController.superclass.constructor.call(this, cfg);
        this._stack = new collection.List();
    },

    elementCreated(item, container) {
        item.height = container.offsetHeight;
        _private.setNotificationContent(item);
        this._stack.add(item, 0);
        this._updatePositions();
        if (item.popupOptions.autoClose) {
            this._closeByTimeout(item);
        }
    },

    elementUpdated(item, container) {
        _private.setNotificationContent(item);
        item.height = container.offsetHeight;
        this._updatePositions();
    },

    elementDestroyed(item) {
        this._stack.remove(item);
        this._updatePositions();

        NotificationController.superclass.elementDestroyed.call(item);

        return new Deferred().callback();
    },

    popupMouseEnter(item) {
        if (item.popupOptions.autoClose) {
            clearTimeout(item.closeId);
        }
    },

    popupMouseLeave(item) {
        if (item.popupOptions.autoClose) {
            this._closeByTimeout(item);
        }
    },

    _closeByTimeout(item) {
        item.closeId = setTimeout(function() {
            require('Controls/popup').Controller.remove(item.id);
        }, timeAutoClose);
    },

    getCustomZIndex(popupItems, item): Number {
        // Notification windows must be above all popup windows
        // will be fixed by https://online.sbis.ru/opendoc.html?guid=e6a136fc-be49-46f3-84d5-be135fae4761
        const count = popupItems.getCount();
        for (let i = 0; i < count; i++) {
            // if popups are linked, then notification must be higher then parent
            if (popupItems.at(i).popupOptions.maximize && !_private.isLinkedPopup(popupItems, popupItems.at(i), item)) {
                const maximizedPopupZIndex = (i + 1) * 10;
                return maximizedPopupZIndex - 1;
            }
        }
        return 100;
    },

    getDefaultConfig(item) {
        NotificationController.superclass.getDefaultConfig.apply(this, arguments);
        _private.setNotificationContent(item);
    },

    _updatePositions() {
        let height = 0;

        /**
         * In item.height is the height of the popup.
         * It takes into account the indentation between the notification popups,
         * specified in the template via css. This is done to support theming.
         */
        this._stack.each(function(item) {
            item.position = NotificationStrategy.getPosition(height);
            height += item.height;
        });
    },
    TYPE: 'Notification'
});

export = new NotificationController();

