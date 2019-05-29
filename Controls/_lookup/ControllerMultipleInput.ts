import BaseController = require('Controls/_lookup/BaseController');
import showSelector = require('Controls/_lookup/showSelector');

var ControllerMultiSelector = BaseController.extend({
    showSelector: function(popupOptions) {
        showSelector(this, popupOptions, false);
    }
});

export = ControllerMultiSelector;
