/* global define */
define('js!SBIS3.CONTROLS.Data.Bind.ITree', [], function () {
   'use strict';

   /**
    * Интерфейс привязки к дереву
    * @mixin SBIS3.CONTROLS.Data.Bind.ITree
    * @public
    * @author Мальцев Алексей
    */

   var ITree = /** @lends SBIS3.CONTROLS.Data.Bind.ITree.prototype */{
      /**
       * @event onTreeItemParentChange После изменения родителя узла дерева
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} item Элемент дерева
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} newParent Новый родитель
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} oldParent Старый родитель
       */

      /**
       * @event onTreeNodeToggle После разворачивания/сворачивания узла
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       * @param {Boolean} expanded Развернут или свернут узел.
       * @example
       * <pre>
       *    menu.subscribe('onTreeNodeToggle', function(eventObject, node, expanded){
       *       if (expanded){
       *          console.log('Развернулся!');
       *       }
       *    });
       * </pre>
       */

   };

   return ITree;
});
