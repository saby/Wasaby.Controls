define('Controls-demo/Input/Date/PickerApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/PickerApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend({
        _template: template
    });

    return ModuleClass;
});