/**
 * Interface for tree-like lists.
 *
 * @interface Controls/_treeGrid/interface/ITreeControl
 * @public
 * @author Авраменко А.С.
 */


/**
 * @typedef {String} hierarchyViewModeEnum
 * @variant tree Tree-like view.
 * @variant breadcrumbs Just leaves, folders as paths.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#expandedItems
 * @cfg {{Array.<String>}} Array of identifiers of expanded items.
 * <b>Note:</b>
 * To expand all items, this option must be set as array containing one element “null”.
 * In this case, it is assumed that all data will be loaded initially.
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#collapsedItems
 * @cfg {Boolean} Array of identifiers of collapsed items.
 * This option is used only when the value of  {@link Controls/_treeGrid/interface/ITreeControl#expandedItems expandedItems} is [null].
 * <a href="/materials/demo-ws4-tree-grid-base">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#nodeFooterTemplate
 * @cfg {Function} Sets footer template that will be shown for every node.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#hasChildrenProperty
 * @cfg {String} Name of the field that contains information whether the node has children.
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#expanderVisibility
 * @cfg {String} Mode displaying expander indent.
 * @variant visible Always show expander for nodes and indentation for leaves.
 * @variant hasChildren Show expander only for nodes with children.
 * @default visible
 * <a href="/materials/demo-ws4-tree-grid-extended">Example</a>.
 */

/**
 * @name Controls/_treeGrid/interface/ITreeControl#nodeLoadCallback
 * @cfg {Function} Callback function that will be called when node data loaded by source.
 */

/**
 * @event Controls/_treeGrid/interface/ITreeControl#itemExpanded Occurs after node expansion.
 */
/**
 * @event Controls/_treeGrid/interface/ITreeControl#itemCollapsed Occurs after node collapse.
 */

/**
 * Reloads tree data
 * @function Controls/_treeGrid/interface/ITreeControl#reload
 * @remark
 * 1. deepReload это перезагрузка с сохранением раскрытых узлов.
 * 2. deepReload выполняется при вызове прикладниками метода reload(). При смене фильтра/навигации/source все раскрытые узлы будут закрыты.
 * 3. В parentProperty уходит массив раскрытых узлов, и, если для них вернутся дочерние элементы, то тогда они после перезагрузки останутся раскрытыми.
 * 4. постраничная навигация сейчас передается только для корня. Таким образом, для остальных узлов необходимо отдавать количество записей, соответствующее переданному в параметрах навигации
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
