import {IBasePopupOptions} from 'Controls/_popup/interface/IBaseOpener';
import BaseOpener from 'Controls/_popup/Opener/BaseOpener';

interface IOpenerStaticMethods {
    openPopup: (popupOptions: IBasePopupOptions) => Promise<string>;
    closePopup: (popupId: string) => void;
}

export default class Base {
    _popupId: string;
    _opener: IOpenerStaticMethods;

    openPopup(popupOptions: IBasePopupOptions): void {
        const config: IBasePopupOptions = {...popupOptions};
        if (this.isOpened()) {
            config.id = this._popupId;
        }
        this._opener.openPopup(config).then((id: string) => {
            this._popupId = id;
        });
    }

    closePopup(): void {
        return this._opener.closePopup(this._popupId);
    }

    isOpened(): boolean {
        return BaseOpener.isOpened(this._popupId);
    }
}
