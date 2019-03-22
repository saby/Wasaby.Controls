define('Controls-demo/Input/Date/RangeLinkLiteApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/RangeLinkLiteApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});