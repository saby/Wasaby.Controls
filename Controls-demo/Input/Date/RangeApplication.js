define('Controls-demo/Input/Date/RangeApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/RangeApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});