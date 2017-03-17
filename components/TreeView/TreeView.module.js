define('js!SBIS3.CONTROLS.TreeView', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.TreeViewMixin',
   'tmpl!SBIS3.CONTROLS.TreeView/resources/ItemTemplate',
   'tmpl!SBIS3.CONTROLS.TreeView/resources/ItemContentTemplate',
   'js!SBIS3.CONTROLS.MassSelectionHierarchyController',
   'css!SBIS3.CONTROLS.TreeView'
], function (ListView, TreeMixin, TreeViewMixin, ItemTemplate, ItemContentTemplate, MassSelectionHierarchyController) {
   'use strict';
   var getItemTemplateData = function (cfg) {
      var config = {
         nodePropertyValue: cfg.item.get(cfg.nodeProperty),
         projection: cfg.projItem.getOwner(),
         padding: cfg.paddingSize * (cfg.projItem.getLevel() - 1) + cfg.originallPadding
      };
      config.children = cfg.hierarchy.getChildren(cfg.item,config.projection.getCollection());
      config.hasLoadedChild = config.children.length > 0;
      config.loadedWithoutChilds = (cfg.projItem.isLoaded() || !config.hasLoadedChild) && config.nodePropertyValue != null;
      config.drawExpandIcon = !!config.nodePropertyValue;
      config.classNodeType = ' controls-ListView__item-type-' + (config.nodePropertyValue == null ? 'leaf' : config.nodePropertyValue == true ? 'node' : 'hidden');
      config.classNodeState = config.nodePropertyValue !== null ? (' controls-TreeView__item-' + (cfg.projItem.isExpanded() ? 'expanded' : 'collapsed')) : '';
      config.classPresenceLoadedNodes = config.loadedWithoutChilds ? ' controls-ListView__item-without-child' : '';
      config.classIsSelected = (cfg.selectedKey==cfg.item.getId()) ? ' controls-ListView__item__selected' : '';
      config.addClasses = 'js-controls-ListView__item controls-ListView__item js-controls-TreeView__item controls-TreeView__item' + config.classNodeType + config.classNodeState + config.classPresenceLoadedNodes + config.classIsSelected;

      if (config.padding > cfg.originallPadding){
         config.computedPadding = 'padding-left:' + config.padding + 'px;';
      }
      return config;
   };
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
            _getItemTemplateData: getItemTemplateData,
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      },

      init: function () {
         TreeView.superclass.init.apply(this, arguments);
         this._container.addClass('controls-TreeView');
         if (this._options.useSelectAll) {
            this._makeMassSelectionController();
         }
      },

      _makeMassSelectionController: function() {
         this._massSelectionController = new MassSelectionHierarchyController(this._getMassSelectorConfig());
      },

      _onDragHandler: function (dragObject, e) {
         TreeView.superclass._onDragHandler.call(this, dragObject, e);
         this._onDragCallback(dragObject, e);
      }
   });

   return TreeView;

});