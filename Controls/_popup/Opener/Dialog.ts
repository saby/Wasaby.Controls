import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import {Logger} from 'UI/Utils';
import coreMerge = require('Core/core-merge');
/**
 * Контрол, открывающий всплывающее окно, которое позиционируется по центру экрана.
 * @remark
 * Подробнее о работе с контролом читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup здесь}.
 * См. <a href="/materials/demo-ws4-stack-dialog">демо-пример</a>.
 * @class Controls/_popup/Opener/Dialog
 * @extends Controls/_popup/Opener/BaseOpener
 * @mixes Controls/interface/IOpener
 * @mixes Controls/_popup/Opener/Confirmation/Dialog/DialogStyles
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/DialogPG
 * @public
 */

/*
 * Component that opens a popup that is positioned in the center of the browser window. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/ See more}
 * <a href="/materials/demo-ws4-stack-dialog">Demo-example</a>.
 * @class Controls/_popup/Opener/Dialog
 * @extends Controls/_popup/Opener/BaseOpener
 * @mixes Controls/interface/IOpener
 * @mixes Controls/_popup/Opener/Confirmation/Dialog/DialogStyles
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/DialogPG
 * @public
 */

const getDialogConfig = (config) => {
    config = config || {};
    // The dialog is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
    config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    config._vdomOnOldPage = true; // Открывается всегда вдомным
    return config;
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Dialog extends BaseOpener {
    /*
     * Open dialog popup.
     * If you call this method while the window is already opened, it will cause the redrawing of the window.
     * @function Controls/_popup/Opener/Dialog#open
     * @returns {Undefined}
     * @param {PopupOptions} popupOptions Dialog popup options.
     */

    /**
     * Метод открытия диалогового окна.
     * Повторный вызов этого метода инициирует перерисовку окна с новыми опциями.
     * @function Controls/_popup/Opener/Dialog#open
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
    open(popupOptions) {
        super.open(this._getDialogConfig(popupOptions), POPUP_CONTROLLER);
    }

    private _getDialogConfig(popupOptions) {
        return getDialogConfig(popupOptions);
    }

    static openPopup(config: object): Promise<string> {
        return new Promise((resolve) => {
            const newCfg = getDialogConfig(config);
            if (!newCfg.hasOwnProperty('opener')) {
                Logger.error(Dialog.prototype._moduleName + ': Для открытия окна через статический метод, обязательно нужно указать опцию opener');
            }
            BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
                    resolve(popupId);
                });
            });
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }

    static getDefaultOptions() {
        // На старом WindowManager пофиксили все известные баги, пробую все стики окна открывать всегда вдомными
        return coreMerge(BaseOpener.getDefaultOptions(), {_vdomOnOldPage: true});
    }
}

/**
 * Статический метод для открытия диалогового окна. При использовании метода не требуется создавать popup:Dialog в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup Подробнее}.
 * @function Controls/_popup/Opener/Dialog#openPopup
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
 * @function Controls/_popup/Opener/Dialog#closePopup
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

export default Dialog;

/**
 * @name Controls/_popup/Opener/Dialog#height
 * @cfg {Number} Текущая высота диалогового окна.
 */

/**
 * @name Controls/_popup/Opener/Dialog#maxHeight
 * @cfg {Number} Максимально допустимая высота диалогового окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#minHeight
 * @cfg {Number} Минимально допустимая высота диалогового окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#maxWidth
 * @cfg {Number} Максимально допустимая ширина диалогового окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#minWidth
 * @cfg {Number} Минимально допустимая ширина диалогового окна.
 */
/*
 * @name Controls/_popup/Opener/Dialog#top
 * @cfg {Number} Distance from the window to the top of the screen.
 */
/**
 * @name Controls/_popup/Opener/Dialog#top
 * @cfg {Number} Расстояние от диалогового окна до верхнего края экрана.
 */
/*
 * @name Controls/_popup/Opener/Dialog#left
 * @cfg {Number} Distance from the window to the left border of the screen.
 */
/**
 * @name Controls/_popup/Opener/Dialog#left
 * @cfg {Number} Расстояние от диалогового окна до левого края экрана.
 */

/**
 * @name Controls/_popup/Opener/Dialog#maximize
 * @cfg {Boolean} Определяет, должно ли всплывающее окно открываться на весь экран.
 */

/**
 * @name Controls/_popup/Opener/Dialog#close
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
 * @property {Controls/interface/IOpener/EventHandlers.typedef} eventHandlers Функции обратного вызова на события всплывающего окна.
 */
