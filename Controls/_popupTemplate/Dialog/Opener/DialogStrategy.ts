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
            width = this._calculateValue(popupOptions, containerSizes.width, windowData.width, popupOptions.width);
            height = this._calculateValue(popupOptions, containerSizes.height, windowData.height, popupOptions.height);
            left = this._getLeftCoord(windowData.width, width || containerSizes.width) + (windowData.scrollLeft || 0);
            top = this._getTopCoord(windowData, height || containerSizes.height) + (windowData.scrollTop || 0);
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
    _calculateValue: function (popupOptions, containerValue, windowValue, popupValue) {
        if (popupValue) {
            return popupValue;
        } else if (popupOptions.maximize || containerValue >= windowValue) {
            return windowValue;
        }
    },
    _getLeftCoord: function (wWidth, width) {
        return Math.max(Math.round((wWidth - width) / 2), 0);
    },

    _getTopCoord: function (windowData, height) {
        return Math.round((windowData.height - height) / 2);
    }
};

