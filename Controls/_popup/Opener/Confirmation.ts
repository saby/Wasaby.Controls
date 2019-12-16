import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import * as Deferred from 'Core/Deferred';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import {default as IConfirmation, IConfirmationOptions} from 'Controls/_popup/Opener/interface/IConfirmation';
export interface IPopupOptions {
    template?: String | Function;
    zIndex?: Number;
    templateOptions?: IConfirmationOptions;
    modal?: Boolean;
    autofocus?: Boolean;
    className?: String;
    isCentered?: boolean;
    _vdomOnOldPage?: Boolean;
}

/**
 * Контрол, открывающий диалог подтверждения. Диалог позиционируется в центре экрана, а также блокирует работу пользователя с родительским приложением.
 * @remark
 * Подробнее о работе с контролом читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/ здесь}.
 * См. <a href="/materials/demo-ws4-confirmation">демо-пример</a>.
 * @class Controls/_popup/Opener/Confirmation
 * @extends Controls/_popup/Opener/BaseOpener
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @implements Controls/_popup/Opener/interface/IConfirmation
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
 * @name Controls/_popup/Opener/Confirmation#isOpened
 * @function
 * @description Возвращает информацию о том, открыто ли всплывающее окно.
 */

/**
 * Метод открытия окна подтверждения.
 * @function Controls/_popup/Opener/Confirmation#open
 * @param {Controls/popup:IConfirmation} IConfirmationOptions Конфигурация диалога подтверждения.
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
 * @param {PopupOptions} templateOptions Confirmation options.
 * @returns {Deferred} The deferral will end with the result when the user closes the popup.
 * @remark
 * If you want use custom layout in the dialog you need to open popup via {@link dialog opener} using the basic template {@link ConfirmationTemplate}.
 */

/**
 * Статический метод для открытия окна подтверждения. При использовании метода не требуется создавать popup:Confirmation в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/confirmation/#open-popup Подробнее}.
 * @function Controls/_popup/Opener/Confirmation#openPopup
 * @param {Controls/popup:IConfirmation} IConfirmationOptions Конфигурация окна подтверждения
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

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Confirmation extends BaseOpener<IConfirmationOptions> implements IConfirmation {
    '[Controls/_popup/Opener/interface/IConfirmation]': boolean = true;
    private _resultDef: Deferred<boolean> = null;

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
    private static _compatibleOptions(popupOptions: IPopupOptions): void {
        popupOptions.zIndex = popupOptions.zIndex || popupOptions.templateOptions.zIndex;
        if (!isNewEnvironment()) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = 5000;
        }
    }

    private static _getConfirmationConfig(templateOptions: IConfirmationOptions, closeHandler: Function): IPopupOptions {
        templateOptions.closeHandler = closeHandler;
        const popupOptions: IPopupOptions = {
            template: 'Controls/popupTemplate:ConfirmationDialog',
            modal: true,
            autofocus: true,
            className: 'controls-Confirmation_popup',
            isCentered: true,
            templateOptions
        };
        Confirmation._compatibleOptions(popupOptions);
        return popupOptions;
    }

     open(templateOptions: IConfirmationOptions): Promise<boolean> {
        this._resultDef = new Deferred();
        const popupOptions: IPopupOptions = Confirmation._getConfirmationConfig(templateOptions, this._closeHandler);
        super.open.call(this, popupOptions, POPUP_CONTROLLER);
        return this._resultDef;
    }

    static getDefaultOptions(): IPopupOptions {
        return {
            _vdomOnOldPage: true // Open vdom popup in the old environment
        };
    }
    static openPopup(templateOptions: IConfirmationOptions) : Promise<boolean>  {
        return new Promise((resolve) => {
            const config: IPopupOptions = Confirmation._getConfirmationConfig(templateOptions, resolve);
            config._vdomOnOldPage = true;
            return BaseOpener.requireModules(config, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], config, result[1]);
            });
        });
    };
}

export default Confirmation;
