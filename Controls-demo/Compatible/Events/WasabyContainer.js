define('Controls-demo/Compatible/Events/WasabyContainer', [
    'Core/Control',
    'wml!Controls-demo/Compatible/Events/WasabyContainer'
 ], function(Control, template) {
    'use strict';
 
    var ModuleClass = Control.extend(
       {
          _template: template,
          value: "false"
       }
    );
    return ModuleClass;
 });
 