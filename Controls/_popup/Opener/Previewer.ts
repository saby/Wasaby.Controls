import cClone = require('Core/core-clone');
import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import ManagerController = require('Controls/_popup/Manager/ManagerController');

const DISPLAY_DURATION: number = 1000;
const POPUP_CONTROLLER = 'Controls/popupTemplate:PreviewerController';
let openingTimerId: number = null;
let closingTimerId: number = null;
let previewerId: string;

const clearClosingTimeout = () => {
    if (closingTimerId) {
        clearTimeout(closingTimerId);
        closingTimerId = null;
    }
};

const clearOpeningTimeout = () => {
    if (openingTimerId) {
        clearTimeout(openingTimerId);
        openingTimerId = null;
    }
};

const prepateConfig = (config) => {
    const newConfig = cClone(config);

    newConfig.closeOnOutsideClick = true;
    newConfig.className = 'controls-PreviewerController';
    newConfig._vdomOnOldPage = true;
    return newConfig;
};

const open = (callback: Function, config: object, type?: string): void => {
    clearClosingTimeout();
    const newCfg = prepateConfig(config);
    // Previewer - singleton

    if (type === 'hover') {
        openingTimerId = setTimeout(() => {
            openingTimerId = null;
            callback(newCfg);
        }, DISPLAY_DURATION);
    } else {
        callback(newCfg);
    }
};

const close = (callback: Function, type?: string): void => {
    clearOpeningTimeout();
    if (type === 'hover') {
        closingTimerId = setTimeout(() => {
            closingTimerId = null;
            callback();
        }, DISPLAY_DURATION);
    } else {
        callback();
    }
};

const cancel = (action: string): void => {
    switch (action) {
        case 'opening':
            clearOpeningTimeout();
            break;
        case 'closing':
            clearClosingTimeout();
            break;
    }
};

class Previewer extends BaseOpener {

    protected _beforeUnmount(): void {
        clearClosingTimeout();
        clearOpeningTimeout();
    }

    open(cfg: object, type?: string): void {
        this.close();
        open((newCfg) => {
            super.open(newCfg, POPUP_CONTROLLER);
        }, cfg, type);
    }

    close(type?: string): void {
        close(() => {
            super.close();
        }, type);
    }

    /**
     * Cancel a delay in opening or closing.
     * @param {String} action Action to be undone.
     * @variant opening
     * @variant closing
     */
    cancel(action: string): void {
        cancel(action);
    }

    static openPopup(config: object, type?: string): void {
        this.closePopup();
        open((newCfg) => {
            BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
                BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
                    previewerId = popupId;
                });
            });
        }, config, type);
    }

    static closePopup(type?: string): void {
        close(() => {
            BaseOpener.closeDialog(previewerId);
        }, type);
    }

    static cancelPopup(action: string): void {
        cancel(action);
    }

    // TODO перенести метод в baseOpener, ManagerController здесь не нужен
    static isOpenedPopup(): boolean {
        return !!ManagerController.find(previewerId);
    }

    static getDefaultOptions() {
        const baseOptions = BaseOpener.getDefaultOptions();
        baseOptions._vdomOnOldPage = true;
        return baseOptions;
    }
}

export default Previewer;
