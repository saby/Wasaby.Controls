import { IOpener, IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций нотификационных окон.
 *
 * @interface Controls/_popup/interface/INotification
 * @public
 * @author Красильников А.С.
 */

export interface INotificationPopupOptions extends IBasePopupOptions {
    autoClose?: boolean;
}

export interface INotificationOpener extends IOpener {
    readonly '[Controls/_popup/interface/INotificationOpener]': boolean;
}

/**
 * @name Controls/_popup/interface/INotification#autoClose
 * @cfg {Number} Автоматически закрывать окно через 5 секунд после открытия.
 */

/**
 * @typedef {Object} PopupOptions
 * @description Sets the popup configuration.
 * @property {} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {} template Шаблон всплывающего окна
 * @property {} templateOptions Опции для контрола, переданного в {@link template}
 */

/**
 * Метод открытия нотификационного окна.
 * Повторный вызов этого метода вызовет переририсовку контрола.
 * @function Controls/_popup/interface/INotification#open
 * @param {PopupOptions} popupOptions Конфигурация нотифицационного окна
 * @remark
 * Если требуется открыть окно, без создания popup:Notification в верстке, следует использовать статический метод {@link openPopup}
 * @example
 * wml
 * <pre>
 *    <Controls.popup:Notification name="notificationOpener">
 *       <ws:popupOptions template="wml!Controls/Template/NotificationTemplate">
 *       </ws:popupOptions>
 *    </Controls.popup:Notification>
 *
 *    <Controls.buttons:Button name="openNotificationButton" caption="open notification" on:click="_open()"/>
 * </pre>
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *       _open() {
 *          var popupOptions = {
 *              templateOptions: {
 *                 style: "done",
 *                 text: "Message was send",
 *                 icon: "Admin"
 *              }
 *          }
 *          this._children.notificationOpener.open(popupOptions)
 *      }
 *      ...
 *   });
 * </pre>
 * @see close
 * @see openPopup
 * @see closePopup
 */

/**
 * Статический метод для открытия нотификационного окна. При использовании метода не требуется создавать popup:Notification в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/#open-popup Подробнее}.
 * @function Controls/_popup/interface/INotification#openPopup
 * @param {PopupOptions} config Конфигурация нотификационного окна
 * @return {Promise<string>} Возвращает Promise, который в качестве результата вернет идентификатор окна, который потребуется для закрытия этого окна. см метод {@link closePopup}
 * @static
 * @example
 * js
 * <pre>
 *    import {Notification} from 'Controls/popup';
 *    ...
 *    openNotification() {
 *        Notification.openPopup({
 *          template: 'Example/MyStackTemplate',
 *          autoClose: true
 *        }).then((popupId) => {
 *          this._notificationId = popupId;
 *        });
 *    },
 *
 *    closeNotification() {
 *       Notification.closePopup(this._notificationId);
 *    }
 * </pre>
 * @see closePopup
 * @see close
 * @see open
 */

/**
 * Статический метод для закрытия окна по идентификатору.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/#open-popup Подробнее}.
 * @function Controls/_popup/interface/INotification#closePopup
 * @param {String} popupId Идентификатор окна, который был получен при вызове метода {@link openPopup}.
 * @static
 * @example
 * js
 * <pre>
 *    import {Notification} from 'Controls/popup';
 *    ...
 *    openNotification() {
 *        Notification.openPopup({
 *          template: 'Example/MyStackTemplate',
 *          autoClose: true
 *        }).then((popupId) => {
 *          this._notificationId = popupId;
 *        });
 *    },
 *
 *    closeNotification() {
 *       Notification.closePopup(this._notificationId);
 *    }
 * </pre>
 * @see openPopup
 * @see opener
 * @see close
 */
