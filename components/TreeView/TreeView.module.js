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
         _options: {
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate,
            _defaultItemContentTemplate: ItemContentTemplate,
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      },

      init: function () {
         TreeView.superclass.init.apply(this, arguments);
         this._container.addClass('controls-TreeView');
      }
   });

   return TreeView;

});