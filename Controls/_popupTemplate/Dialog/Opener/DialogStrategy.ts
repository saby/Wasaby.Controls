import {detection} from 'Env/Env';

interface ILimitingSizes {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}

type Position = ILimitingSizes & {
    top: number;
    left: number;
    width: number;
    height: number;
};

export = {

    /**
     * Returns popup position
     * @function Controls/_popupTemplate/Dialog/Opener/DialogStrategy#getPosition
     * @param windowData The parameters of the browser window
     * @param containerSizes Popup container sizes
     * @param item Popup configuration
     */
    getPosition: function (windowData, containerSizes, item): Position {
        const popupOptions = item.popupOptions;
        const {
            minWidth, maxWidth,
            minHeight, maxHeight
        }: ILimitingSizes = this._calculateLimitOfSizes(popupOptions, windowData);

        let width;
        let height;
        let left;
        let top;

        if (item.dragged) {
            width = item.position.width;
            height = item.position.height;
            left = Math.max(0, item.position.left);
            top = Math.max(0, item.position.top);

            let dif;
            // check overflowX
            dif = (item.position.left + containerSizes.width) - windowData.width;
            left -= Math.max(0, dif);

            // check overflowY
            dif = (item.position.top + containerSizes.height) - windowData.height;
            top -= Math.max(0, dif);
        } else {
            width = this._calculateValue(popupOptions, containerSizes.width, windowData.width, popupOptions.width, popupOptions.maxWidth);
            height = this._calculateValue(popupOptions, containerSizes.height, windowData.height, popupOptions.height, popupOptions.maxHeight);
            left = this._getLeftCoord(windowData.width, width || containerSizes.width, popupOptions) + (windowData.scrollLeft || 0);
            top = this._getTopCoord(windowData, height || containerSizes.height, popupOptions);
        }

        return {
            left, top,
            width, minWidth, maxWidth,
            height, minHeight, maxHeight
        };
    },
    _calculateLimitOfSizes: function (popupOptions, windowData): ILimitingSizes {
        return {
            minWidth: popupOptions.minWidth,
            minHeight: popupOptions.minHeight,
            maxHeight: Math.min(popupOptions.maxHeight || windowData.height, windowData.height),
            maxWidth: Math.min(popupOptions.maxWidth || windowData.width, windowData.width)
        };
    },
    _calculateValue: function (popupOptions, containerValue, windowValue, popupValue, maxValue) {
        const availableSize = maxValue ? Math.min(windowValue, maxValue) : windowValue;
        if (popupOptions.maximize) {
            return windowValue;
        }
        if (containerValue >= availableSize || popupValue >= availableSize) {
            return availableSize;
        }
        return popupValue;
    },
    _getLeftCoord: function (wWidth, width, popupOptions) {
        if (popupOptions.maximize) {
            return 0;
        }
        return Math.max(Math.round((wWidth - width) / 2), 0);
    },

    _isIOS13() {
        return detection.isMobileIOS && detection.IOSVersion > 12;
    },

    _getTopCoord: function (windowData, height, popupOptions) {
        if (popupOptions.maximize) {
            return 0;
        }
        const middleCoef = 2;
        let scrollTop: number = windowData.scrollTop || 0;

        // только на ios13 scrollTop больше чем нужно. опытным путем нашел коэффициент
        if (this._isIOS13()) {
            scrollTop /= middleCoef;
        }
        return Math.round((windowData.height - height) / middleCoef) + scrollTop;
    }
};

