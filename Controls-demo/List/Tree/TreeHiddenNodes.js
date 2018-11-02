define('Controls-demo/List/Tree/TreeHiddenNodes', [
   'Core/Control',
   'Controls-demo/List/Tree/TreeData',
   'wml!Controls-demo/List/Tree/TreeHiddenNodes/TreeHiddenNodes',
   'css!Controls-demo/List/Tree/TreeHiddenNodes/TreeHiddenNodes',
   'Controls/Container/Scroll',
   'Controls/TreeGrid',
   'wml!Controls-demo/List/Tree/TreeHiddenNodes/TasksMainColumn'
], function(Control, TreeData, template) {
   'use strict';
   var
      tasksColumns = [
         {
            width: '1fr',
            template: 'wml!Controls-demo/List/Tree/TreeHiddenNodes/TasksMainColumn'
         },
         {
            width: '100px',
            displayProperty: 'received'
         }
      ],
      TreeHiddenNodes = Control.extend({
         _template: template,
         _tasksSource: null,
         _tasksColumns: null,
         _beforeMount: function() {
            this._tasksColumns = tasksColumns;
            this._tasksSource = TreeData.getTasksMemory();
         },
         onClickSubTaskExpander: function(event, key) {
            this._children.tasksTreeGrid.toggleExpanded(key);
         }
      });

   return TreeHiddenNodes;
});
