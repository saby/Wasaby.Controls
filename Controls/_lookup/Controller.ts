import BaseController = require('Controls/_lookup/BaseController');
import showSelector from 'Controls/_lookup/showSelector';

var Controller = BaseController.extend({
    showSelector: function(popupOptions) {
        return showSelector(this, popupOptions, this._options.multiSelect);
    }
});

export = Controller;
