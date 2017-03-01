define('js!SBIS3.CONTROLS.TreeView', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.TreeViewMixin',
   'html!SBIS3.CONTROLS.TreeView/resources/ItemTemplate',
   'html!SBIS3.CONTROLS.TreeView/resources/ItemContentTemplate',
   'css!SBIS3.CONTROLS.TreeView'
], function (ListView, TreeMixin, TreeViewMixin, ItemTemplate, ItemContentTemplate) {
   'use strict';

   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeView
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @mixes SBIS3.CONTROLS.TreeViewMixin
    * @demo SBIS3.CONTROLS.Demo.MyTreeView
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Lists
    *
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeView'>
    *    <option name="idProperty">key</option>
    *    <option name="idProperty">key</option>
    *    <option name="displayProperty">title</option>
    *    <option name="emptyHTML">Нет записей</option>
    *    <option name="parentProperty">parent</option>
    * </component>
    *
    *
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
      },

      _onDragHandler: function (dragObject, e) {
         TreeView.superclass._onDragHandler.call(this, dragObject, e);
         this._onDragCallback(dragObject, e);
      }
   });

   return TreeView;

});