import BaseOpener, {IBaseOpenerOptions, ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import {Logger} from 'UI/Utils';
import * as coreMerge from 'Core/core-merge';
import {IDialogOpener, IDialogPopupOptions} from 'Controls/_popup/interface/IDialog';
/**
 * Контрол, открывающий всплывающее окно, которое позиционируется по центру экрана.
 * @remark
 * Подробнее о работе с контролом читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup здесь}.
 * См. <a href="/materials/demo-ws4-stack-dialog">демо-пример</a>.
 * @class Controls/_popup/Opener/Dialog
 * @extends Controls/_popup/Opener/BaseOpener
 * @mixes Controls/_popup/interface/IBaseOpener
 * @mixes Controls/_popup/interface/IDialog
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

interface IDialogOpenerOptions extends IDialogPopupOptions, IBaseOpenerOptions {}

const getDialogConfig = (config: IDialogOpenerOptions): IDialogOpenerOptions => {
    config = config || {};
    // The dialog is isDefaultOpener by default. For more information,
    // see  {@link Controls/interface/ICanBeDefaultOpener}
    config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    config._vdomOnOldPage = true; // Открывается всегда вдомным
    return config;
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Dialog extends BaseOpener<IDialogOpenerOptions> implements IDialogOpener {
    readonly '[Controls/_popup/interface/IDialogOpener]': boolean;

    open(popupOptions: IDialogOpenerOptions): Promise<string | undefined> {
        return super.open(this._getDialogConfig(popupOptions), POPUP_CONTROLLER);
    }

    private _getDialogConfig(popupOptions: IDialogOpenerOptions): IDialogOpenerOptions {
        return getDialogConfig(popupOptions);
    }

    static openPopup(config: IDialogOpenerOptions): Promise<string> {
        return new Promise((resolve) => {
            const newCfg = getDialogConfig(config);
            if (!newCfg.hasOwnProperty('opener')) {
                Logger.error(Dialog.prototype._moduleName + ': Для открытия окна через статический метод, обязательно нужно указать опцию opener');
            }
            BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result: ILoadDependencies) => {
                BaseOpener.showDialog(result.template, newCfg, result.controller).then((popupId: string) => {
                    resolve(popupId);
                });
            });
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }

    static getDefaultOptions(): IDialogOpenerOptions {
        // На старом WindowManager пофиксили все известные баги, пробую все стики окна открывать всегда вдомными
        return coreMerge(BaseOpener.getDefaultOptions(), {_vdomOnOldPage: true});
    }
}

export default Dialog;
