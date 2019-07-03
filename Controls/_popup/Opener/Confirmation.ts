import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import Deferred = require('Core/Deferred');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');

/**
 * Контрол, открывающий диалог подтверждения.
 * Окно блокирует работу пользователя с родительским приложением.
 * Позиционируется в центре экрана.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/ Подробнее}
 * <a href="/materials/demo-ws4-confirmation">Demo-example</a>.
 *
 * @class Controls/_popup/Opener/Confirmation
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @demo Controls-demo/Popup/Opener/ConfirmationPG
 */

/**
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
 * @cfg {String} Тип диалогового окна. Определяет с каким результатом будет закрыто окно подтверждения.
 * @variant ok (Результат: undefined)
 * @variant yesno (Результат: true/false)
 * @variant yesnocancel (Результат: true/false/undefined)
 */

/*
 * @name Controls/_popup/Opener/Confirmation#type
 * @cfg {String} Type of dialog. Determines  the result of  the confirmation window closed.
 * @variant ok (undefined)
 * @variant yesno  ( true/false)
 * @variant yesnocancel  (true/false/undefined)
 */

/**
 * @name Controls/_popup/Opener/Confirmation#style
 * @cfg {String} Внешний вид диалога подтверждения.
 * @variant default
 * @variant success
 * @variant danger
 */

/*
 * @name Controls/_popup/Opener/Confirmation#style
 * @cfg {String} Confirmation display style
 * @variant default
 * @variant success
 * @variant danger
 */

/**
 * @name Controls/_popup/Opener/Confirmation#size
 * @cfg {String} Размер диалога подтверждения. Размер меняется автоматически, если длина основного сообщения превышает
 * 100 символов или длина дополнительного текста превышает 160 символов.
 * @variant m (ширина 350px)
 * @variant l (ширина 440px)
 */

/*
 * @name Controls/_popup/Opener/Confirmation#size
 * @cfg {String} Confirmation size
 * @variant m
 * @variant l
 */

/**
 * @name Controls/_popup/Opener/Confirmation#message
 * @cfg {String} Основной текст диалога подтверждения.
 */

/*
 * @name Controls/_popup/Opener/Confirmation#message
 * @cfg {String} Main text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#details
 * @cfg {String} Дополнительный текст диалога подтверждения
 */

/*
 * @name Controls/_popup/Opener/Confirmation#details
 * @cfg {String} Additional text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#yesCaption
 * @cfg {String} Текст кнопки подтверждения.
 */

/*
 * @name Controls/_popup/Opener/Confirmation#yesCaption
 * @cfg {String} Сonfirmation button text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#noCaption
 * @cfg {String} Текст кнопки отрицания
 */

/*
 * @name Controls/_popup/Opener/Confirmation#noCaption
 * @cfg {String} Negation button text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#cancelCaption
 * @cfg {String} Текс кнопки отмены
 */

/*
 * @name Controls/_popup/Opener/Confirmation#cancelCaption
 * @cfg {String}    Cancel button text
 */

/**
 * @name Controls/_popup/Opener/Confirmation#PrimaryAction
 * @cfg {String} Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 * @variant yes
 * @variant no
 */

/*
 * @name Controls/_popup/Opener/Confirmation#PrimaryAction
 * @cfg {String} Determines which button is activated when ctrl+enter is pressed
 * @variant yes
 * @variant no
 */

/**
 * @name Controls/_popup/Opener/Confirmation#okCaption
 * @cfg {String} Текст кнопки "принять"
*/

/*
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
     * @description Возвращает информацию о том, открыто ли всплывающее окно.
     */

    /**
     * Метод открытия окна подтверждения.
     * @function Controls/_popup/Opener/Confirmation#open
     * @param {popupOptions[]} templateOptions Конфигурация диалога подтверждения.
     * @returns {Deferred} Результат будет возвращен после того, как пользователь закроет всплывающее окно.
     * @remark
     * 1. Если требуется открыть окно, без создания popup:Confirmation в верстке, см. метод {@link openPopup}.
     * 2. Если вы хотите использовать собственный шаблон в диалоге подтверждения используйте шаблон, смотрите
     * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/#config-template инструкцию}
     * @see openPopup
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Confirmation name="confirmationOpener">
     *    </Controls.popup:Confirmation>
     *
     *    <Controls.Button caption="open confirmation" on:click="_open()"/>
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
     *           this._children.confirmationOpener.open(config).addCallback(function(result) {
     *              if (result === true) {
     *                  console.log('Пользователь выбрал "Да"');
     *              } else if (result === false) {
     *                  console.log('Пользователь выбрал "Нет"');
     *              } else {
     *                  console.log('Пользователь выбрал "Отмена"');
     *              }
     *           });
     *        }
     *     });
     * </pre>
     */

    /*
     * Open confirmation popup.
     * @function Controls/_popup/Opener/Confirmation#open
     * @param {popupOptions[]} templateOptions Confirmation options.
     * @returns {Deferred} The deferral will end with the result when the user closes the popup.
     * @remark
     * If you want use custom layout in the dialog you need to open popup via {@link dialog opener} using the basic template {@link ConfirmationTemplate}.
     */
    open(templateOptions: object): Promise<boolean> {
        this._resultDef = new Deferred();
        const popupOptions = _private.getConfirmationConfig(templateOptions, this._closeHandler);
        Confirmation.superclass.open.call(this, popupOptions, POPUP_CONTROLLER);
        return this._resultDef;
    }

});

/**
 * Статический метод для открытия окна подтверждения. При использовании метода не требуется создавать popup:Confirmation в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/ Подробнее}.
 * @function Controls/_popup/Opener/Confirmation#openPopup
 * @param {popupOptions[]} templateOptions Конфигурация окна подтверждени
 * @return {Promise<boolean>} Результат будет возвращен после того, как пользователь закроет всплывающее окно.
 * @static
 * @see open
 * @example
 * js
 * <pre>
 *    import {Confirmation} from 'Controls/popup';
 *    ...
 *    openConfirmation() {
 *        Confirmation.openPopup({
 *          message: 'Choose yes or no'
 *        }).then(function(result) {
 *          if (result === true) {
 *              console.log('Пользователь выбрал "Да"');
 *          } else if (result === false) {
 *              console.log('Пользователь выбрал "Нет"');
 *          } else {
 *              console.log('Пользователь выбрал "Отмена"');
 *          }
 *        });
 *    }
 * </pre>
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
 * @description Конфигурация окна подтверждения.
 * @property {String} type Тип окна подтверждения.
 * @property {String} style Внешний вид окна подтверждения.
 * @property {String} message Основной текст окна подтверждения
 * @property {String} details Дополнительный текст окна подтверждения
 * @property {String} yesCaption Текст кнопки подтверждения.
 * @property {String} noCaption Текст кнопки отрицания.
 * @property {String} cancelCaption Текст кнопки отмены.
 * @property {String} okCaption Текст кнопки "принять".
 */
