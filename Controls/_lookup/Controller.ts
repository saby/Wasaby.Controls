import BaseController = require('Controls/_lookup/BaseController');
import ContollerHelper = require('Controls/_lookup/ContollerHelper');

var Controller = BaseController.extend({
    showSelector: function(config) {
        ContollerHelper.showSelector(this, config, this._options.multiSelect);
    }
});

export = Controller;
