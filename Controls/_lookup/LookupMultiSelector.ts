import Control = require('Core/Control');
import template = require('wml!Controls/_lookup/LookupMultiSelector/LookupMultiSelector');

export = Control.extend({
    _template: template,

    showSelector: function (templateOptions) {
        this._children.controller.showSelector(templateOptions);
    }
});

