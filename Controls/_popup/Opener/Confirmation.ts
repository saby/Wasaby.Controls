import * as BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import * as Deferred from 'Core/Deferred';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';

export interface IConfirmationOptions {
    type?: string;
    style?: string;
    size?: string;
    message?: string;
    details?: string;
    yesCaption?: string;
    noCaption?: string;
    cancelCaption?: string;
    primaryAction?: string;
    okCaption?: string;
}

export interface IPopupOptions {
    template?: String | Function;
    zIndex?: Number;
    templateOptions?: IConfirmationOptions;
    modal?: Boolean;
    autofocus?: Boolean;
    className?: String;
}

/**
 * Контрол, открывающий диалог подтверждения.
 * Окно блокирует работу пользователя с родительским приложением.
 * Позиционируется в центре экрана.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/ Подробнее}
 * <a href="/materials/demo-ws4-confirmation">Демо-пример</a>.
 *
 * @class Controls/_popup/Opener/Confirmation
 * @extends Controls/_popup/Opener/BaseOpener
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @demo Controls-demo/Popup/Opener/ConfirmationPG
 */

/*
 * Component that opens the confirmation popup.
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
 * @default yesno
 */

/*
 * @name Controls/_popup/Opener/Confirmation#type
 * @cfg {String} Type of dialog. Determines  the result of  the confirmation window closed.
 * @variant ok (undefined)
 * @variant yesno  ( true/false)
 * @variant yesnocancel  (true/false/undefined)
 * @default yesno
 */

/**
 * @name Controls/_popup/Opener/Confirmation#style
 * @cfg {String} Внешний вид диалога подтверждения.
 * @variant default
 * @variant success
 * @variant danger
 * @default default
 */

/*
 * @name Controls/_popup/Opener/Confirmation#style
 * @cfg {String} Confirmation display style
 * @variant default
 * @variant success
 * @variant danger
 * @default default
 */

/**
 * @name Controls/_popup/Opener/Confirmation#size
 * @cfg {String} Размер диалога подтверждения. Размер меняется автоматически, если длина основного сообщения превышает
 * 100 символов или длина дополнительного текста превышает 160 символов.
 * @variant m (ширина 350px)
 * @variant l (ширина 440px)
 * @default m
 */

/*
 * @name Controls/_popup/Opener/Confirmation#size
 * @cfg {String} Confirmation size
 * @variant m
 * @variant l
 * @default m
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
 * @default Да
 */

/*
 * @name Controls/_popup/Opener/Confirmation#yesCaption
 * @cfg {String} Сonfirmation button text
 * @default Yes
 */

/**
 * @name Controls/_popup/Opener/Confirmation#noCaption
 * @cfg {String} Текст кнопки отрицания
 * @default Нет
 */

/*
 * @name Controls/_popup/Opener/Confirmation#noCaption
 * @cfg {String} Negation button text
 * @default No
 */

/**
 * @name Controls/_popup/Opener/Confirmation#cancelCaption
 * @cfg {String} Текст кнопки отмены
 * @default Отмена
 */

/*
 * @name Controls/_popup/Opener/Confirmation#cancelCaption
 * @cfg {String} Cancel button text
 * @default Cancel
 */

/**
 * @name Controls/_popup/Opener/Confirmation#primaryAction
 * @cfg {String} Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 * @variant yes
 * @variant no
 * @default yes
 */

/*
 * @name Controls/_popup/Opener/Confirmation#primaryAction
 * @cfg {String} Determines which button is activated when ctrl+enter is pressed
 * @variant yes
 * @variant no
 * @default yes
 */

/**
 * @name Controls/_popup/Opener/Confirmation#okCaption
 * @cfg {String} Текст кнопки "принять"
 * @default ОК
 */

/*
 * @name Controls/_popup/Opener/Confirmation#okCaption
 * @cfg {String} Accept button text
 * @default OK
 */

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Confirmation extends BaseOpener<IConfirmationOptions> {
    private _resultDef: null;

    protected _beforeMount(options: IConfirmationOptions): void {
        this._closeHandler = this._closeHandler.bind(this);
        super._beforeMount(options);
    }

    private _closeHandler(result: boolean | undefined): void {
        if (this._resultDef) {
            this._resultDef.callback(result);
            this._resultDef = null;
        }
    }
    private static compatibleOptions(popupOptions: IPopupOptions): void {
        popupOptions.zIndex = popupOptions.zIndex || popupOptions.templateOptions.zIndex;
        if (!isNewEnvironment()) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = 5000;
        }
    }

    private static getConfirmationConfig(templateOptions: IConfirmationOptions, closeHandler: Function): IPopupOptions {
        templateOptions.closeHandler = closeHandler;
        const popupOptions: IPopupOptions = {
            template: 'Controls/popupTemplate:ConfirmationDialog',
            modal: true,
            autofocus: templateOptions.autofocus, // TODO: в 700 безусловно без опции, для того, чтобы можно было работать с клавиатуры
            className: 'controls-Confirmation_popup',
            templateOptions
        };
        Confirmation.compatibleOptions(popupOptions);
        return popupOptions;
    }

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
     * 1. Если требуется открыть окно, без создания popup:Confirmation в верстке, следует использовать статический метод {@link openPopup}
     * 2. Если вы хотите использовать собственный шаблон в диалоге подтверждения используйте шаблон, смотрите
     * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/#config-template инструкцию}
     * @see openPopup
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Confirmation name="confirmationOpener">
     *    </Controls.popup:Confirmation>
     *
     *    <Controls.buttons:Button caption="open confirmation" on:click="_open()"/>
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
    protected open(templateOptions: IConfirmationOptions): Promise<boolean> {
        this._resultDef = new Deferred();
        const popupOptions = Confirmation.getConfirmationConfig(templateOptions, this._closeHandler);
        super.open.call(this, popupOptions, POPUP_CONTROLLER);
        return this._resultDef;
    }

    static getDefaultOptions(): object {
        return {
            _vdomOnOldPage: true // Open vdom popup in the old environment
        };
    }
    static openPopup (templateOptions: IConfirmationOptions) : Promise<boolean>  {
        return new Promise((resolve) => {
            const config = Confirmation.getConfirmationConfig(templateOptions, resolve);
            config._vdomOnOldPage = true;
            return BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], config, result[1]);
            });
        });
    };
}

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

export default Confirmation;

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
 * @property {String} primaryAction Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 */
