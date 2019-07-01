import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import Deferred = require('Core/Deferred');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');

/**
 * Component that opens the confirmation popup.
 * <a href="/materials/demo-ws4-confirmation">Demo-example</a>.
 *
 * @class Controls/_popup/Opener/Confirmation
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @demo Controls-demo/Popup/Opener/ConfirmationPG
 *
 * @css @font-size_SubmitPopup-message Font-size of message.
 * @css @font-weight_SubmitPopup-message Font-weight of message.
 * @css @color_SubmitPopup-message Color of message.
 * @css @spacing_SubmitPopup-between-message-border-bottom Spacing between message and border-bottom.
 *
 * @css @font-size_SubmitPopup-details Font-size of details.
 * @css @color_SubmitPopup-details Color of details.
 *
 * @css @height_SubmitPopup-button Height of buttons.
 * @css @spacing_SubmitPopup-between-button-border Spacing between border and button.
 * @css @min-width_SubmitPopup-button Min-width of buttons.
 * @css @min-width_SubmitPopup-button-small Min-width of small buttons.
 */

/**
 * @name Controls/_popup/Opener/Confirmation#type
 * @cfg {String} Type of dialog. Determines  the result of  the confirmation window closed.
 * @variant ok (undefined)
 * @variant yesno  ( true/false)
 * @variant yesnocancel  (true/false/undefined)
 */

/**
 * @name Controls/_popup/Opener/Confirmation#style
 * @cfg {String} Confirmation display style
 * @variant default
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/_popup/Opener/Confirmation#size
 * @cfg {String} Confirmation size
 * @variant m
 * @variant l
 */

/**
 * @name Controls/_popup/Opener/Confirmation#message
 * @cfg {String} Main text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#details
 * @cfg {String} Additional text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#yesCaption
 * @cfg {String} Сonfirmation button text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#noCaption
 * @cfg {String} Negation button text
 */
/**
 * @name Controls/_popup/Opener/Confirmation#cancelCaption
 * @cfg {String}    Cancel button text
 */
/**
 * @name Controls/_popup/Opener/Confirmation#PrimaryAction
 * @cfg {String} Determines which button is activated when ctrl+enter is pressed
 * @variant yes
 * @variant no
 */
/**
 * @name Controls/_popup/Opener/Confirmation#okCaption
 * @cfg {String} Accept button text
 */

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

const _private = {
    getConfirmationConfig(templateOptions: object, closeHandler: Function): object {
        templateOptions.closeHandler = closeHandler;
        const popupOptions = {
            template: 'Controls/popupTemplate:ConfirmationDialog',
            modal: true,
            opener: null,
            className: 'controls-Confirmation_popup',
            templateOptions
        };
        _private.compatibleOptions(popupOptions);
        return popupOptions;
    },
    compatibleOptions(popupOptions) {
        popupOptions.zIndex = popupOptions.zIndex || popupOptions.templateOptions.zIndex;
        if (!isNewEnvironment()) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = 5000;
        }
    }
};

const Confirmation = BaseOpener.extend({
    _resultDef: null,
    _openerResultHandler: null,

    _beforeMount() {
        this._closeHandler = this._closeHandler.bind(this);
        Confirmation.superclass._beforeMount.apply(this, arguments);
    },

    _closeHandler(res) {
        if (this._resultDef) {
            this._resultDef.callback(res);
            this._resultDef = null;
        }
    },

    /**
     * @name Controls/_popup/Opener/Confirmation#isOpened
     * @function
     * @description Popup opened status.
     */

    /**
     * Close popup.
     * @function Controls/_popup/Opener/Confirmation#close
     */

    /**
     * Open confirmation popup.
     * @function Controls/_popup/Opener/Confirmation#open
     * @param {popupOptions[]} templateOptions Confirmation options.
     * @returns {Deferred} The deferral will end with the result when the user closes the popup.
     * @remark
     * If you want use custom layout in the dialog you need to open popup via {@link dialog opener} using the basic template {@link ConfirmationTemplate}.
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Confirmation name="confirmationOpener">
     *    </Controls.popup:Confirmation>
     *
     *    <Controls.Button name="openConfirmation" caption="open confirmation" on:click="_open()"/>
     * </pre>
     * js
     * <pre>
     *     Control.extend({
     *       ...
     *
     *        _open() {
     *           var config= {
     *              message: 'Save changes?'
     *              type: 'yesnocancel'
     *           }
     *           this._children.confirmationOpener.open(config)
     *        }
     *     });
     * </pre>
     */
    open(templateOptions: object): Promise<boolean> {
        this._resultDef = new Deferred();
        const popupOptions = _private.getConfirmationConfig(templateOptions, this._closeHandler);
        Confirmation.superclass.open.call(this, popupOptions, POPUP_CONTROLLER);
        return this._resultDef;
    }

});

/**
 * Open Confirmation popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/ See more}.
 * @function Controls/_popup/Opener/Confirmation#openPopup
 * @param {popupOptions[]} templateOptions Confirmation options.
 * @return {Promise<boolean>} Promise that ending with user choice results
 * @static
 */
Confirmation.openPopup = (templateOptions: object) => {
    return new Promise((resolve) => {
        const config = _private.getConfirmationConfig(templateOptions, resolve);
        config._vdomOnOldPage = true;
        return BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
            BaseOpener.showDialog(result[0], config, result[1]);
        });
    });
};

Confirmation.getDefaultOptions = () => {
    return {
        _vdomOnOldPage: true // Open vdom popup in the old environment
    };
};

export = Confirmation;

/**
 * @typedef {Object} popupOptions
 * @description Confirmation configuration.
 * @property {String} type Type of dialog.
 * @property {String} style Confirmation display style.
 * @property {String} message Main text.
 * @property {String} details Additional text.
 * @property {String} yesCaption Сonfirmation button text.
 * @property {String} noCaption Negation button text.
 * @property {String} cancelCaption Cancel button text.
 * @property {String} okCaption Accept text button.
 */
