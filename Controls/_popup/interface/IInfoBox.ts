import {Control, TemplateFunction} from 'UI/Base';
import {IEventHandlers} from './IPopup';

/**
 * Интерфейс для опций всплывающих подсказок.
 *
 * @interface Controls/_popup/interface/IInfoBox
 * @private
 * @author Красильников А.С.
 */

export interface IInfoBoxOptions {
    target?: HTMLElement | EventTarget | Control;
    maxWidth?: number;
    style?: string;
    styleType?: string;
    targetSide?: string;
    alignment?: string;
    floatCloseButton?: boolean;
    closeOnOutsideClick?: boolean;
    hideDelay?: number;
    showDelay?: number;
    eventHandlers?: IEventHandlers;
    template?: Control | TemplateFunction | string | any;
    templateOptions?: any;
    message?: string;
    zIndex?: number; //TODO Compatible
    position?: string; //TODO старое, надо удалить
}

export interface IInfoBoxOpener {
    readonly '[Controls/_popup/interface/IInfoBoxOpener]': boolean;
}

/**
 * @typedef {Object} EventHandlers
 * @description Функции обратного вызова на события всплывающего окна.
 * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
 * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
 */

/*
 * @typedef {Object} EventHandlers
 * @description Callback functions on popup events.
 * @property {Function} onClose Callback function is called when popup is closed.
 * @property {Function} onResult Callback function is called at the sendResult event in the popup template.
 */

/**
 * Close popup.
 * @function Controls/_popup/interface/IInfoBox#close
 */

/**
 * @name Controls/_popup/interface/IInfoBox#isOpened
 * @function
 * @description Popup opened status.
 */

/**
 * Open popup.
 * @function Controls/_popup/interface/IInfoBox#open
 * @param {Object} Config
 * @returns {undefined}
 * @example
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *
 *      _openInfobox() {
 *          var config= {
 *              message: 'My tooltip'
 *              target: this._children.buttonTarget //dom node
 *          }
 *          this._notify('openInfoBox', [config], {bubbling: true});
 *      }
 *
 *      _closeInfobox() {
 *          this._notify('closeInfoBox', [], {bubbling: true});
 *      }
 *   });
 * </pre>
 */

/**
 * Open InfoBox popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/interface/IInfoBox#openPopup
 * @param {Object} config InfoBox options. See {@link Controls/_popup/InfoBox description}.
 * @static
 * @see closePopup
 */

/**
 * Close InfoBox popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/interface/IInfoBox#closeInfoBox
 * @see openPopup
 * @static
 */
