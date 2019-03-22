define('Controls-demo/Input/Date/RangeLinkApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/RangeLinkApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});