define('js!SBIS3.CONTROLS.TreeView', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.TreeViewMixin',
   'browser!html!SBIS3.CONTROLS.TreeView/resources/ItemTemplate',
   'browser!html!SBIS3.CONTROLS.TreeView/resources/ItemContentTemplate',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ListView, TreeMixin, TreeViewMixin, ItemTemplate, ItemContentTemplate, MarkupTransformer) {
   'use strict';

   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeView
    * @control
    * @public
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @mixes SBIS3.CONTROLS.TreeViewMixin
    * @demo SBIS3.CONTROLS.Demo.MyTreeView
    * @author Крайнов Дмитрий Олегович
    */

   var TreeView = ListView.extend([TreeMixin, TreeViewMixin], /** @lends SBIS3.CONTROLS.TreeView.prototype*/ {
      $protected: {
         _defaultItemTemplate: ItemTemplate,
         _defaultItemContentTemplate: ItemContentTemplate,
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: [],
            //TODO: Копипаст из TreeDataGridView, временное решение т.к. в TreeMixin пока разместить нельзя по причине
            //отсутствия необходимости переносит элементы в менюшках
            /**
             * @cfg {String} Разрешено или нет перемещение элементов "Drag-and-Drop"
             * @variant "" Запрещено
             * @variant allow Разрешено
             * @variant onlyChangeOrder Разрешено только изменение порядка
             * @variant onlyChangeParent Разрешено только перемещение в папку
             * @example
             * <pre>
             *     <option name="itemsDragNDrop">onlyChangeParent</option>
             * </pre>
             */
            itemsDragNDrop: false
         }
      },

      init: function () {
         TreeView.superclass.init.apply(this, arguments);
         this._container.addClass('controls-TreeView');
      },

      _notifyOnDragMove: function(target, insertAfter) {
         //Если происходит изменение порядкового номера и оно разрешено или если происходит смена родителся и она разрешена, стрельнём событием
         if (typeof insertAfter === 'boolean' && this._options.itemsDragNDrop !== 'onlyChangeParent' || insertAfter === undefined && this._options.itemsDragNDrop !== 'onlyChangeOrder') {
            return this._notify('onDragMove', this.getCurrentElement().keys, target.data('id'), insertAfter) !== false;
         }
      }
   });

   return TreeView;

});