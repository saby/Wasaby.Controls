define('Controls-demo/DragNDrop/Container', [
   'Core/Control',
   'wml!Controls-demo/DragNDrop/Container/Container',
   'css!Controls-demo/DragNDrop/Container/Container'
], function(BaseControl, template) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _hasList: false,
      _hasGrid: false,
      _hasTree: true,
      _hasNotes: false,
      _hasMasterDetail: false,
      _selectedKeys: []
   });
   return ModuleClass;
});
