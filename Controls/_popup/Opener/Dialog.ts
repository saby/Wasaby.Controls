import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import {IoC} from 'Env/Env';
/**
 * Контрол, открывающий всплывающее окно, которое позиционнируется в центре экрана.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/ See more}
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

const Dialog = BaseOpener.extend({
    /**
     * Open dialog popup.
     * If you call this method while the window is already opened, it will cause the redrawing of the window.
     * @function Controls/_popup/Opener/Dialog#open
     * @returns {Undefined}
     * @param {PopupOptions[]} popupOptions Dialog popup options.
     */

    /**
     * Метод открытия диалогового окна.
     * Повторный вызов этого метода инициирует перерисовку окна с новыми опциями.
     * @function Controls/_popup/Opener/Dialog#open
     * @returns {Undefined}
     * @param {PopupOptions[]} popupOptions Конфигурация диалогового окна.
     * @remark
     * {@link https://wi.sbis.ru/docs/js/Controls/interface/IDialogOptions#popupOptions popupOptions}
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Dialog name="dialog" template="Controls-demo/Popup/TestDialog" modal="{{true}}">
     *          <ws:templateOptions key="111"/>
     *    </Controls.popup:Dialog>
     *
     *    <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
     *    <Controls.Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
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
     */
    open(config) {
        BaseOpener.prototype.open.call(this, _private.getDialogConfig(config), POPUP_CONTROLLER);
    }
});

/**
 * Open Dialog popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/ See more}.
 * @function Controls/_popup/Opener/Dialog#openPopup
 * @param {PopupOptions[]} config Dialog popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
 * @static
 * @see closePopup
 */
Dialog.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        const newCfg = _private.getDialogConfig(config);
        if (!newCfg.hasOwnProperty('opener')) {
            IoC.resolve('ILogger').error(Dialog.prototype._moduleName, 'Для открытия окна через статический метод, обязательно нужно указать опцию opener');
        }
        BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
            BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
                resolve(popupId);
            });
        });
    });
};

/**
 * Close Dialog popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/ See more}.
 * @function Controls/_popup/Opener/Dialog#closePopup
 * @param {String} popupId Id of popup.
 * @static
 * @see openPopup
 */
Dialog.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Dialog._private = _private;

export default Dialog;

/**
 * @name Controls/_popup/Opener/Dialog#height
 * @cfg {Number} Текущая высота всплывающего окна
 */

/**
 * @name Controls/_popup/Opener/Dialog#maxHeight
 * @cfg {Number} Максимально допустимая высота всплывающего окна
 */
/**
 * @name Controls/_popup/Opener/Dialog#minHeight
 * @cfg {Number} Минимально допустимая высота всплывающего окна
 */
/**
 * @name Controls/_popup/Opener/Dialog#maxWidth
 * @cfg {Number} Максимально допустимая ширина всплывающего окна
 */
/**
 * @name Controls/_popup/Opener/Dialog#minWidth
 * @cfg {Number} Минимально допустимая ширина всплывающего окна
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
 *    <Controls.Button name="openDialogButton" caption="open dialog" on:click="_openDialog()"/>
 *    <Controls.Button name="closeDialogButton" caption="close dialog" on:click="_closeDialog()"/>
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
 * @description Dialog popup options.
 * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
 * @property {Boolean} modal Determines whether the window is modal.
 * @property {String} className Class names of popup.
 * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
 * @property {function|String} template Template inside popup.
 * @property {function|String} templateOptions Template options inside popup.
 * @property {Number} width Width of popup.
 * @property {Number} height Height of popup.
 * @property {Number} maxHeight The maximum height of popup.
 * @property {Number} minHeight The minimum height of popup.
 * @property {Number} maxWidth The maximum width of popup.
 * @property {Number} minWidth The minimum width of popup.
 * @property {Number} top Distance from the window to the top of the screen.
 * @property {Number} left Distance from the window to the left border of the screen.
 */
