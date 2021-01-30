import {IPopupItem, IPopupPosition, ISlidingPanelPopupOptions} from 'Controls/popup';
import constants from 'Env/Constants';

interface ISlidingPanelItem extends IPopupItem {
    popupOptions: ISlidingPanelPopupOptions;
}

class Strategy {

    /**
     * Returns popup position
     * @function Controls/_popupSliding/Strategy#getPosition
     * @param item Popup configuration
     */
    getPosition({position: popupPosition = {}, popupOptions}: ISlidingPanelItem): IPopupPosition {
        // Если у попапа
        const {
            position,
            slidingPanelSizes: {
                maxHeight: optionsMaxHeight,
                minHeight: optionsMinHeight
            } = {}
        } = popupOptions;
        const maxHeight = this._getHeightWithoutOverflow(optionsMaxHeight, this._getWindowHeight());
        const minHeight = this._getHeightWithoutOverflow(optionsMinHeight, maxHeight);
        const initialHeight = this._getHeightWithoutOverflow(popupPosition.height, maxHeight);
        const height = initialHeight || minHeight;
        return {
            left: 0,
            right: 0,

            // Попап изначально показывается за пределами экрана
            [position]: initialHeight ? 0 : -minHeight,
            maxHeight,
            minHeight,
            height: this._getHeightWithoutOverflow(height, maxHeight),
            position: 'fixed'
        };
    }

    /**
     * Возвращает высоту с защитой от переполнения
     * @param {number} height
     * @param {number} maxHeight
     * @return {number}
     * @private
     */
    private _getHeightWithoutOverflow(height: number, maxHeight: number): number {
        if (!height) {
            return height;
        }
        return maxHeight > height ? height : maxHeight;
    }

    /**
     * Получение доступного пространства для отображения попапа
     * @return {number}
     * @private
     */
    private _getWindowHeight(): number {
        return constants.isBrowserPlatform && window.innerHeight;
    }
}

export default new Strategy();
