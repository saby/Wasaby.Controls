define('Controls-demo/Compatible/Events/Page', [
    'Core/Control',
    'wml!Controls-demo/Compatible/Events/Page',
    'Lib/Control/LayerCompatible/LayerCompatible',
    'Env/Env',
    'Controls-demo/Compatible/Events/CompatibleParent'
], function (Control, template, layer, env) {
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
