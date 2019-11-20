define('Controls-demo/Compatible/Events/Page', [
    'Core/Control',
    'wml!Controls-demo/Compatible/Events/Page',
    'Controls-demo/Compatible/Events/CompatibleParent'
 ], function(Control, template) {
    'use strict';
 
    var ModuleClass = Control.extend(
       {
          _template: template
       }
    );
    return ModuleClass;
 });
 