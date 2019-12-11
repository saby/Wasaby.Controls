import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import coreMerge = require('Core/core-merge');

/**
 * Контрол, открывающий окно, которое позиционируется в правом нижнем углу окна браузера. Одновременно может быть открыто несколько окон уведомлений. В этом случае они выстраиваются в стек по вертикали.
 * @remark
 * Подробнее о работе с контролом читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ здесь}.
 * См. <a href="/materials/demo-ws4-notification">демо-пример</a>.
 * @class Controls/_popup/Opener/Notification
 * @control
 * @public
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/NotificationPG
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
 * @cfg {String|Function} Опции для контрола, переданного в {@link template}
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

const POPUP_CONTROLLER = 'Controls/popupTemplate:NotificationController';

const BASE_OPTIONS = {
    autofocus: false,
    autoClose: true
};

const clearPopupIds = (self) : void => {
    if (!self.isOpened()) {
        self._notificationId = null;
    }
};

const compatibleOpen = (popupOptions): Promise<string> => {
    const config = BaseOpener.getConfig({}, popupOptions);
    delete config.id;
    return new Promise((resolve) => {
        Promise.all([
            BaseOpener.requireModule('Controls/compatiblePopup:BaseOpener'),
            BaseOpener.requireModule('SBIS3.CONTROLS/Utils/InformationPopupManager'),
            BaseOpener.requireModule('Controls/compatiblePopup:OldNotification'),
            BaseOpener.requireModule(config.template)
        ]).then((results) => {
            const BaseOpenerCompat = results[0], InformationPopupManager = results[1];
            config.template = results[3];
            const compatibleConfig = getCompatibleConfig(BaseOpenerCompat, config);
            const popupId = InformationPopupManager.showNotification(compatibleConfig, compatibleConfig.notHide);
            resolve(popupId);
        });
    });
};

const getCompatibleConfig = (BaseOpenerCompat, config) => {
    const cfg = BaseOpenerCompat.prepareNotificationConfig(config);
    cfg.notHide = !cfg.autoClose;
    return cfg;
};

class Notification extends BaseOpener {
    _notificationId: string = '';

    isOpened(): boolean {
        return !!ManagerController.find(this._notificationId);
    }

    open(popupOptions) {
        const config = {...this._options, ...popupOptions};
        clearPopupIds(this);
        config.id = this._notificationId;
        return Notification.openPopup(config, this._notificationId).then((popupId) => {
            this._notificationId = popupId;
            return popupId;
        });
    }

    close() : void {
        Notification.closePopup(this._notificationId);
        this._compatibleClose(this);
    }

    static openPopup(config: object): Promise<string> {
        return new Promise((resolve) => {
            const newConfig = BaseOpener.getConfig(BASE_OPTIONS, config);
            if (isNewEnvironment()) {
                if (!newConfig.hasOwnProperty('opener')) {
                    newConfig.opener = null;
                }
                BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
                    BaseOpener.showDialog(result[0], newConfig, result[1]).then((popupId: string) => {
                        resolve(popupId);
                    });
                });
            } else {
                compatibleOpen(newConfig).then((popupId: string) => {
                    resolve(popupId);
                });
            }
        });
    }

    static closePopup (popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }

    static getDefaultOptions() {
         return coreMerge(BaseOpener.getDefaultOptions(), BASE_OPTIONS);
    }

    private _compatibleClose(self) : void {
        // Close popup on old page
        if (!isNewEnvironment()) {
            if (self._notificationId && self._notificationId.close) {
                self._notificationId.close();
            }
            self._notificationId = null;
        }
    }

    private _getCompatibleConfig(BaseOpenerCompat, config) {
        return getCompatibleConfig(BaseOpenerCompat, config);
    }
}

export default Notification;
