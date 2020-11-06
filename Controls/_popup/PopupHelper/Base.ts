import {IBasePopupOptions} from 'Controls/_popup/interface/IBaseOpener';
import BaseOpener from 'Controls/_popup/Opener/BaseOpener';
import * as randomId from 'Core/helpers/Number/randomId';
import ManagerController from 'Controls/_popup/Manager/ManagerController';

interface IOpenerStaticMethods {
    openPopup: (popupOptions: IBasePopupOptions) => Promise<string>;
    closePopup: (popupId: string) => void;
}
/**
 * Базовый хелпер для открытия всплывающих окон
 * @class Controls/_popup/PopupHelper/Base
 * 
 * @author Красильников А.С.
 * @private
 */

export default class Base {
    _popupId: string;
    _opener: IOpenerStaticMethods;

    open(popupOptions: IBasePopupOptions): void {
        const config: IBasePopupOptions = {...popupOptions};
        config.isHelper = true;

        // Защита от множ. вызова. Хэлпер сам генерирует id
        if (!this._popupId) {
            this._popupId = randomId('popup-');
        }
        config.id = this._popupId;
        config._events = {
            onClose: () => {
                // Защита. Могут позвать close и сразу open. В этом случае мы
                // инициируем закрытие окна, откроем новое и после стрельнет onCLose, который очистит id нового окна.
                // В итоге повторый вызов метода close ничего не сделает, т.к. popupId уже почищен.
                if (!this.isOpened()) {
                    this._popupId = null;
                }
            }
        };
        if (config.dataLoaders) {
            config._prefetchPromise = ManagerController.loadData(config.dataLoaders);
        }

        this._opener.openPopup(config);
    }

    close(): void {
        this._opener.closePopup(this._popupId);
        this._popupId = null;
    }

    isOpened(): boolean {
        return BaseOpener.isOpened(this._popupId);
    }

    destroy(): void {
        if (this.isOpened()) {
            this.close();
        }
        this._popupId = null;
        this._opener = null;
    }
}
