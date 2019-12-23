import { IOpener, IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций диалоговых окон.
 *
 * @interface Controls/_popup/interface/IDialog
 * @public
 * @author Красильников А.С.
 */

export interface IDialogPopupOptions extends IBasePopupOptions {
    minWidth?: number;
    width?: number;
    maxWidth?: number;
    minHeight?: number;
    height?: number;
    maxHeight?: number;
    top?: number;
    left?: number;
    maximize?: boolean;
}

export interface IDialogOpener extends IOpener {
    readonly '[Controls/_popup/interface/IDialogOpener]': boolean;
}

/**
 * @name Controls/_popup/interface/IDialog#height
 * @cfg {Number} Текущая высота диалогового окна.
 */

/**
 * @name Controls/_popup/interface/IDialog#width
 * @cfg {Number} Текущая ширина диалогового окна.
 */

/**
 * @name Controls/_popup/interface/IDialog#maxHeight
 * @cfg {Number} Максимально допустимая высота диалогового окна.
 */
/**
 * @name Controls/_popup/interface/IDialog#minHeight
 * @cfg {Number} Минимально допустимая высота диалогового окна.
 */
/**
 * @name Controls/_popup/interface/IDialog#maxWidth
 * @cfg {Number} Максимально допустимая ширина диалогового окна.
 */
/**
 * @name Controls/_popup/interface/IDialog#minWidth
 * @cfg {Number} Минимально допустимая ширина диалогового окна.
 */
/*
 * @name Controls/_popup/interface/IDialog#top
 * @cfg {Number} Distance from the window to the top of the screen.
 */
/**
 * @name Controls/_popup/interface/IDialog#top
 * @cfg {Number} Расстояние от диалогового окна до верхнего края экрана.
 */
/*
 * @name Controls/_popup/interface/IDialog#left
 * @cfg {Number} Distance from the window to the left border of the screen.
 */
/**
 * @name Controls/_popup/interface/IDialog#left
 * @cfg {Number} Расстояние от диалогового окна до левого края экрана.
 */

/**
 * @name Controls/_popup/interface/IDialog#maximize
 * @cfg {Boolean} Определяет, должно ли всплывающее окно открываться на весь экран.
 */

/**
 * @typedef {Object} PopupOptions
 * @description Конфигурация диалогового окна.
 * @property {Boolean} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {Boolean} modal Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде диалогового окна.
 * @property {Boolean} closeOnOutsideClick Определяет возможность закрытия диалогового окна по клику вне.
 * @property {function|String} template Шаблон диалогового окна.
 * @property {function|String} templateOptions  Опции для контрола, переданного в {@link template}.
 * @property {Number} width Текущая ширина диалогового окна.
 * @property {Number} height Текущая высота диалогового окна.
 * @property {Number} maxHeight Максимально допустимая высота диалогового окна.
 * @property {Number} minHeight Минимально допустимая высота диалогового окна.
 * @property {Number} maxWidth Максимально допустимая ширина диалогового окна.
 * @property {Number} minWidth Минимально допустимая ширина диалогового окна.
 * @property {Number} top Расстояние от диалогового окна до верхнего края экрана.
 * @property {Number} left Расстояние от диалогового окна до левого края экрана.
 * @property {Node} opener Логический инициатор открытия диалогового окна. Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 * @property {Controls/_popup/interface/IBaseOpener.typedef} eventHandlers Функции обратного вызова на события всплывающего окна.
 */

/**
 * @name Controls/_popup/interface/IDialog#close
 * @function
 * @description Метод закрытия диалогового окна.
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *    <Controls.popup:Dialog name="dialog" template="Controls-demo/Popup/TestDialog" modal="{{true}}">
 *          <ws:templateOptions key="111"/>
 *    </Controls.popup:Dialog>
 *
 *    <Controls.buttons:Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
 *    <Controls.buttons:Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
 * </pre>
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *
 *       _openDialog() {
 *          var popupOptions = {
 *              autofocus: true
 *          }
 *          this._children.dialog.open(popupOptions)
 *       }
 *
 *       _closeDialog() {
 *          this._children.dialog.close()
 *       }
 *       ...
 *   });
 * </pre>
 * @see open
 */

/**
 * Метод открытия диалогового окна.
 * Повторный вызов этого метода инициирует перерисовку окна с новыми опциями.
 * @function Controls/_popup/interface/IDialog#open
 * @param {PopupOptions} popupOptions Конфигурация диалогового окна.
 * @remark
 * Если требуется открыть окно, без создания popup:Dialog в верстке, следует использовать статический метод {@link openPopup}.
 * @example
 * wml
 * <pre>
 *    <Controls.popup:Dialog name="dialog" template="Controls-demo/Popup/TestDialog" modal="{{true}}">
 *          <ws:templateOptions key="111"/>
 *    </Controls.popup:Dialog>
 *
 *    <Controls.buttons:Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
 *    <Controls.buttons:Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
 * </pre>
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *
 *       _openDialog() {
 *          var popupOptions = {
 *              autofocus: true
 *          }
 *          this._children.dialog.open(popupOptions)
 *       }
 *
 *       _closeDialog() {
 *          this._children.dialog.close()
 *       }
 *       ...
 *   });
 * </pre>
 * @see close
 * @see openPopup
 * @see closePopup
 */

/**
 * Статический метод для открытия диалогового окна. При использовании метода не требуется создавать popup:Dialog в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup Подробнее}.
 * @function Controls/_popup/interface/IDialog#openPopup
 * @param {PopupOptions} config Конфигурация диалогового окна
 * @return {Promise<string>} Метод возвращает Promise, который в качестве результата отдаёт идентификатор окна. Идентификатор используется для закрытия диалога с помощью метода {@link closePopup}.
 * @remark
 * Для обновления уже открытого окна в config нужно передать свойство id с идентификатором открытого окна.
 * @static
 * @example
 * <pre>
 *    import {Dialog} from 'Controls/popup';
 *    ...
 *    openDialog() {
 *        Dialog.openPopup({
 *          template: 'Example/MyDialogTemplate',
 *          opener: this._children.myButton
 *        }).then((popupId) => {
 *          this._popupId = popupId;
 *        });
 *    },
 *
 *    closeDialog() {
 *       Dialog.closePopup(this._popupId);
 *    }
 * </pre>
 * @see closePopup
 * @see close
 * @see open
 */

/**
 * Статический метод для закрытия окна по идентификатору.
 * Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup здесь}.
 * @function Controls/_popup/interface/IDialog#closePopup
 * @param {String} popupId Идентификатор окна, который был получен при вызове метода {@link openPopup}.
 * @static
 * @example
 * <pre>
 *    import {Dialog} from 'Controls/popup';
 *    ...
 *    openDialog() {
 *        Dialog.openPopup({
 *          template: 'Example/MyDialogTemplate',
 *          opener: this._children.myButton
 *        }).then((dialogId) => {
 *          this._dialogId = dialogId;
 *        });
 *    },
 *
 *    closeDialog() {
 *       Dialog.closePopup(this._dialogId);
 *    }
 * </pre>
 * @see openPopup
 * @see opener
 * @see close
 */
