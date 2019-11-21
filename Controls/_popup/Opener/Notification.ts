import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import {parse as load} from 'Core/library';

/**
 *  Контрол, открывающий окно, которое позиционируется в правом нижнем углу окна браузера.
 *  Одновременно может быть открыто несколько окон уведомлений. В этом случае они выстраиваются в стек по вертикали.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ Подробнее}.
 *
 * <a href="/materials/demo-ws4-notification">Демо-пример</a>.
 * @class Controls/_popup/Opener/Notification
 * @control
 * @public
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/NotificationPG
 */

/*
 * Component that opens a popup that is positioned in the lower right corner of the browser window.
 * Multiple notification Windows can be opened at the same time. In this case, they are stacked vertically.
 *  {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
 */

/**
 * @name Controls/_popup/Opener/Notification#className
 * @cfg {String} Имена классов, которые будут применены к корневой ноде всплывающего окна.
 */
/**
 * @name Controls/_popup/Opener/Notification#template
 * @cfg {String|Function} Шаблон всплывающего окна
 */

/**
 * @name Controls/_popup/Opener/Notification#templateOptions
 * @cfg {String|Function} Опции для котнрола, переданного в {@link template}
 */
const POPUP_CONTROLLER = 'Controls/popupTemplate:NotificationController';

const BASE_OPTIONS = {
    autofocus: false,
    autoClose: true
};

const _private = {
    clearPopupIds(self) {
        if (!self.isOpened()) {
            self._notificationId = null;
        }
    },
    compatibleOpen(self, popupOptions): Promise<string> {
        const config = BaseOpener.getConfig({}, popupOptions);
        return new Promise((resolve) => {
            Promise.all([
                BaseOpener.requireModule('Controls/compatiblePopup:BaseOpener'),
                BaseOpener.requireModule('SBIS3.CONTROLS/Utils/InformationPopupManager'),
                BaseOpener.requireModule('Controls/compatiblePopup:OldNotification'),
                BaseOpener.requireModule(config.template)
            ]).then((results) => {
                const BaseOpenerCompat = results[0], InformationPopupManager = results[1];
                config.template = results[3];
                const compatibleConfig = _private.getCompatibleConfig(BaseOpenerCompat, config);
                const popupId = InformationPopupManager.showNotification(compatibleConfig, compatibleConfig.notHide);
                resolve(popupId);
            });
        });
    },

    _requireModule(module) {
        return typeof module === 'string' ? load(module) : Promise.resolve(module);
    },

    getCompatibleConfig(BaseOpenerCompat, config) {
        const cfg = BaseOpenerCompat.prepareNotificationConfig(config);
        cfg.notHide = !cfg.autoClose;
        return cfg;
    },

    compatibleClose(self) {
        // Close popup on old page
        if (!isNewEnvironment()) {
            if (self._notificationId && self._notificationId.close) {
                self._notificationId.close();
            }
            self._notificationId = null;
        }
    }
};

class Notification extends BaseOpener {
    _notificationId: string = '';
    /**
     * Метод открытия нотификационного окна.
     * Повторный вызов этого метода вызовет переририсовку контрола.
     * @function Controls/_popup/Opener/Notification#open
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

    isOpened(): boolean {
        return !!ManagerController.find(this._notificationId);
    }

    /*
     * Open dialog popup.
     * @function Controls/_popup/Opener/Notification#open
     * @param {PopupOptions} popupOptions Notification popup options.
     */

    open(popupOptions) {
        const config = {...this._options, ...popupOptions};
        _private.clearPopupIds(this);
        config.id = this._notificationId;
        return Notification.openPopup(config, this._notificationId).then((popupId) => {
            this._notificationId = popupId;
            return popupId;
        });
    }
    close() {
        Notification.closePopup(this._notificationId);
        _private.compatibleClose(this);
    }
}

/**
 * Статический метод для открытия нотификационного окна. При использовании метода не требуется создавать popup:Notification в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/#open-popup Подробнее}.
 * @function Controls/_popup/Opener/Notification#openPopup
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

/*
 * Open Notification popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
 * @function Controls/_popup/Opener/Notification#openPopup
 * @param {PopupOptions} config Notification popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
*/

Notification.openPopup = (config: object, id: string): Promise<string> => {
    return new Promise((resolve) => {
        const newConfig = BaseOpener.getConfig(BASE_OPTIONS, config);
        if (isNewEnvironment()) {
            if (!newConfig.hasOwnProperty('opener')) {
                newConfig.opener = null;
            }
            BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], newConfig, result[1], id).then((popupId: string) => {
                    resolve(popupId);
                });
            });

        } else {
            _private.compatibleOpen(this, newConfig).then((popupId: string) => {
                resolve(popupId);
            });
        }
    });
};

/**
 * Статический метод для закрытия окна по идентификатору.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/#open-popup Подробнее}.
 * @function Controls/_popup/Opener/Notification#closePopup
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

/*
 * Close Notification popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
 * @function Controls/_popup/Opener/Notification#closePopup
 * @param {String} popupId Id of popup.
*/

Notification.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Notification.getDefaultOptions = function() {
    const baseOpenerOptions = BaseOpener.getDefaultOptions();
    return {...baseOpenerOptions, ...BASE_OPTIONS};
};

Notification._private = _private;

export = Notification;

/**
 * @typedef {Object} PopupOptions
 * @description Sets the popup configuration.
 * @property {} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {} template Шаблон всплывающего окна
 * @property {} templateOptions Опции для котнрола, переданного в {@link template}
 */

/**
 * @name Controls/_popup/Opener/Notification#close
 * @description Метод закрытия нотификационного окна.
 * @function
 */
/**
 * @name Controls/_popup/Opener/Notification#isOpened
 * @function
 * @description  Возвращает информацию о том, открыто ли всплывающее окно.
 */

/*
 * @name Controls/_popup/Opener/Notification#isOpened
 * @function
 * @description Popup opened status.
 */
