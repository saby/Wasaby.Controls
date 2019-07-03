import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import {parse as load} from 'Core/library';

/**
 *  Контрол, открывающий окно, которое позиционируется в правом нижнем углу окна браузера.
 *  Одновременно может быть открыто несколько окон уведомлений. В этом случае они выстраиваются в стек по вертикали.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ Подробнее}.
 *
 * <a href="/materials/demo-ws4-notification">Demo-example</a>.
 * @class Controls/_popup/Opener/Notification
 * @control
 * @public
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/NotificationPG
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
 * @cfg {String|Function} Опции для шаблона всплывающего окна
 */
const POPUP_CONTROLLER = 'Controls/popupTemplate:NotificationController';

const BASE_OPTIONS = {
    autofocus: false,
    displayMode: 'multiple',
    autoClose: true
};

const _private = {
    compatibleOpen(self, popupOptions) {
        const config =  BaseOpener.getConfig({}, self ? self._options : {}, popupOptions);
        return Promise.all([
            BaseOpener.requireModule('Controls/compatiblePopup:BaseOpener'),
            BaseOpener.requireModule('SBIS3.CONTROLS/Utils/InformationPopupManager'),
            BaseOpener.requireModule('Controls/compatiblePopup:OldNotification'),
            BaseOpener.requireModule(config.template)
        ]).then(function(results) {
            const BaseOpenerCompat = results[0], InformationPopupManager = results[1];
            config.template = results[3];
            const compatibleConfig = _private.getCompatibleConfig(BaseOpenerCompat, config);
            const popupId = InformationPopupManager.showNotification(compatibleConfig, compatibleConfig.notHide);
            if (self) {
                if (!self._popup) {
                    self._popup = [];
                }
                self._popup.push(popupId);
            }
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
            if (self._popup) {
                for (let i = 0; i < self._popup.length; i++) {
                    self._popup[i].close();
                }
                self._popup = [];
            }
        }
    }
};

const Notification = BaseOpener.extend({

    /**
     * Метод открытия нотификационного окна.
     * Повторный вызов этого метода вызовет переририсовку контрола.
     * @function Controls/_popup/Opener/Notification#open
     * @param {PopupOptions[]} popupOptions Конфигурация нотифицационного окна
     * @remark
     * Если требуется открыть окно, без создания popup:Notification в верстке, см. метод {@link openPopup}.
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Notification name="notificationOpener">
     *       <ws:popupOptions template="wml!Controls/Template/NotificationTemplate">
     *       </ws:popupOptions>
     *    </Controls.popup:Notification>
     *
     *    <Controls.Button name="openNotificationButton" caption="open notification" on:click="_open()"/>
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
    open(popupOptions) {
        return new Promise((resolve) => {
            if (isNewEnvironment()) {
                BaseOpener.prototype.open.call(this, popupOptions, POPUP_CONTROLLER)
                    .then((popupId) => resolve(popupId));
            } else {
                _private.compatibleOpen(this, popupOptions);
                resolve();
            }
        });
    },
    close() {
        Notification.superclass.close.apply(this, arguments);
        _private.compatibleClose(this);
    }
});

/**
 * Статический метод для открытия нотификационного окна. При использовании метода не требуется создавать popup:Notification в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ Подробнее}.
 * @function Controls/_popup/Opener/Notification#openPopup
 * @param {PopupOptions[]} config Конфигурация нотификационного окна
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
 *          this._popupId = popupId;
 *        });
 *    },
 *
 *    closeNotification() {
 *       Notification.closePopup(this._popupId);
 *    }
 * </pre>
 * @see closePopup
 * @see close
 * @see open
 */
Notification.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        if (isNewEnvironment()) {
            if (!config.hasOwnProperty('opener')) {
                config.opener = null;
            }
            const newConfig = BaseOpener.getConfig({}, BASE_OPTIONS, config);
            BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], newConfig, result[1]).then((popupId: string) => {
                    resolve(popupId);
                });
            });

        } else {
            _private.compatibleOpen(this, config);
            resolve();
        }

    });
};

/**
 * Статический метод для закрытия окна по идентификатору.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ Подробнее}.
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
 *          this._popupId = popupId;
 *        });
 *    },
 *
 *    closeNotification() {
 *       Notification.closePopup(this._popupId);
 *    }
 * </pre>
 * @see openPopup
 * @see opener
 * @see close
 */
Notification.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Notification.getDefaultOptions = function() {
    return BASE_OPTIONS;
};

Notification._private = _private;

export = Notification;

/**
 * @typedef {Object} PopupOptions
 * @description Sets the popup configuration.
 * @property {} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {} template Шаблон всплывающего окна
 * @property {} templateOptions Опции для шаблона всплывающего окна
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
