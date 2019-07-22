import Deferred = require('Core/Deferred');
import StickyController = require('Controls/_popupTemplate/Sticky/StickyController');
import themeConstantsGetter = require('Controls/_popupTemplate/InfoBox/Opener/resources/themeConstantsGetter');
import cMerge = require('Core/core-merge');
import TargetCoords = require('Controls/_popupTemplate/TargetCoords');
import StickyStrategy = require('Controls/_popupTemplate/Sticky/StickyStrategy');
import 'css!theme?Controls/popupTemplate';

function getConstants() {
    return themeConstantsGetter('controls-InfoBox__themeConstants', {
        ARROW_WIDTH: 'marginLeft',
        ARROW_H_OFFSET: 'marginRight',
        ARROW_V_OFFSET: 'marginBottom',
        TARGET_OFFSET: 'marginTop',
        MAX_WIDTH: 'maxWidth'
    });
}

// todo: https://online.sbis.ru/opendoc.html?guid=b385bef8-31dd-4601-9716-f3593dfc9d41
let constants = {};
if (document) {
    if (document.body) {
        constants = getConstants();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            constants = getConstants();
        });
    }
}

const SIDES = {
    t: 'top',
    r: 'right',
    b: 'bottom',
    l: 'left',
    c: 'center'
};

const INVERTED_SIDES = {
    t: 'bottom',
    r: 'left',
    b: 'top',
    l: 'right',
    c: 'center'
};

const _private = {

    // Checks if the target width is enough for the correct positioning of the arrow.
    // Returns offset to which you want to move the popup.
    getOffset(targetSize, alignSide, arrowOffset, arrowWidth) {
        const align = INVERTED_SIDES[alignSide];

        // Check if we have enough width of the target for the correct positioning of the arrow, if not, just
        // move the popup arrow to the center of the target
        if (align !== 'center' && targetSize < arrowWidth + arrowOffset) {
            switch (align) {
                case 'top':
                case 'left':
                    return arrowWidth / 2 + arrowOffset - targetSize / 2;
                case 'bottom':
                case 'right':
                    return -arrowWidth / 2 + -arrowOffset + targetSize / 2;
            }
        }
        return 0;
    },

    // Return the configuration prepared for StickyStrategy
    prepareConfig(position, target) {
        const side = position[0];
        const alignSide = position[1];
        const topOrBottomSide = side === 't' || side === 'b';

        const config = {
            verticalAlign: {
                side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide]
            },

            horizontalAlign: {
                side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side]
            },

            corner: {
                vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
            }
        };

        const verticalOffset = _private.getVerticalOffset(target, topOrBottomSide, side, alignSide);
        const horizontalOffset = _private.getHorizontalOffset(target, topOrBottomSide, side, alignSide);

        if (verticalOffset) {
            config.verticalAlign.offset = verticalOffset;
        }

        if (horizontalOffset) {
            config.horizontalAlign.offset = horizontalOffset;
        }

        return config;
    },

    getVerticalOffset(target, topOrBottomSide, side, alignSide) {
        if (!topOrBottomSide) {
            // svg hasn't offsetHeight property
            const targetHeight = target.offsetHeight || target.clientHeight;
            return _private.getOffset(targetHeight, alignSide, constants.ARROW_V_OFFSET, constants.ARROW_WIDTH);
        }
    },

    getHorizontalOffset(target, topOrBottomSide, side, alignSide) {
        if (topOrBottomSide) {
            // svg hasn't offsetWidth property
            const targetWidth = target.offsetWidth || target.clientWidth;
            return _private.getOffset(targetWidth, alignSide, constants.ARROW_H_OFFSET, constants.ARROW_WIDTH);
        }
    }
};

/**
 * InfoBox Popup Controller
 * @class Controls/_popupTemplate/InfoBox/Opener/InfoBoxController
 * @control
 * @private
 * @category Popup
 */
const InfoBoxController = StickyController.constructor.extend({
    _openedPopupId: null,

    elementCreated(cfg, container, id) {
        // Only one popup can be opened
        if (this._openedPopupId) {
            require('Controls/popup').Controller.remove(this._openedPopupId);
        }
        this._openedPopupId = id;

        // Remove the width obtained in getDefaultOptions
        cfg.position.maxWidth = undefined;

        return InfoBoxController.superclass.elementCreated.apply(this, arguments);
    },

    elementUpdated() {
        // Hide popup then page scroll or resize
        require('Controls/popup').Controller.remove(this._openedPopupId);
    },

    popupResize(element, container) {
        return InfoBoxController.superclass.elementUpdated.call(this, element, container);
    },

    elementDestroyed(item) {
        if (item.id === this._openedPopupId) {
            this._openedPopupId = null;
        }
        return (new Deferred()).callback();
    },

    needRestoreFocus(isActive) {
        return isActive;
    },

    getDefaultConfig(item) {
        InfoBoxController.superclass.getDefaultConfig.apply(this, arguments);
        const defaultPosition = {
            left: -10000,
            top: -10000,
            right: undefined,
            bottom: undefined
        };
        if (item.popupOptions.target) {
            // Calculate the width of the infobox before its positioning.
            // It is impossible to count both the size and the position at the same time, because the position is related to the size.
            cMerge(item.popupOptions, _private.prepareConfig(item.popupOptions.position, item.popupOptions.target));
            const sizes = {width: constants.MAX_WIDTH, height: 1, margins: {left: 0, top: 0}};
            const position = StickyStrategy.getPosition(this._getPopupConfig(item, sizes), TargetCoords.get(item.popupOptions.target));
            this.prepareConfig(item, sizes);
            item.position.maxWidth = position.width;
        }
        item.position = {...item.position, ...defaultPosition};
    },

    _getPopupConfig() {
        const baseConfig = InfoBoxController.superclass._getPopupConfig.apply(this, arguments);
        // Protection against incorrect page design
        baseConfig.checkNegativePosition = false;
        return baseConfig;
    },

    prepareConfig(cfg, sizes) {
        cMerge(cfg.popupOptions, _private.prepareConfig(cfg.popupOptions.position, cfg.popupOptions.target));
        return InfoBoxController.superclass.prepareConfig.apply(this, arguments);
    },
    TYPE: 'InfoBox',
    _private
});
export = new InfoBoxController();
