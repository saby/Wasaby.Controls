import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Previewer/Previewer');
import {debounce} from 'Types/function';
import PreviewerOpener from './Opener/Previewer';
import { goUpByControlTree } from 'UI/Focus';
import 'css!theme?Controls/popup';

/**
 * @class Controls/_popup/Previewer
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 */

let CALM_DELAY = 300; // During what time should not move the mouse to start opening the popup.

let _private = {
    getType(eventType) {
        if (eventType === 'mousemove' || eventType === 'mouseleave') {
            return 'hover';
        }
        return 'click';
    },
    getCfg(self) {
        let config = {
            autofocus: false,
            opener: self,
            target: self._container,
            template: 'Controls/popup:PreviewerTemplate',
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            isCompoundTemplate: self._options.isCompoundTemplate,
            eventHandlers: {
                onResult: self._resultHandler,
                onClose: self._closeHandler
            },
            templateOptions: {
                template: self._options.template,
                templateOptions: self._options.templateOptions
            }
        };

        if (self._options.targetPoint) {
            config.targetPoint = self._options.targetPoint;
        }
        if (self._options.direction) {
            config.direction = self._options.direction;
        }
        if (self._options.offset) {
            config.offset = self._options.offset;
        }
        return config;
    },
    open(self, event, type) {
        if (!self._isPopupOpened()) {
            const newConfig = _private.getCfg(self);
            self._isOpened = true;
            return PreviewerOpener.openPopup(newConfig, type).then((id) => {
                self._previewerId = id;
            });
        }
    },
    close(self, type) {
        PreviewerOpener.closePopup(self._previewerId, type);
    }
};

let Previewer = Control.extend({
    _template: template,
    _previewerId: null,
    _isOpened: false,

    _beforeMount(options) {
        this._resultHandler = this._resultHandler.bind(this);
        this._closeHandler = this._closeHandler.bind(this);
        this._debouncedAction = debounce(this._debouncedAction, 10);
        this._enableClose = true;
    },
    _beforeUnmount() {
        this._clearWaitTimer();
    },

    /**
     * @param type
     * @variant hover
     * @variant click
     */
    open(type) {
        _private.open(this, {}, type);
    },

    /**
     * @param type
     * @variant hover
     * @variant click
     */
    close(type) {
        _private.close(this, type);
    },

    _open(event) {
        let type = _private.getType(event.type);

        _private.open(this, event, type);
    },

    _close(event) {
        let type = _private.getType(event.type);

        _private.close(this, type);
    },

    _isPopupOpened() {
        return PreviewerOpener.isOpenedPopup(this._previewerId);
    },
    _scrollHandler(event) {
        this._close(event);
    },
    // Pointer action on hover with content and popup are executed sequentially.
    // Collect in package and process the latest challenge
    _debouncedAction(method, args) {
        this[method].apply(this, args);
    },

    _cancel(event, action) {
        PreviewerOpener.cancelPopup(this._previewerId, action);
    },

    _contentMouseenterHandler(event) {
        if (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick') {
            // We will cancel closing of the popup, if it is already open
            if (this._isOpened) {
                this._cancel(event, 'closing');
            }
        }
    },

    _contentMouseleaveHandler(event) {
        if (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick') {
            this._clearWaitTimer();
            if (this._isPopupOpened()) {
                this._debouncedAction('_close', [event]);
            } else {
                this._cancel(event, 'opening');
            }
        }
    },

    _contentMousemoveHandler(event) {
        if (this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick') {
            // wait, until user stop mouse on target.
            // Don't open popup, if mouse moves through the target
            this._clearWaitTimer();
            this._waitTimer = setTimeout(() => {
                this._waitTimer = null;
                if (!this._isPopupOpened()) {
                    this._debouncedAction('_open', [event]);
                }
            }, CALM_DELAY);
        }
    },

    _clearWaitTimer() {
        if (this._waitTimer) {
            clearTimeout(this._waitTimer);
        }
    },

    _previewerClickHandler(event) {
        if (this._options.trigger === 'click' || this._options.trigger === 'hoverAndClick') {
            /**
             * When trigger is set to 'hover', preview shouldn't be shown when user clicks on content.
             */
            if (!this._isPopupOpened()) {
                this._debouncedAction('_open', [event]);
            }
            event.preventDefault();
            event.stopPropagation();
        }
    },

    _resultHandler(event) {
        switch (event.type) {
            case 'menuclosed':
                this._enableClose = true;
                event.stopPropagation();
                break;
            case 'menuopened':
                this._enableClose = false;
                event.stopPropagation();
                break;
            case 'mouseenter':
                this._debouncedAction('_cancel', [event, 'closing']);
                break;
            case 'mouseleave':
                const isHoverType = this._options.trigger === 'hover' || this._options.trigger === 'hoverAndClick';
                if (isHoverType && this._enableClose && !this._isLinkedPreviewer(event)) {
                    this._debouncedAction('_close', [event]);
                }
                break;
            case 'mousedown':
                event.stopPropagation();
                break;
        }
    },

    _isLinkedPreviewer(event: Event): boolean {
        const parentControls = goUpByControlTree(event.nativeEvent.relatedTarget);
        for (let i = 0; i < parentControls.length; i++) {
            if (parentControls[i] === this) {
                return true;
            }
        }
        return false;
    },

    _closeHandler() {
        this._isOpened = false;
    },
    _private
});

Previewer.getDefaultOptions = function() {
    return {
        trigger: 'hoverAndClick'
    };
};

export = Previewer;

/**
 * @name Controls/_popup/Previewer#content
 * @cfg {Content} Контент, при взаимодействии с которым открывается окно.
 */
/*
 * @name Controls/_popup/Previewer#content
 * @cfg {Content} The content to which the logic of opening and closing the mini card is added.
 */

/**
 * @name Controls/_popup/Previewer#template
 * @cfg {Content} Содержимое окна.
 */
/*
 * @name Controls/_popup/Previewer#template
 * @cfg {Content} Mini card contents.
 */

/**
 * @name Controls/_popup/Previewer#trigger
 * @cfg {String} Название события, которое запускает открытие или закрытие окна.
 * @variant click Открытие кликом по контенту. Закрытие кликом "мимо" - не по контенту или шаблону.
 * @variant demand Закрытие кликом по контенту или шаблону.
 * @variant hover Открытие по ховеру - по наведению курсора на контент. Закрытие по ховеру - по навердению курсора на контент или шаблон.
 * @variant hoverAndClick Открытие по клику или ховеру на контент. Закрытие по клику или или ховеру "мимо" - не по контенту или шаблону.
 * @default hoverAndClick
 */
/**
 * @name Controls/_popup/Previewer#trigger
 * @cfg {String} Event name trigger the opening or closing of the template.
 * @variant click Opening by click on the content. Closing by click not on the content or template.
 * @variant demand Closing by click not on the content or template.
 * @variant hover Opening by hover on the content. Closing by hover not on the content or template.
 * @variant hoverAndClick Opening by click or hover on the content. Closing by click or hover not on the content or template.
 * @default hoverAndClick
 */

