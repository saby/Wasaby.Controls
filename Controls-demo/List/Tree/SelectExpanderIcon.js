define('Controls-demo/List/Tree/SelectExpanderIcon', [
   'Core/Control',
   'Controls-demo/List/Tree/TreeData',
   'wml!Controls-demo/List/Tree/resources/SelectExpanderIcon/SelectExpanderIcon',
   'css!Controls-demo/List/Tree/resources/SelectExpanderIcon/SelectExpanderIcon',
   'Controls/Container/Scroll',
   'Controls/TreeGrid'
], function(Control, TreeData, template) {
   'use strict';
   var
      SelectExpanderIcon = Control.extend({
         _template: template,
         _tasksSource: null,
         _beforeMount: function() {
            this._tasksSource = TreeData.getTasksMemory();
         },
         onClickSubTaskExpander: function(event, key) {
            this._children.tasksTreeGrid.toggleExpanded(key);
         }
      });

   return SelectExpanderIcon;
});
