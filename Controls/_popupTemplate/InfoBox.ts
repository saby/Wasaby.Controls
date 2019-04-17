import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/InfoBox/InfoBox');
import Env = require('Env/Env');
import 'css!theme?Controls/_popupTemplate/InfoBox/InfoBox';


var InfoBoxTemplate = Control.extend({
    _template: template,

    _beforeMount: function(newOptions) {
        this._setPositionSide(newOptions.stickyPosition);
    },

    _beforeUpdate: function(newOptions) {
        this._setPositionSide(newOptions.stickyPosition);
    },

    _setPositionSide: function(stickyPosition) {
        if (stickyPosition.horizontalAlign.side === 'left' && stickyPosition.corner.horizontal === 'left') {
            this._arrowSide = 'right';
            this._arrowPosition = this._getArrowPosition(stickyPosition.verticalAlign.side);
        } else if (stickyPosition.horizontalAlign.side === 'right' && stickyPosition.corner.horizontal === 'right') {
            this._arrowSide = 'left';
            this._arrowPosition = this._getArrowPosition(stickyPosition.verticalAlign.side);
        } else if (stickyPosition.verticalAlign.side === 'top' && stickyPosition.corner.vertical === 'top') {
            this._arrowSide = 'bottom';
            this._arrowPosition = this._getArrowPosition(stickyPosition.horizontalAlign.side);
        } else if (stickyPosition.verticalAlign.side === 'bottom' && stickyPosition.corner.vertical === 'bottom') {
            this._arrowSide = 'top';
            this._arrowPosition = this._getArrowPosition(stickyPosition.horizontalAlign.side);
        }
    },

    _getArrowPosition: function(side) {
        if (side === 'left' || side === 'top') {
            return 'end';
        }
        if (side === 'right' || side === 'bottom') {
            return 'start'
        }
        return 'center';
    },

    _close: function() {
       this._notify('close', [], { bubbling: true });
    }
});

InfoBoxTemplate.getDefaultOptions = function() {
    return {
        closeButtonVisibility: true
    };
};

export = InfoBoxTemplate;