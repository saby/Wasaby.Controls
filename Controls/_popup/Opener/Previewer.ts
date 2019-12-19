import cClone = require('Core/core-clone');
import BaseOpener, {ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import randomId = require('Core/helpers/Number/randomId');

const DISPLAY_DURATION: number = 1000;
const POPUP_CONTROLLER = 'Controls/popupTemplate:PreviewerController';

const clearClosingTimeout = (config) => {
    if (config.closingTimerId) {
        clearTimeout(config.closingTimerId);
        config.closingTimerId = null;
    }
};

const clearOpeningTimeout = (config) => {
    if (config.openingTimerId) {
        clearTimeout(config.openingTimerId);
        config.openingTimerId = null;
    }
};

const prepareConfig = (config) => {
    const newConfig = cClone(config);

    newConfig.closeOnOutsideClick = true;
    newConfig.className = 'controls-PreviewerController';
    newConfig._vdomOnOldPage = true;
    return newConfig;
};

const open = (callback: Function, config: object, type?: string): void => {
    clearOpeningTimeout(config);
    clearClosingTimeout(config);

    if (type === 'hover') {
        config.openingTimerId = setTimeout(() => {
            config.openingTimerId = null;
            callback();
        }, DISPLAY_DURATION);
    } else {
        callback();
    }
};

const close = (callback: Function, config: object, type?: string): void => {
    clearOpeningTimeout(config);
    clearClosingTimeout(config);
    if (type === 'hover') {
        config.closingTimerId = setTimeout(() => {
            config.closingTimerId = null;
            callback();
        }, DISPLAY_DURATION);
    } else {
        callback();
    }
};

const cancel = (config, action: string): void => {
    switch (action) {
        case 'opening':
            config.isCancelOpening = true;
            clearOpeningTimeout(config);
            break;
        case 'closing':
            clearClosingTimeout(config);
            break;
    }
};

class Previewer extends BaseOpener {
    private _currentConfig: Object = {};

    protected _beforeUnmount(): void {
        clearClosingTimeout(this._currentConfig);
        clearOpeningTimeout(this._currentConfig);
    }

    open(cfg: object, type?: string): void {
        this.close();
        const newCfg = prepareConfig(cfg);
        open(() => {
            this._currentConfig = newCfg;
            super.open(newCfg, POPUP_CONTROLLER);
        }, newCfg, type);
    }

    close(type?: string): void {
        close(() => {
            super.close();
        }, this._currentConfig, type);
    }

    /**
     * Cancel a delay in opening or closing.
     * @param {String} action Action to be undone.
     * @variant opening
     * @variant closing
     */
    cancel(action: string): void {
        cancel(this._currentConfig, action);
    }

    static openPopup(config: object, type?: string): Promise<string> {
        return new Promise((resolve: Function) => {
            const newCfg = prepareConfig(config);
            if (!newCfg.id) {
                newCfg.id = randomId('popup-');
            }
            open(() => {
                newCfg.isCancelOpening = false;
                BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result: ILoadDependencies) => {
                    if (!newCfg.isCancelOpening) {
                        BaseOpener.showDialog(result.template, newCfg, result.controller);
                    }
                });
            }, newCfg, type);
            resolve(newCfg);
        });
    }

    static closePopup(config: object, type?: string): void {
        if (config) {
            close(() => {
                BaseOpener.closeDialog(config.id);
            }, config, type);
        }
    }

    static cancelPopup(config, action: string): void {
        if (config) {
            cancel(config, action);
        }
    }

    // TODO перенести метод в baseOpener, ManagerController здесь не нужен
    static isOpenedPopup(config): boolean {
        return config && !!ManagerController.find(config.id);
    }

    static getDefaultOptions() {
        const baseOptions = BaseOpener.getDefaultOptions();
        baseOptions._vdomOnOldPage = true;
        return baseOptions;
    }
}

export default Previewer;
