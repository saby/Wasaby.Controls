define('Controls-demo/Input/DateTime/DateTimeApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/DateTime/DateTimeApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});