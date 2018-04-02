define('SBIS3.CONTROLS/Tree/View', [
   'SBIS3.CONTROLS/ListView',
   'SBIS3.CONTROLS/Mixins/TreeMixin',
   'SBIS3.CONTROLS/Mixins/TreeViewMixin',
   'tmpl!SBIS3.CONTROLS/Tree/View/resources/ItemTemplate',
   'tmpl!SBIS3.CONTROLS/Tree/View/resources/ItemContentTemplate',
   "tmpl!SBIS3.CONTROLS/Tree/View/resources/FooterWrapperTemplate",
   'css!SBIS3.CONTROLS/Tree/View/TreeView'
], function (ListView, TreeMixin, TreeViewMixin, ItemTemplate, ItemContentTemplate, FooterWrapperTemplate) {
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
      config.addClasses = 'js-controls-ListView__item controls-ListView__item js-controls-TreeView__item controls-TreeView__item' + config.classNodeType + config.classNodeState + config.classIsLoaded + config.classHasLoadedChild + config.classIsSelected;
      return config;
   };
   /**
    * Класс контрола "Иерархическое представление" (Дерево).
    * <a href="http://axure.tensor.ru/standarts/v7/%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_1_.html">Спецификация</a>
    * <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Документация</a>.
    *
    * @class SBIS3.CONTROLS/Tree/View
    * @extends SBIS3.CONTROLS/ListView
    * @mixes SBIS3.CONTROLS/Mixins/TreeMixin
    * @mixes SBIS3.CONTROLS/Mixins/TreeViewMixin
    *
    * @author Авраменко А.С.
    *
    * @cssModifier controls-TreeView__withoutLevelPadding Устанавливает отображение дерева, при котором вложенные в узлы записи отображаются без иерархических отступов.
    * @cssModifier controls-TreeView__hideExpands Скрывает отображение треугольника для всех типов записей в дереве.
    * @cssModifier controls-TreeView__emptyIconInEmptyNode Изменяет отображение для всех записей с типом "Узел": если нет вложенных записей, треугольник по умолчанию скрыт и отображается только по ховеру. Демо-пример можно найти <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-hierarchy/triangle/#_3">здесь</a>.
    * @cssModifier controls-TreeDataGridView__hideExpandsOnHiddenNodes Скрывает отображение треугольника в дереве для всех записей с типом "Скрытый узел". При этом раскрытие содержимого таких элементов из пользовательского интерфейса становится невозможным.
    *
    * @control
    * @public
    * @category Lists
    *
    * @initial
    * <component data-component='SBIS3.CONTROLS/Tree/View'>
    *    <option name="idProperty">key</option>
    *    <option name="displayProperty">title</option>
    *    <option name="emptyHTML">Нет записей</option>
    *    <option name="parentProperty">parent</option>
    * </component>
    */

   var TreeView = ListView.extend([TreeMixin, TreeViewMixin], /** @lends SBIS3.CONTROLS/Tree/View.prototype*/ {
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
      _modifyOptions: function() {
         var cfg = TreeView.superclass._modifyOptions.apply(this, arguments);
         cfg.preparedClasses += ' controls-TreeView';
         return cfg;
      },

      _onDragHandler: function (dragObject, e) {
         TreeView.superclass._onDragHandler.call(this, dragObject, e);
         this._onDragCallback(dragObject, e);
      }
   });

   return TreeView;

});