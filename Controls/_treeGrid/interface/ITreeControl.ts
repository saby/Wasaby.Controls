/**
 * Интерфейс для древовидных списков.
 *
 * @interface Controls/_treeGrid/interface/ITreeControl
 * @public
 * @author Авраменко А.С.
 */

/*
 * Interface for tree-like lists.
 *
 * @interface Controls/_treeGrid/interface/ITreeControl
 * @public
 * @author Авраменко А.С.
 */


/**
 * @typedef {String} hierarchyViewModeEnum
 * @variant tree Дерево.
 * @variant breadcrumbs Хлебные крошки.
 */

/*
 * @typedef {String} hierarchyViewModeEnum
 * @variant tree Tree-like view.
 * @variant breadcrumbs Just leaves, folders as paths.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#expandedItems
 * @cfg {{Array.<String>}} Массив идентификаторов развернутых узлов дерева.
 * <b>Note:</b>
 * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент - "null".
 * В этом случае предполагается, что все данные будут загружены сразу.
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#expandedItems
 * @cfg {{Array.<String>}} Array of identifiers of expanded items.
 * <b>Note:</b>
 * To expand all items, this option must be set as array containing one element “null”.
 * In this case, it is assumed that all data will be loaded initially.
 * @notice Without binding this option will be static. Use binding to allow expanding/collapsing nodes.
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 * @example
 * <pre>
 *      <Controls.treeGrid:View
 *           bind:expandedItems="_expandedItems">
 *      </Controls.treeGrid:View>
 *  </pre>
 *  @see collapsedItems
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#collapsedItems
 * @cfg {Boolean} Массив идентификаторов свернутых узлов дерева.
 * Этот параметр используется только при значении {@link Controls/_treeGrid/interface/ITreeControl#expandedItems expandedItems} - [null].
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#collapsedItems
 * @cfg {Boolean} Array of identifiers of collapsed items.
 * This option is used only when the value of {@link Controls/_treeGrid/interface/ITreeControl#expandedItems expandedItems} is [null].
 * @notice Without binding this option will be static. Use binding to allow expanding/collapsing nodes.
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 * @example
 * <pre>
 *      <Controls.treeGrid:View
 *           bind:expandedItems="_expandedItems"
 *           bind:collapsedItems="_collapsedItems">
 *      </Controls.treeGrid:View>
 *  </pre>
 *  @see collapsedItems
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#nodeFooterTemplate
 * @cfg {Function} Шаблон подвала раскрытого узла дерева.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#nodeFooterTemplate
 * @cfg {Function} Sets footer template that will be shown for every node.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#hasChildrenProperty
 * @cfg {String} Имя свойства, содержащего информацию о наличии дочерних элементов в узле дерева.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#hasChildrenProperty
 * @cfg {String} Name of the field that contains information whether the node has children.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#expanderVisibility
 * @cfg {String} Режим отображения элемента развертывания узла дерева.
 * @variant visible Всегда показывать экспандер для узлов и отступ для листьев.
 * @variant hasChildren Показывать экспандер только для узлов с дочерними элементами.
 * @default visible
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#expanderVisibility
 * @cfg {String} Mode displaying expander indent.
 * @variant visible Always show expander for nodes and indentation for leaves.
 * @variant hasChildren Show expander only for nodes with children.
 * @default visible
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#nodeLoadCallback
 * @cfg {Function} Функция обратного вызова для определения загрузки содержимого узла дерева.
 */

/*
 * @name Controls/_treeGrid/interface/ITreeControl#nodeLoadCallback
 * @cfg {Function} Callback function that will be called when node data loaded by source.
 */

/**
 * @event Controls/_treeGrid/interface/ITreeControl#itemExpanded Происходит при развертывании узла.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 */

/*
 * @event Controls/_treeGrid/interface/ITreeControl#itemExpanded Occurs after node expansion.
 * @param {Env/Event:Object} eventObject The event descriptor.
 */

/**
 * @event Controls/_treeGrid/interface/ITreeControl#itemCollapsed Происходит при сворачивании узла.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 */

/*
 * @event Controls/_treeGrid/interface/ITreeControl#itemCollapsed Occurs after node collapse.
 * @param {Env/Event:Object} eventObject The event descriptor.
 */

/**
 * Перезагружает данные дерева.
 * @function Controls/_treeGrid/interface/ITreeControl#reload
 * @remark
 * Перезагрузка выполняется с сохранением раскрытых узлов.
 * При этом в поле фильтра, указанное в parentProperty будет отправлен массив раскрытых узлов.
 * Если в результате запроса для этих узлов будут присланы дочерние элементы, то узлы останутся раскрытыми, иначе они будут свёрнуты.
 * @notice Постраничная навигация в запросе передается для корня и её параметр {@link Controls/interface/INavigation/PageSourceConfig.typedef pageSize} необходимо применять для всех узлов.
 * @notice Обратите внимание! При смене фильтра/навигации/source список раскрытых узлов сбрасывается.
 * @example
 * Пример списочного метода БЛ
 * <pre>
 * def Test.MultiRoot(ДопПоля, Фильтр, Сортировка, Навигация):
 *      rs = RecordSet(CurrentMethodResultFormat())
 *      if Навигация.Type() == NavigationType.ntMULTI_ROOT:
 *          nav_result = {}
 *          for id, nav in Навигация.Roots().items():
 *              # Запрашиваем данные по одному разделу.
 *              Фильтр.Раздел = id
 *              tmp_rs = Test.MultiRoot(ДопПоля, Фильтр, Сортировка, nav)
 *              # Склеиваем результаты.
 *              for rec in tmp_rs:
 *                  rs.AddRow(rec)
 *              # Формируем общий результа навигации по всем разделам.
 *              nav_result[ id ] = tmp_rs.nav_result
 *          rs.nav_result = NavigationResult(nav_result)
 *      else:
 *          # Тут обработка обычной навигации, например, вызов декларативного списка.
 *          rs = Test.DeclList(ДопПоля, Фильтр, Сортировка, Навигация)
 *      return rs
 *</pre>
 */
