define('Controls-demo/Compatible/Events/Page', [
    'Core/Control',
    'wml!Controls-demo/Compatible/Events/Page',
    'Env/Env',
    'Controls-demo/Compatible/Events/CompatibleParent'
], function (Control, template, env) {
    'use strict';

    var ModuleClass = Control.extend(
        {
            _template: template,
            _beforeMount: function() {
                env.constants.compat = true;
            }
        }
    );
    return ModuleClass;
});
