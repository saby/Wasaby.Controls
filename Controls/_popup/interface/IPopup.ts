import {Control} from 'UI/Base';

export interface IPopupItem {
   id: string;
   parentId: string;
   position: IPopupPosition;
   popupOptions: IPopupOptions;
   popupState: string;
   sizes: IPopupSizes;
   _destroyDeferred: Promise<undefined>;
}

export interface IPopupSizes {
   width: number;
   height: number;
}

export interface IPopupPosition {
   top?: number;
   left?: number;
   bottom?: number;
   right?: number;
   minWidth?: number;
   maxWidth?: number;
   minHeight?: number;
   maxHeight?: number;
}

export interface IEventHandlers {
   onOpen?: Function;
   onClose?: Function;
   onResult?: Function;
}

export interface IPopupOptions {
   className?: string;
   template: string;
   closeOnOutsideClick?: boolean;
   templateOptions?: unknown;
   opener?: Control;
   eventHandlers?: IEventHandlers;
   width?: number;
   height?: number;
   minWidth?: number;
   maxWidth?: number;
   minHeight?: number;
   maxHeight?: number;
   content?: Function;
}

/**
 * Интерфейс окон
 *
 * @interface Controls/_popup/interface/IPopup
 * @public
 * @author Красильников А.С.
 */

export default interface IPopup {
   readonly '[Controls/_popup/interface/IPopup]': boolean;
}

/*
   * Interface for opener.
   *
   * @interface Controls/_popup/interface/IPopup
   * @public
   * @author Красильников А.С.
   */

/**
 * @name Controls/_popup/interface/IPopup#isOpened
 * @description Возвращает информацию о том, открыто ли всплывающее окно.
 * @function
 */

/*
 * @name Controls/_popup/interface/IPopup#isOpened
 * @description Popup opened status.
 * @function
 */

/**
 * Открывает всплывающее окно.
 * @function Controls/Popup/Opener/Base#open
 * @param popupOptions Конфигурация всплывающего окна
 * @param controller Контрол-контроллер для всплывающего окна.
 */

/*
 * Opens a popup
 * @function Controls/Popup/Opener/Base#open
 * @param popupOptions Popup configuration
 * @param controller Popup Controller
 */

/**
 * @name Controls/_popup/interface/IPopup#autofocus
 * @cfg {Boolean} Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @default true
 */

/*
 * @name Controls/_popup/interface/IPopup#autofocus
 * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
 * @default true
 */

/**
 * @name Controls/_popup/interface/IPopup#modal
 * @cfg {Boolean} Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @default false
 */

/*
 * @name Controls/_popup/interface/IPopup#modal
 * @cfg {Boolean} Determines whether the window is modal.
 * @default false
 */

/**
 * @name Controls/_popup/interface/IPopup#className
 * @cfg {String} Имена классов, которые будут применены к корневой ноде всплывающего окна.
 */

/*
 * @name Controls/_popup/interface/IPopup#className
 * @cfg {String} Class names of popup.
 */

/**
 * @name Controls/_popup/interface/IPopup#closeOnOutsideClick
 * @cfg {Boolean} Определяет возможность закрытия всплывающего окна по клику вне.
 * @default false
 */

/*
 * @name Controls/_popup/interface/IPopup#closeOnOutsideClick
 * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
 * @default false
 */

/**
 * @name Controls/_popup/interface/IPopup#template
 * @cfg {String|Function} Шаблон всплывающего окна
 */

/*
 * @name Controls/_popup/interface/IPopup#template
 * @cfg {String|Function} Template inside popup.
 */

/**
 * @name Controls/_popup/interface/IPopup#templateOptions
 * @cfg {String|Function} Опции для контрола, переданного в {@link template}
 */

/*
 * @name Controls/_popup/interface/IPopup#templateOptions
 * @cfg {String|Function} Template options inside popup.
 */

/**
 * @name Controls/_popup/interface/IPopup#opener
 * @cfg {Node} Логический инициатор открытия всплывающего окна. Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 */

/**
 * @event Controls/_popup/interface/IPopup#close Происходит при закрытии всплывающего окна
 * @example
 * В этом примере мы подписываемся на событие 'close' и в его обработчике удаляем элемент из списка.
 * <pre>
 *    <Controls.popup:Stack on:close="_popupCloseHandler()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _popupCloseHandler() {
 *          this._removeItem(this._currentItem);
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Controls/_popup/interface/IPopup#close Occurs when popup is closed.
 * @example
 * In this example, we subscribe to close event and remove item at list
 * <pre>
 *    <Controls.popup:Stack on:close="_popupCloseHandler()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _popupCloseHandler() {
 *          this._removeItem(this._currentItem);
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_popup/interface/IPopup#result Происходит, когда дочерний контрол всплывающего окна инициирует событие 'sendResult'
 * @example
 * В этом примере мы подписываемся на событие 'result' и в его обработчике сохраняем данные с шаблона.
 * <pre>
 *    // MainControl.wml
 *    <Controls.popup:Stack on:result="_popupResultHandler()" />
 * </pre>
 *
 * <pre>
 *    // MainControl.js
 *    Control.extend({
 *       ...
 *       _popupResultHandler(event, userData) {
 *          this._saveUserData(userData);
 *       }
 *       ...
 *    });
 * </pre>
 *
 * <pre>
 *    // popupTemplate.js
 *    Control.extend({
 *       ...
 *       _sendDataToMainControl(userData) {
 *          this._notify('sendResult', [userData], { bubbling: true});
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Controls/_popup/interface/IPopup#result Occurs when child control of popup notify "sendResult" event.
 * @example
 * In this example, we subscribe to result event and save user data.
 * <pre>
 *    // MainControl.wml
 *    <Controls.popup:Stack on:result="_popupResultHandler()" />
 * </pre>
 *
 * <pre>
 *    // MainControl.js
 *    Control.extend({
 *       ...
 *       _popupResultHandler(event, userData) {
 *          this._saveUserData(userData);
 *       }
 *       ...
 *    });
 * </pre>
 *
 * <pre>
 *    // popupTemplate.js
 *    Control.extend({
 *       ...
 *       _sendDataToMainControl(userData) {
 *          this._notify('sendResult', [userData], { bubbling: true});
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_popup/interface/IPopup#open Происходит при открытии всплывающего окна
 * @example
 * В этом примере мы подписываемся на событие 'open' и в его обработчике меняем состояние '_popupOpened'
 * <pre>
 *    <Controls.popup:Stack on:open="_popupOpenHandler()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _popupOpenHandler() {
 *          this._popupOpened = true;
 *          this._changeStatus(this._popupOpened);
 *       }
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Controls/_popup/interface/IPopup#open Occurs when popup is opened.
 * @example
 * In this example, we subscribe to open event and change text at input control
 * <pre>
 *    <Controls.popup:Stack on:open="_popupOpenHandler()" />
 * </pre>
 *
 * <pre>
 *    Control.extend({
 *       ...
 *       _popupOpenHandler() {
 *          this._popupOpened = true;
 *          this._changeStatus(this._popupOpened);
 *       }
 *       ...
 *    });
 * </pre>
 */

/**
 * @typedef {Object} EventHandlers
 * @description Функции обратного вызова позволяют подписаться на события всплывающего окна, открытого через статические методы.
 * Когда {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/ открывающий контрол} добавлен в шаблон, можно задать декларативную подписку на события.
 * @property {Function} onOpen Функция обратного вызова, которая вызывается при открытии всплывающего окна.
 * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-open-window здесь}.
 * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
 * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-close-window здесь}.
 * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
 * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-result здесь}.
 */
