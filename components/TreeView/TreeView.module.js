define('js!SBIS3.CONTROLS.TreeView', [
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.TreeMixin',
   'js!SBIS3.CONTROLS.TreeViewMixin',
   'tmpl!SBIS3.CONTROLS.TreeView/resources/ItemTemplate',
   'tmpl!SBIS3.CONTROLS.TreeView/resources/ItemContentTemplate',
   "tmpl!SBIS3.CONTROLS.TreeView/resources/FooterWrapperTemplate",
   'js!SBIS3.CONTROLS.MassSelectionHierarchyController',
   'css!SBIS3.CONTROLS.TreeView'
], function (ListView, TreeMixin, TreeViewMixin, ItemTemplate, ItemContentTemplate, FooterWrapperTemplate, MassSelectionHierarchyController) {
   'use strict';
   var getItemTemplateData = function (cfg) {
      var config = {
         nodePropertyValue: cfg.item.get(cfg.nodeProperty),
         projection: cfg.projItem.getOwner()
      };
      config.children = cfg.hierarchy.getChildren(cfg.item,config.projection.getCollection());
      config.isLoaded = cfg.projItem.isLoaded();
      config.itemLevel = cfg.projItem.getLevel() - 1;
      config.hasLoadedChild = config.children.length > 0;
      config.classIsLoaded = config.isLoaded ? ' controls-ListView__item-loaded' : '';
      config.classHasLoadedChild = config.hasLoadedChild ? ' controls-ListView__item-with-child' : ' controls-ListView__item-without-child';
      config.classNodeType = ' controls-ListView__item-type-' + (config.nodePropertyValue == null ? 'leaf' : config.nodePropertyValue == true ? 'node' : 'hidden');
      config.classNodeState = config.nodePropertyValue !== null ? (' controls-TreeView__item-' + (cfg.projItem.isExpanded() ? 'expanded' : 'collapsed')) : '';
      config.classIsSelected = (cfg.selectedKey==cfg.item.getId()) ? ' controls-ListView__item__selected' : '';
      config.addClasses = 'js-controls-ListView__item controls-ListView__item js-controls-TreeView__item controls-TreeView__item' + config.classNodeType + config.classNodeState + config.classIsLoaded + config.classHasLoadedChild + config.classIsSelected + (cfg.noHover ? ' controls-ListView__hoveredItem__withHover' : ' controls-ListView__hoveredItem__withoutHover');
      return config;
   };
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeView
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @mixes SBIS3.CONTROLS.TreeViewMixin
    * @demo SBIS3.CONTROLS.Demo.MyTreeView
    * @author Авраменко Алексей Сергеевич
    *
    * @cssModifier controls-TreeView__withoutLevelPadding Устанавливает режим отображения дерева без иерархических отступов.
    * @cssModifier controls-TreeView__hideExpands Устанавливает режим отображения дерева без иконок сворачивания/разворачивания узлов.
    *
    * @control
    * @public
    * @category Lists
    *
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeView'>
    *    <option name="idProperty">key</option>
    *    <option name="displayProperty">title</option>
    *    <option name="emptyHTML">Нет записей</option>
    *    <option name="parentProperty">parent</option>
    * </component>
    */

   var TreeView = ListView.extend([TreeMixin, TreeViewMixin], /** @lends SBIS3.CONTROLS.TreeView.prototype*/ {
      $protected: {
         _options: {
            _footerWrapperTemplate: FooterWrapperTemplate,
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