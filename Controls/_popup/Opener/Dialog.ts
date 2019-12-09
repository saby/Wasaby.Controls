import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import {IoC} from 'Env/Env';
import {IConfirmationOptions} from "./interface/IConfirmation";
/**
 * Контрол, открывающий всплывающее окно, которое позиционнируется по центру экрана.
 * Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup здесь}.
 * <a href="/materials/demo-ws4-stack-dialog">Демо-пример</a>.
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

const _private = {
    getDialogConfig(config) {
        config = config || {};
        // The dialog is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
        config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
        return config;
    }
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Dialog extends BaseOpener {
    protected _contextIsTouch: boolean = false;

    protected _afterMount(options, context): void {
        super._afterMount();
        this._updateContext(context);
    }

    protected _afterUpdate(oldOptions, context): void{
        this._updateContext(context);
    }

    private _updateContext(context): void {
        this._contextIsTouch = context && context.isTouch && context.isTouch.isTouch;
    }


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
 		// Если диалоговое окно открыто через touch, то позиционируем его в самом верху экрана.
        // Это решает проблемы с показом клавиатуры и прыжком контента из-за изменившегося scrollTop.
        if(this._contextIsTouch) {
            popupOptions.top = 0;
        }
        super.open(_private.getDialogConfig(popupOptions), POPUP_CONTROLLER);
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
Dialog.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        const newCfg = _private.getDialogConfig(config);
        if (!newCfg.hasOwnProperty('opener')) {
            IoC.resolve('ILogger').error(Dialog.prototype._moduleName, 'Для открытия окна через статический метод, обязательно нужно указать опцию opener');
        }
        BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
            BaseOpener.showDialog(result[0], newCfg, result[1], newCfg.id).then((popupId: string) => {
                resolve(popupId);
            });
        });
    });
};

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
Dialog.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Dialog._private = _private;

export default Dialog;

/**
 * @name Controls/_popup/Opener/Dialog#height
 * @cfg {Number} Текущая высота всплывающего окна.
 */

/**
 * @name Controls/_popup/Opener/Dialog#maxHeight
 * @cfg {Number} Максимально допустимая высота всплывающего окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#minHeight
 * @cfg {Number} Минимально допустимая высота всплывающего окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#maxWidth
 * @cfg {Number} Максимально допустимая ширина всплывающего окна.
 */
/**
 * @name Controls/_popup/Opener/Dialog#minWidth
 * @cfg {Number} Минимально допустимая ширина всплывающего окна.
 */
/*
 * @name Controls/_popup/Opener/Dialog#top
 * @cfg {Number} Distance from the window to the top of the screen.
 */
/**
 * @name Controls/_popup/Opener/Dialog#top
 * @cfg {Number} Расстояние от всплывающего окна до верхнего края экрана.
 */
/*
 * @name Controls/_popup/Opener/Dialog#left
 * @cfg {Number} Distance from the window to the left border of the screen.
 */
/**
 * @name Controls/_popup/Opener/Dialog#left
 * @cfg {Number} Расстояние от всплывающего окна до левого края экрана.
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
 * @description Конфигурация всплывающего окна.
 * @property {Boolean} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {Boolean} modal Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {Boolean} closeOnOutsideClick Определяет возможность закрытия всплывающего окна по клику вне.
 * @property {function|String} template Шаблон всплывающего окна.
 * @property {function|String} templateOptions  Опции для котнрола, переданного в {@link template}.
 * @property {Number} width Текущая ширина всплывающего окна.
 * @property {Number} height Текущая высота всплывающего окна.
 * @property {Number} maxHeight Максимально допустимая высота всплывающего окна.
 * @property {Number} minHeight Минимально допустимая высота всплывающего окна.
 * @property {Number} maxWidth Максимально допустимая ширина всплывающего окна.
 * @property {Number} minWidth Минимально допустимая ширина всплывающего окна.
 * @property {Number} top Расстояние от всплывающего окна до верхнего края экрана.
 * @property {Number} left Расстояние от всплывающего окна до левого края экрана.
 * @property {Node} opener Логический инициатор открытия всплывающего окна. Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 */
