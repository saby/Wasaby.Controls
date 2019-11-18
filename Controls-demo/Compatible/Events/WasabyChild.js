define('Controls-demo/Compatible/Events/WasabyChild', [
    'Core/Control',
    'wml!Controls-demo/Compatible/Events/WasabyChild'
 ], function(Control, template) {
    'use strict';
 
    var ModuleClass = Control.extend(
       {
          _template: template,
          handler: function(e, key) {
             this._notify('myEvent', [], { bubbling: true });     
          }
       }
    );
    return ModuleClass;
 });
 