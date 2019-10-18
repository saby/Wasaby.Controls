import cClone = require('Core/core-clone');
import Base from 'Controls/_popup/Opener/BaseOpener';

var _private = {
    displayDuration: 1000,

    clearOpeningTimeout: function(self) {
        var id = self._openingTimerId;

        if (id) {
            clearTimeout(id);
            self._openingTimerId = null;
        }
    },

    clearClosingTimeout: function(self) {
        var id = self._closingTimerId;

        if (id) {
            clearTimeout(id);
            self._closingTimerId = null;
        }
    }
};

class Previewer extends Base {
    _openingTimerId: number = null;

    _closingTimerId: number = null;
    _beforeUnmount() {
        _private.clearClosingTimeout(this);
        _private.clearOpeningTimeout(this);

    }

    open(cfg, type) {
        _private.clearClosingTimeout(this);

        // Previewer - singleton
        this.close();

        if (type === 'hover') {
            this._openingTimerId = setTimeout(() => {
                this.openingTimerId = null;

                this._open(cfg);
            }, _private.displayDuration);
        } else {
            this._open(cfg);
        }
    }

    close(type) {
        _private.clearOpeningTimeout(this);

        if (type === 'hover') {
            this._closingTimerId = setTimeout(() => {
                this.closingTimerId = null;

                super.close();
            }, _private.displayDuration);
        } else {
            super.close();
            this._popupIds = [];
        }
    }

    /**
     * Cancel a delay in opening or closing.
     * @param {String} action Action to be undone.
     * @variant opening
     * @variant closing
     */
    cancel(action) {
        switch (action) {
            case 'opening':
                _private.clearOpeningTimeout(this);
                break;
            case 'closing':
                _private.clearClosingTimeout(this);
                break;
        }
    }

    private _open(cfg): void {
        const myCfg = cClone(cfg);

        myCfg.closeOnOutsideClick = true;
        myCfg.className = 'controls-PreviewerController';
        super.open(myCfg, 'Controls/popupTemplate:PreviewerController');
    }
}

Previewer.getDefaultOptions = function() {
    var baseOptions = Base.getDefaultOptions();
    baseOptions._vdomOnOldPage = true;
    return baseOptions;
};

export default Previewer;
