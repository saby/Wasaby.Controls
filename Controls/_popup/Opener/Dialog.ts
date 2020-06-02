import BaseOpener, {IBaseOpenerOptions, ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import {Logger} from 'UI/Utils';
import {IDialogOpener, IDialogPopupOptions} from 'Controls/_popup/interface/IDialog';
import {IPropStorage, IPropStorageOptions} from 'Controls/interface';

/**
 * Контрол, открывающий всплывающее окно, которое позиционируется по центру экрана.
 *
 * @remark
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FPopup%2FOpener%2FStackDemo">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_popupTemplate.less">переменные тем оформления</a>
 *
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

interface IDialogOpenerOptions extends IDialogPopupOptions, IBaseOpenerOptions, IPropStorageOptions {}

const getDialogConfig = (config: IDialogOpenerOptions): IDialogOpenerOptions => {
    config = config || {};
    // The dialog is isDefaultOpener by default. For more information,
    // see  {@link Controls/interface/ICanBeDefaultOpener}
    config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    return config;
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:DialogController';

class Dialog extends BaseOpener<IDialogOpenerOptions> implements IDialogOpener, IPropStorage {
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
}

export default Dialog;
