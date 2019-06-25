import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import Env = require('Env/Env');
import {parse as load} from 'Core/library';

/**
 * Component that opens a popup that is positioned in the lower right corner of the browser window. Multiple notification Windows can be opened at the same time. In this case, they are stacked vertically. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
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
 * @cfg {String} Class names of popup.
 */
/**
 * @name Controls/_popup/Opener/Notification#template
 * @cfg {String|Function} Template inside popup.
 */

/**
 * @name Controls/_popup/Opener/Notification#templateOptions
 * @cfg {String|Function} Template options inside popup.
 */
const POPUP_CONTROLLER = 'Controls/popupTemplate:NotificationController';

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
     * Open dialog popup.
     * @function Controls/_popup/Opener/Notification#open
     * @param {PopupOptions[]} popupOptions Notification popup options.
     * @returns {Undefined}
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
     */
    open(popupOptions) {
        return new Promise((resolve) => {
            if (isNewEnvironment()) {
                BaseOpener.prototype.open.call(this, this._preparePopupOptions(popupOptions), POPUP_CONTROLLER)
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
    },

    _preparePopupOptions(popupOptions) {
        if (popupOptions && popupOptions.templateOptions && popupOptions.templateOptions.hasOwnProperty('autoClose')) {
            Env.IoC.resolve('ILogger').error(this._moduleName, 'The option "autoClose" must be specified on control options');
            popupOptions.autoClose = popupOptions.templateOptions.autoClose;
        }
        if (this._options.templateOptions && this._options.templateOptions.hasOwnProperty('autoClose')) {
            Env.IoC.resolve('ILogger').error(this._moduleName, 'The option "autoClose" must be specified on control options');
            this._options.autoClose = this._options.templateOptions.autoClose;
        }
        return popupOptions;
    }
});

/**
 * Open Notification popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
 * @function Controls/_popup/Opener/Notification#openPopup
 * @param {PopupOptions[]} config Notification popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
 * @static
 * @see closePopup
 */
Notification.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        if (isNewEnvironment()) {
            if (!config.hasOwnProperty('opener')) {
                config.opener = null;
            }
            const newConfig = BaseOpener.getConfig({}, {}, config);
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
 * Close Notification popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/ See more}.
 * @function Controls/_popup/Opener/Notification#closePopup
 * @param {String} popupId Id of popup.
 * @static
 * @see openPopup
 */
Notification.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Notification.getDefaultOptions = function() {
    return {
        autofocus: false,
        displayMode: 'multiple',
        autoClose: true
    };
};

Notification._private = _private;

export = Notification;

/**
 * @typedef {Object} PopupOptions
 * @description Sets the popup configuration.
 * @property {} autofocus Determines whether focus is set to the template when popup is opened.
 * @property {} className Class names of popup.
 * @property {} template Template inside popup.
 * @property {} templateOptions Template options inside popup.
 */

/**
 * @name Controls/_popup/Opener/Notification#close
 * @description Close popup.
 * @function
 */
/**
 * @name Controls/_popup/Opener/Notification#isOpened
 * @function
 * @description Popup opened status.
 */
