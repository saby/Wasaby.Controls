import cClone = require('Core/core-clone');
import Env = require('Env/Env');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import getZIndex = require('Controls/Utils/getZIndex');
import {DefaultOpenerFinder} from "UI/Focus";

/**
 * Component that opens a popup that is positioned relative to a specified element. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ see more}.
 * @remark
 * Private control. This control uses Popup/Infobox and Application to open popup on openInfobox events
 * @class Controls/_popup/Opener/InfoBox
 * @extends Core/Control
 * @mixes Controls/interface/IInfoboxOptions
 *
 * @private
 * @control
 * @category Popup
 * @author Красильников А.С.
 * @private
 */

/**
 * @typedef {Object} Config
 * @description Infobox configuration.
 * @property {String|Function} template Template inside popup
 * @property {Object} templateOptions Template options inside popup.
 * @property {Node} target The target relative to which the popup is positioned.
 * @property {String} position Point positioning of the target relative to infobox.
 * @property {String} message The text in the body popup.
 * @property {Boolean} floatCloseButton Whether the content should wrap around the cross closure.
 * @property {String} style Infobox display style.
 * @property {Number} showDelay Delay before opening.
 */

/**
 * @name Controls/interface/IInfoboxOptions#config
 * @cfg {Config[]} Infobox options.
 */

const INFOBOX_HIDE_DELAY = 300;
const INFOBOX_SHOW_DELAY = 300;
const POPUP_CONTROLLER = 'Controls/popupTemplate:InfoBoxController';
let InfoBoxId;

// Default popup configuration
const DEFAULT_CONFIG = {
    style: 'secondary',
    position: 'tl',
    targetSide: 'top',
    alignment: 'start',
    floatCloseButton: false,
    closeOnOutsideClick: true,
    hideDelay: INFOBOX_HIDE_DELAY,
    showDelay: INFOBOX_SHOW_DELAY
};

const _private = {
    getInfoBoxConfig(cfg: object): object {
        // smart merge of two objects. Standart "core-merge util" will rewrite field value of first object even if value of second object will be undefined
        const newCfg = cClone(DEFAULT_CONFIG);
        for (const i in cfg) {
            if (cfg.hasOwnProperty(i)) {
                if (cfg[i] !== undefined) {
                    newCfg[i] = cfg[i];
                }
            }
        }

        if (cfg.targetSide || cfg.alignment) {
            newCfg.position = _private.preparePosition(cfg.targetSide, cfg.alignment);
        }

        // Find opener for InfoBox
        if (!newCfg.opener) {
            newCfg.opener = DefaultOpenerFinder.find(newCfg.target);
        }
        if (!isNewEnvironment()) {
            // For the old page, set the zIndex manually
            //InfoBox must be above all the popup windows on the page.
            newCfg.zIndex = 10000;
        }
        return {
            target: newCfg.target && newCfg.target[0] || newCfg.target, // todo: https://online.sbis.ru/doc/7c921a5b-8882-4fd5-9b06-77950cbe2f79
            position: newCfg.position,
            autofocus: false,
            maxWidth: newCfg.maxWidth,
            zIndex: newCfg.zIndex || getZIndex(newCfg.opener || this),
            eventHandlers: newCfg.eventHandlers,
            _elementFromPoint: newCfg._elementFromPoint,
            closeOnOutsideClick: newCfg.closeOnOutsideClick,
            opener: newCfg.opener,
            templateOptions: { // for template: Opener/InfoBox/resources/template
                template: newCfg.template,
                templateOptions: newCfg.templateOptions, // for user template: newCfg.template
                message: newCfg.message,
                styleType: newCfg.styleType || 'marker',
                style: newCfg.style || 'secondary',
                floatCloseButton: newCfg.floatCloseButton
            },
            template: 'Controls/popupTemplate:templateInfoBox'
        };
    },
    preparePosition(targetSide, alignment) {
        let position = targetSide[0];
        const leftRight = {
            start: 't',
            center: 'c',
            end: 'b'
        };
        const topBottom = {
            start: 'l',
            center: 'c',
            end: 'r'
        };
        if (targetSide === 'left' || targetSide === 'right') {
            position += leftRight[alignment];
        } else {
            position += topBottom[alignment];
        }
        return position;
    }

};

class InfoBox extends BaseOpener {
    _openId: number = null;
    _closeId: number = null;
    _style: number = null;

    /**
     * @name Controls/_popup/Opener/Infobox#isOpened
     * @function
     * @description Popup opened status.
     */

    /**
     * Open popup.
     * @function Controls/_popup/Opener/InfoBox#open
     * @param {Object} Config
     * @returns {undefined}
     * @example
     * js
     * <pre>
     *   Control.extend({
     *      ...
     *
     *      _openInfobox() {
     *          var config= {
     *              message: 'My tooltip'
     *              target: this._children.buttonTarget //dom node
     *          }
     *          this._notify('openInfoBox', [config], {bubbling: true});
     *      }
     *
     *      _closeInfobox() {
     *          this._notify('closeInfoBox', [], {bubbling: true});
     *      }
     *   });
     * </pre>
     */

    _beforeUnmount() {
        this.close(0);
    }

    open(cfg) {
        // Only one popup can be opened
        if (this.isOpened()) {
            this.close(0);
        }
        this._clearTimeout();

        const newCfg = _private.getInfoBoxConfig(cfg);
        if (newCfg.showDelay > 0) {
            this._openId = setTimeout(this._open.bind(this, newCfg), newCfg.showDelay);
        } else {
            this._open(newCfg);
        }
    }
    _open(cfg) {
        super.open(cfg, POPUP_CONTROLLER);
    }

    /**
     * Close popup.
     * @function Controls/_popup/Opener/InfoBox#close
     */
    close(delay) {
        delay = delay === undefined ? INFOBOX_HIDE_DELAY : delay;
        this._clearTimeout();
        if (delay > 0) {
            this._closeId = setTimeout(super.close.bind(this), delay);
        } else {
            super.close();
        }
    }

    _closeOnTargetScroll() {
        this.close(0);
    }

    _clearTimeout() {
        clearTimeout(this._openId);
        clearTimeout(this._closeId);
    }
}

/**
 * Open InfoBox popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/Opener/InfoBox#openPopup
 * @param {Object} config InfoBox options. See {@link Controls/_popup/InfoBox description}.
 * @static
 * @see closePopup
 */
InfoBox.openPopup = (config: object): void => {
    const newCfg = _private.getInfoBoxConfig(config);
    newCfg._vdomOnOldPage = true;
    BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
        BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
            InfoBoxId = popupId;
        });
    });
};

/**
 * Close InfoBox popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ See more}.
 * @function Controls/_popup/Opener/InfoBox#closeInfoBox
 * @see openPopup
 * @static
 */
InfoBox.closePopup = (): void => {
    BaseOpener.closeDialog(InfoBoxId);
};

InfoBox.getDefaultOptions = () => {
    const options = BaseOpener.getDefaultOptions();

    options.actionOnScroll = 'close';
    options._vdomOnOldPage = true; // Open vdom popup in the old environment
    return options;
};

export default InfoBox;
