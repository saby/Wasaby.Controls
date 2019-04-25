import BaseController = require('Controls/_lookup/BaseController');
import ContollerHelper = require('Controls/_lookup/ContollerHelper');

var ControllerMultiSelector = BaseController.extend({
    showSelector: function(config) {
        ContollerHelper.showSelector(this, config, false);
    }
});

export = ControllerMultiSelector;
