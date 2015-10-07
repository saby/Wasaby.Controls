/* global define, $ws */
define('js!SBIS3.CONTROLS.TreeControl.ITreeView', [], function () {
   'use strict';

   /**
    * Интерфейс представления дерева
    * @mixin SBIS3.CONTROLS.TreeControl.ITreeView
    * @implements SBIS3.CONTROLS.HierarchyControl.IHierarchyView
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.HierarchyControl.IHierarchyView.prototype */{
      /**
       * @event onLeverageClicked Cобытие о клике по узлу, отвечаещему за разворот
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента дерева
       */

      /**
       * Перерисовывает узел целиком
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       */
      renderNode: function (node) {
         throw new Error('Method must be implemented');
      },

      /**
       * Разворачивает/сворачивает узел дерева
       * @param {SBIS3.CONTROLS.Data.Collection.ITreeItem} node Узел
       * @param {Boolean} expanded Узел развернут
       */
      setNodeExpanded: function (node, expanded) {
         throw new Error('Method must be implemented');
      }
   };
});
