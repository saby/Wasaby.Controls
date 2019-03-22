define('Controls-demo/Input/Date/LinkApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/LinkApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});