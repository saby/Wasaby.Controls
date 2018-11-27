define('Controls-demo/List/Tree/HideIconEmptyNodes', [
   'Core/Control',
   'Controls-demo/List/Tree/TreeData',
   'wml!Controls-demo/List/Tree/resources/HideIconEmptyNodes/HideIconEmptyNodes',
   'css!Controls-demo/List/Tree/resources/HideIconEmptyNodes/HideIconEmptyNodes',
   'Controls/Container/Scroll',
   'Controls/TreeGrid'
], function(Control, TreeData, template) {
   'use strict';
   var
      HideIconEmptyNodes = Control.extend({
         _template: template,
         _treeSource: null,
         _beforeMount: function() {
            this._treeSource = TreeData.getTasksFoldersMemory();
         }
      });

   return HideIconEmptyNodes;
});
