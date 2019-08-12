import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Manager/Popup');
import {delay as runDelayed} from 'Types/function';
import Env = require('Env/Env');
import {SyntheticEvent} from 'Vdom/Vdom';
import PopupContent = require('wml!Controls/_popup/Manager/PopupContent');
import {debounce} from 'Types/function';

import makeInstanceCompatible = require('Core/helpers/Hcontrol/makeInstanceCompatible');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');

const RESIZE_DELAY = 10;
// on ios increase delay for scroll handler, because popup on frequent repositioning loop the scroll.
const SCROLL_DELAY = Env.detection.isMobileIOS ? 100 : 10;

let _private = {
    keyUp(event) {
        if (event.nativeEvent.keyCode === Env.constants.key.esc) {
            this._close();
        }
    }
};

let Popup = Control.extend({

    /**
     * Control Popup
     * @class Controls/_popup/Manager/Popup
     * @mixes Controls/interface/IOpenerOwner
     * @mixes Controls/interface/ICanBeDefaultOpener
     * @extends Core/Control
     * @control
     * @private
     * @category Popup
     * @author Красильников А.С.
     */

    /**
     * @name Controls/_popup/Manager/Popup#template
     * @cfg {Content} Template
     */

    /**
     * @name Controls/_popup/Manager/Popup#templateOptions
     * @cfg {Object} Template options
     */

    _template: template,

    // Register the openers that initializing inside current popup
    // After updating the position of the current popup, calls the repositioning of popup from child openers
    _openersUpdateCallback: [],

    _isEscDown: false,
    _beforeMount(opts) {
       if(!(isNewEnvironment())) {
          makeInstanceCompatible(this);
       }
    },

    _afterMount() {
        /* TODO: COMPATIBLE. You can't just count on afterMount position and zooming on creation
         * inside can be compoundArea and we have to wait for it, and there is an asynchronous phase. Look at the flag waitForPopupCreated */
        this._controlResize = debounce(this._controlResize.bind(this), RESIZE_DELAY);
        this._scrollHandler = debounce(this._scrollHandler.bind(this), SCROLL_DELAY);

        if (this.waitForPopupCreated) {
            this.callbackCreated = (function() {
                this.callbackCreated = null;
                this._notify('popupCreated', [this._options.id], {bubbling: true});
                this._options.creatingDef && this._options.creatingDef.callback(this._options.id);
            }).bind(this);
        } else {
            this._notify('popupCreated', [this._options.id], {bubbling: true});
            this._options.creatingDef && this._options.creatingDef.callback(this._options.id);
            if (this._activate) {
               this._activate(this);
            }
            this.activatePopup();
        }
    },

    _afterUpdate(oldOptions) {
        this._notify('popupAfterUpdated', [this._options.id], {bubbling: true});
        const oldPosition = oldOptions.position;
        const newPosition = this._options.position;
        if ((oldPosition.width && oldPosition.width !== newPosition.width) ||
            (oldPosition.height && oldPosition.height !== newPosition.height)) {
            const eventCfg = {
                type: 'controlResize',
                target: this,
                _bubbling: false
            };
            this._children.resizeDetect.start(new SyntheticEvent(null, eventCfg));
        }
    },
    _beforeUnmount() {
        this._notify('popupDestroyed', [this._options.id], {bubbling: true});
    },

    activatePopup() {
        // TODO Compatible
        if (this._options.autofocus && !this._options.isCompoundTemplate) {
            this.activate();
        }
    },

    /**
     * Close popup
     * @function Controls/_popup/Manager/Popup#_close
     */
    _close() {
        this._notify('popupClose', [this._options.id], {bubbling: true});
    },
    _maximized(event, state) {
        this._notify('popupMaximized', [this._options.id, state], {bubbling: true});
    },

    _popupDragStart(event, offset) {
        this._notify('popupDragStart', [this._options.id, offset], {bubbling: true});
    },

    _popupDragEnd() {
        this._notify('popupDragEnd', [this._options.id], {bubbling: true});
    },

    _popupMouseEnter(event, popupEvent) {
        this._notify('popupMouseEnter', [this._options.id, popupEvent], {bubbling: true});
    },

    _popupMouseLeave(event, popupEvent) {
        this._notify('popupMouseLeave', [this._options.id, popupEvent], {bubbling: true});
    },

    _animated(ev) {
        this._children.resizeDetect.start(ev);
        this._notify('popupAnimated', [this._options.id], {bubbling: true});
    },

    _registerOpenerUpdateCallback(event, callback) {
        this._openersUpdateCallback.push(callback);
    },

    _unregisterOpenerUpdateCallback(event, callback) {
        let index = this._openersUpdateCallback.indexOf(callback);
        if (index > -1) {
            this._openersUpdateCallback.splice(index, 1);
        }
    },

    _callOpenersUpdate() {
        for (let i = 0; i < this._openersUpdateCallback.length; i++) {
            this._openersUpdateCallback[i]();
        }
    },

    _scrollHandler(): void {
        this._notify('pageScrolled', [this._options.id], {bubbling: true});
    },

    /**
     * Update popup
     * @function Controls/_popup/Manager/Popup#_close
     */
    _update() {
        this._notify('popupUpdated', [this._options.id], {bubbling: true});

        // After updating popup position we will updating the position of the popups open with it.
        runDelayed(this._callOpenersUpdate.bind(this));
    },

    _controlResize() {
        this._notify('popupControlResize', [this._options.id], {bubbling: true});
    },

    /**
     * Proxy popup result
     * @function Controls/_popup/Manager/Popup#_sendResult
     */
    _sendResult(event) {
        let args = Array.prototype.slice.call(arguments, 1);
        this._notify('popupResult', [this._options.id].concat(args), {bubbling: true});
    },

    _swipeHandler(event) {
        // close popup by swipe only for vdom, cause ws3 controls use differ system of swipe,
        // we can't stop it on vdom controls.
        if (event.nativeEvent.direction === 'right' && !this._options.isCompoundTemplate) {
            this._close();
        }
    },

    /**
     * key up handler
     * @function Controls/_popup/Manager/Popup#_keyUp
     * @param event
     */
    _keyUp(event) {
        /**
         * Старая панель по событию keydown закрывается и блокирует всплытие события. Новая панель делает
         * тоже самое, но по событию keyup. Из-за этого возникает следующая ошибка.
         * https://online.sbis.ru/opendoc.html?guid=0e4a5c02-f64c-4c7d-88b8-3ab200655c27
         *
         * Что бы не трогать старые окна, мы добавляем поведение на закрытие по esc. Закрываем только в том случае,
         * если новая панель поймала событие keydown клавиши esc.
         */
        if (this._isEscDown) {
            this._isEscDown = false;
            _private.keyUp.call(this, event);
        }
    },

    _keyDown(event) {
        if (event.nativeEvent.keyCode === Env.constants.key.esc) {
            this._isEscDown = true;
        }
    }
});

Popup.getDefaultOptions = function() {
    return {
        content: PopupContent,
        autofocus: true
    };
};

Popup.prototype._moduleName = 'Controls/_popup/Manager/Popup';

export = Popup;

