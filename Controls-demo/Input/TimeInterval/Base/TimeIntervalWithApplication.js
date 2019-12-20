define('Controls-demo/Input/TimeInterval/Base/TimeIntervalWithApplication', [
    'Core/Control',
    'wml!Controls-demo/Input/TimeInterval/Base/TimeIntervalWithApplication'
], function(Control, template) {
    'use strict';

    var ModuleClass = Control.extend(
        {
            _template: template
        });
    return ModuleClass;
});
