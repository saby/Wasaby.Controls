define('Controls/Selector/Tree/Container', [
   'Core/Control',
   'tmpl!Controls/Selector/Tree/Container',
   'Controls/Selector/Tree/ItemAction'
], function(BaseControl, template, ItemAction) {
   
   'use strict';
   
   var Container = BaseControl.extend(/** @lends Controls/EngineBrowser.prototype */{
      _template: template,
      
      _itemAction: ItemAction.action,
      _visibilityCallback: ItemAction.visibilityCallback,
   
      _itemClick: function(event, item) {

      },
   
      _checkboxClick: function() {

      }
   });
   
   return Container;
});
