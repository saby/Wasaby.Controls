import {IPopupItem, IPopupPosition, ICurtainPopupOptions} from 'Controls/popup';

interface ICurtainItem extends IPopupItem {
    popupOptions: ICurtainPopupOptions;
}

class Strategy {

    /**
     * Returns popup position
     * @function Controls/_popupTemplate/Dialog/Opener/DialogStrategy#getPosition
     * @param item Popup configuration
     */
    getPosition({popupOptions}: ICurtainItem): IPopupPosition {
        const {position, maxHeight, minHeight} = popupOptions;
        return {
            left: 0,
            right: 0,

            // Попап изначально показывается за пределами экрана
            [position]: -minHeight,
            maxHeight,
            minHeight,
            height: minHeight
        };
    }
}

export default new Strategy();
