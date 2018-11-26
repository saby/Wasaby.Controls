define('SBIS3.CONTROLS/Mixins/TreeMixin', [
   "Core/core-clone",
   "Core/core-merge",
   'SBIS3.CONTROLS/Utils/TreeDataReload',
   "Core/constants",
   "Core/CommandDispatcher",
   "Core/Deferred",
   'SBIS3.CONTROLS/Utils/CursorListNavigation',
   "WS.Data/Display/Tree",
   "WS.Data/Collection/IBind",
   "tmpl!SBIS3.CONTROLS/Mixins/TreeMixin/resources/searchRender",
   "WS.Data/Entity/Model",
   "WS.Data/Relation/Hierarchy",
   "Core/core-instance",
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "Core/helpers/Function/forAliveOnly",
   "Core/IoC",
   "Core/helpers/Object/isEmpty",
   "Core/helpers/Object/isPlainObject",
   "Core/helpers/Function/runDelayed",
   "SBIS3.CONTROLS/BreadCrumbs",
   "tmpl!SBIS3.CONTROLS/DataGridView/resources/DataGridViewGroupBy",
   "WS.Data/Adapter/Sbis"
], function (coreClone, cMerge, TreeDataReload, constants, CommandDispatcher, Deferred, CursorListNavigationUtils, TreeProjection, IBindCollection, searchRender, Model, HierarchyRelation, cInstance, TemplateUtil, forAliveOnly, IoC, isEmpty, isPlainObject, runDelayed) {

   var createDefaultProjection = function(items, cfg) {
      var
         root, projection, rootAsNode,
         filter = [];
      if (typeof cfg.currentRoot != 'undefined') {
         root = cfg.currentRoot;
      }
      else {
         if (typeof cfg.root != 'undefined') {
            root = cfg.root;
         }
         else {
            root = null;
         }
      }
      rootAsNode = isPlainObject(root);
      if (rootAsNode) {
         root = Model.fromObject(root, 'adapter.sbis');
         root.setIdProperty(cfg.idProperty);
      }

      if (cfg.displayType == 'folders') {
         filter.push(projectionFilterOnlyFolders.bind(this));
      } else {
         filter.push(projectionFilter.bind(cfg));
      }

      if (cfg.itemsFilterMethod) {
         filter.push(cfg.itemsFilterMethod);
      }

      var
         projOptions = {
            collection: items,
            idProperty: cfg.idProperty || (cfg.dataSource ? cfg.dataSource.getIdProperty() : ''),
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty,
            loadedProperty: '!' + cfg.hasChildrenProperty,
            unique: true,
            root: root,
            rootEnumerable: rootAsNode,
            filter: filter,
            sort: cfg.itemsSortMethod
         };


      if (cfg.loadItemsStrategy == 'append') {
         projOptions.unique = false;
      }

      projection = new TreeProjection(projOptions);

      return projection;
   },
   _defaultItemsSortMethod = function(itemA, itemB) {
      var
         isNodeA = itemA.item.isNode(),
         isNodeB = itemB.item.isNode();
      if (isNodeA === isNodeB) {
         //сохраняем порядок сортировки, если вернуть 0 chrome сломает переданный порядок
         return itemA.index > itemB.index ? 1 : -1;
      } else {
         return isNodeA ? -1 : 1;
      }
   },
   getSearchCfg = function(cfg) {
      return {
         idProperty: cfg.idProperty,
         displayProperty: cfg.displayProperty,
         highlightEnabled: cfg.highlightEnabled,
         highlightText: cfg.highlightText,
         colorMarkEnabled: cfg.colorMarkEnabled,
         colorField: cfg.colorField,
         allowEnterToFolder: cfg.allowEnterToFolder,
         task1173671799: cfg.task1173671799
      }
   },
   searchProcessing = function(src, cfg) {
      var resRecords = [], lastNode, lastPushedNode, curPath = [], checkedParent;

      function pushPath(records, path, cfg) {
         if (path.length) {
            /*Получаем параметры, как будто хотим рисовать просто строку, соответствующую последней папке*/
            var defaultCfg = cfg._buildTplArgs(cfg);
            var lastFolder = path[path.length - 1];
            defaultCfg.projItem = lastFolder.projItem;
            defaultCfg.item = defaultCfg.projItem.getContents();
            defaultCfg.className = 'controls-HierarchyDataGridView__path';
            cfg._searchFolders[defaultCfg.item.get(cfg.idProperty)] = true;
            defaultCfg.itemContent = TemplateUtil.prepareTemplate(cfg._defaultSearchRender);

            defaultCfg.bcTpls = {};
            if (cfg.hierarchyViewModeItemTpl || cfg.hierarchyViewModeItemContentTpl) {
               defaultCfg.bcTpls.itemTpl = TemplateUtil.prepareTemplate(cfg.hierarchyViewModeItemTpl);
               defaultCfg.bcTpls.itemContentTpl = TemplateUtil.prepareTemplate(cfg.hierarchyViewModeItemContentTpl);
            }
            cMerge(defaultCfg, {
               path: coreClone(path),
               viewCfg: cfg._getSearchCfg(cfg)
            });

            records.push({
               tpl: defaultCfg.itemTpl,
               data: defaultCfg
            });
         }
      }

      var iterator;
      //может прийти массив или проекция
      if (src instanceof Array) {
         iterator = function(func){
            src.forEach(func);
         };
      }
      else {
         iterator = src.each.bind(src);
      }


      iterator(function (item) {
         // Группировка при поиске не поддерживается. https://online.sbis.ru/opendoc.html?guid=aa8e9981-64fc-4bb1-a75c-ef2fa0c73176
         if (cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
            return;
         }
         if ((item.getParent() != lastNode) && curPath.length) {
            if (lastNode != lastPushedNode) {
               pushPath(resRecords, curPath, cfg);
               lastPushedNode = lastNode;
            }
            while (curPath.length > 0) {
               lastNode = curPath[curPath.length - 1]['projItem'];
               if (item.getParent() == lastNode) {
                  break;
               }
               curPath.pop();
            }
         }

         function createPathElem(item) {
            var
               curParentContents = item.getContents(),
               pathElem = {};
            pathElem[cfg.idProperty] = curParentContents.getId();
            pathElem[cfg.displayProperty] = curParentContents.get(cfg.displayProperty);
            pathElem['projItem'] = item;
            pathElem['item'] = curParentContents;
            return pathElem;
         }

         if (item.isNode()) {
            // Если выводятся хлебные крошки из нового узла и отсутствует curPath (такое может быть когда данные пришли
            // на следующей странице), то вычисляем "с нуля" полный путь до данного узла основываясь цепочке родителей
            if (item.getParent() != lastNode && !curPath.length) {
               checkedParent = item.getParent();
               while (checkedParent && !checkedParent.isRoot()) {
                  curPath.unshift(createPathElem(checkedParent));
                  lastNode = checkedParent;
                  checkedParent = checkedParent.getParent();
               }
            }
            curPath.push(createPathElem(item));
            lastNode = item;
         } else {
            if (lastNode != lastPushedNode) {
               pushPath(resRecords, curPath, cfg);
               lastPushedNode = lastNode;
            }
            resRecords.push(item);
         }
      });

      if ((curPath.length) && (lastNode != lastPushedNode)){
         pushPath(resRecords, curPath, cfg);
         lastPushedNode = lastNode;
      }

      return resRecords;
   },
   prepareGroupId = function(item, groupId, cfg) {
      var
         hierarchyRelation = cfg._getHierarchyRelation(cfg);
      function calcGroupId(item) {
         var
            itemParent;
         // Обходим родителей именно через hierarchyRelation. Проекция на момент расчёта hash группы не построила иерархию и
         // пробежаться по родителям с помощью проекции не получится.
         // P.S. проекция не строит иерархию перед вычислением hash группы из-за оптимизации обхода (чтобы не делать его дважды, (c) Мальцев А.).
         if (hierarchyRelation) {
            itemParent = hierarchyRelation.hasParent(item, cfg._items) ? hierarchyRelation.getParent(item, cfg._items) : null;
         }
         return itemParent !== undefined ? itemParent === null ? '@' : itemParent.get(cfg.idProperty) + calcGroupId(itemParent) : '';
      }
      if (cfg.groupBy.groupNodes) {
         return groupId;
      } else {
         return calcGroupId(item) + groupId;
      }
   },
   getRecordsForRedraw = function(projection, cfg) {
      var
         prevItem,
         itemsForFooter = [],
         records = [],
         projectionFilter;

      projectionFilter = resetFilterAndStopEventRaising(projection, false);
      if (cfg.expand || cfg.hierarchyViewMode) {
         expandAllItems(projection, cfg);
      } else {
         /**
          * todo Переписать, когда будет выполнена указанная ниже задача
          * Задача в разработку от 28.04.2016 №1172779597
          * В деревянной проекции необходима возможность определять, какие элементы создаются развернутыми. Т...
          * https://inside.tensor.ru/opendoc.html?guid=6f1758f0-f45d-496b-a8fe-fde7390c92c7
          * @private
          */
         applyExpandToItemsProjection(projection, cfg);
      }
      restoreFilterAndRunEventRaising(projection, projectionFilter, false);

      cfg._searchFolders = {};
      cfg.hasNodes = false;
      if (cfg.hierarchyViewMode) {
         records = searchProcessing(projection, cfg);
      }
      else {
         var needGroup = false, groupId, groupHash;
         projection.each(function(item) {
            if (cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
               groupId = item.getContents();
               groupHash = item.getHash();
               needGroup = true;
            }
            else {
               if (item.isNode()){
                  cfg.hasNodes = true;
               }
               if (!isEmpty(cfg.groupBy) && cfg.easyGroup) {
                  if (cfg._canApplyGrouping(item, cfg) && needGroup && groupId) {
                     cfg._groupItemProcessing(groupId, records, item, cfg, groupHash);
                     needGroup = false;
                  }
               }

               if (cfg._hasFolderFooters(cfg)) {
                  if (itemsForFooter.length) {
                     if (item.getLevel() < prevItem.getLevel()) {
                        records.push({
                           tpl: cfg._footerWrapperTemplate,
                           data: cfg._getFolderFooterOptions(cfg, itemsForFooter.pop())
                        });
                     }
                  }
                  if (item.isNode() && item.isExpanded()) {
                     itemsForFooter.push(item);
                  }
                  prevItem = item;
               }
               records.push(item);
            }
         });
      }
      return records;
   },
   isVisibleItem =  function(item, onlyFolders) {
      if (onlyFolders && item.isNode() !== true) {
         return false;
      }
      var itemParent = item.getParent();
      return itemParent ? itemParent.isExpanded() ? isVisibleItem(itemParent) : false : true;
   },
   projectionFilter = function(item, index, itemProj, position, hasMembers) {
      var
         itemParent, itemParentContent;
      // Теперь сюда может прилететь groupItem. Проверка через instanceOfModule медленная, просто проверяю наличие метода.
      if (!itemProj.getParent) {
         return hasMembers;
      }
      // Добавил проверку на скрытый узел. Мы ожидаем, что скрытый узел при поиске не должен быть раскрытым (а его связанные записи - не должны сразу отрисовываться).
      itemParent = itemProj.getParent();
      itemParentContent = itemParent && itemParent.getContents();
      // Т.к. скрытые узлы не выводятся в режиме поиска, то добавил костыль-проверку на task1174261549.
      // Используется в админке, будет убрано, когда будет согласован стандарт на отображение скрытых узлов в режиме поиска.
      // Ошибка: https://online.sbis.ru/opendoc.html?guid=aac1226b-64f1-4b45-bb95-b44f2eb68ada
      // Поручение на проектировщиков: https://online.sbis.ru/opendoc.html?guid=9b93b078-a432-4550-86bc-1a7b2c4bac5c
      return (this.hierarchyViewMode && cInstance.instanceOfModule(itemParentContent, 'WS.Data/Entity/Record') && (itemParent.isNode() !== false || this.task1174261549)) || isVisibleItem(itemProj);
   },
   projectionFilterOnlyFolders = function(item, index, itemProj) {
      return (this._isSearchMode && this._isSearchMode()) || isVisibleItem(itemProj, true);
   },
   resetFilterAndStopEventRaising = function(projection, analyze) {
      var
         projectionFilter = projection.getFilter();
      projection.setEventRaising(false, analyze);
      projection.setFilter(function() { return true; });
      return projectionFilter;
   },
   restoreFilterAndRunEventRaising = function(projection, filter, analyze) {
      projection.setFilter(filter);
      projection.setEventRaising(true, analyze);
   },
   applyExpandToItemsProjection = function(projection, cfg) {
      var idx, item;
      for (idx in cfg.openedPath) {
         if (cfg.openedPath.hasOwnProperty(idx)) {
            item = projection.getItemBySourceItem(cfg._items.getRecordById(idx));
            if (item) {
               if (!item.isExpanded()) {
                  // Внимание! Даже не пытаться выпилить этот код! Логика заключается в том, что после перезагрузки данных (reload) нужно удалять из списка ветки, для которых
                  // из источника данных не пришли дочерние элементы. Если разработчик желает оставить папки развернутыми - пусть присылает при reload их дочерние элементы.
                  // todo Переделать, когда будет выполнена https://inside.tensor.ru/opendoc.html?guid=4673df62-15a3-4526-bf56-f85e05363da3&description=
                  var items = projection.getCollection(),
                     hierarchy = new HierarchyRelation({
                        idProperty: items.getIdProperty(),
                        parentProperty: projection.getParentProperty()
                     }),
                     children = hierarchy.getChildren(
                        item.getContents().getId(),
                        projection.getCollection()
                     );
                  if (children.length) {
                     item.setExpanded(true);
                  } else {
                     delete cfg.openedPath[idx];
                  }
               }
            } else { // Если узел в проекции не найден - то удаляем его из списка развернутых https://online.sbis.ru/opendoc.html?guid=202f1e3c-eab6-4f24-8879-f4cb4d007d22
               delete cfg.openedPath[idx];
            }
         }
      }
   },
   applyFilterToProjection = function(projection, cfg) {
      var
         filter = [];
      if (cfg.displayType == 'folders') {
         filter.push(projectionFilterOnlyFolders.bind(this));
      } else {
         filter.push(projectionFilter.bind(cfg));
      }
      if (cfg.itemsFilterMethod) {
         filter.push(cfg.itemsFilterMethod);
      }
      projection.setFilter(filter);
   },
   expandAllItems = function(projection, cfg) {
      var
         recordSet = projection.getCollection(),
         projItems = projection.getItems(),
         hierarchy = new HierarchyRelation({
            idProperty: recordSet.getIdProperty(),
            parentProperty: projection.getParentProperty()
         }),
         item, itemId;
      for (var i = 0; i < projItems.length; i++) {
         item = projItems[i];
         if (!cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem') && item.isNode() && !item.isExpanded()) {
            itemId = item.getContents().getId();
            if (hierarchy.getChildren(itemId, recordSet).length) {
               if (cfg.expand) {
                  cfg.openedPath[itemId] = true;
               }
               item.setExpanded(true);
               item.setLoaded(true);
               // Если режим единично раскрытого узла, то выходим после раскрытия первого найденного узла
               // https://online.sbis.ru/opendoc.html?guid=98a1ca67-7546-41b8-a948-48048e62150d
               if (cfg.singleExpand) {
                  return;
               }
            }
         }
      }
   },
   buildTplArgsTV = function(cfg) {
      var tplOptions = cfg._buildTplArgsLV.call(this, cfg);
      tplOptions.displayType = cfg.displayType;
      tplOptions.hierField = cfg.hierField;
      tplOptions.parentProperty = cfg.parentProperty;
      tplOptions.nodeProperty = cfg.nodeProperty;
      tplOptions.isSearch = cfg.hierarchyViewMode;
      tplOptions.hasNodes = cfg.hasNodes;
      tplOptions.getItemTemplateData = cfg._getItemTemplateData;
      tplOptions.hierarchy = new HierarchyRelation({
         idProperty: cfg.idProperty,
         parentProperty: cfg.parentProperty
      });

      return tplOptions;
   },

   hasNodeWithChild = function(cfg) {
      var
         items = cfg._items,
         itemsProjection = cfg._itemsProjection,
         hierarchyRelation = cfg._getHierarchyRelation(cfg),
         hasNodeWithChild = false,
         idx = 0,
         itemsCount = itemsProjection.getCount(),
         child, itemProjection;
      while (idx < itemsCount && !hasNodeWithChild) {
         itemProjection = itemsProjection.at(idx);
         if (cfg.partialyReload && !itemProjection.isLoaded()) {
            hasNodeWithChild = !!itemProjection.getContents().get(cfg.hasChildrenProperty);
         } else {
            child = hierarchyRelation.getChildren(
               itemProjection.getContents().getId(),
               items
            );
            if (child.length) {
               hasNodeWithChild = true;
            }
         }
         idx++;
      }
      return hasNodeWithChild;
   },

   getHierarchyRelation = function(cfg) {
      var
         items = cfg._items;
      return new HierarchyRelation({
         idProperty: items ? items.getIdProperty() : '',
         parentProperty: cfg.parentProperty,
         nodeProperty: cfg.nodeProperty
      });
   };

   getItemTemplateData = function(cfg){
      return {
         nodePropertyValue: cfg.item.get(cfg.nodeProperty),
         projection: cfg.projItem.getOwner(),
         padding: cfg.paddingSize * (cfg.projItem.getLevel() - 1) + cfg.originallPadding
      };
   };
   /**
    * Миксин позволяет контролу отображать данные, которые имеют иерархическую структуру, и работать с ними.
    * На DOM-элементы, отображающие развернутые узлы вешается css-класс "controls-TreeView__item-expanded". Для свернутых узлов используется css-класс "controls-TreeView__item-collapsed".
    * @mixin SBIS3.CONTROLS/Mixins/TreeMixin
    * @public
    * @author Крайнов Д.О.
    */
   var TreeMixin = /** @lends SBIS3.CONTROLS/Mixins/TreeMixin.prototype */{

      /**
       * @name SBIS3.CONTROLS/Mixins/TreeMixin#reload
       * @function
       * @description Перезагружает набор записей представления данных с последующим обновлением отображения.
       * @param {Object} filter Параметры фильтрации.
       * @param {String|Array.<Object.<String,Boolean>>} sorting Параметры сортировки.
       * @param {Number} offset Смещение первого элемента выборки.
       * @param {Number} limit Максимальное количество элементов выборки.
       * @param {Boolean} deepReload Признак глубокой перезагрузки: в значении true устанавливает поведение, при котором папки открытые до перезагрузки данных останутся также открытыми и после перезагрузки.
       * @example
       * <pre>
       *    myDataGridView.reload(
       *       { // Устанавливаем параметры фильтрации: требуются записи, в которых поля принимают следующие значения
       *          iata: 'SVO',
       *          direction: 'Arrivals',
       *          state: 'Landed',
       *          fromCity: ['New York', 'Los Angeles']
       *       },
       *       [ // Устанавливаем параметры сортировки: сначала производится сортировка по полю direction, а потом - по полю state
       *          {direction: false}, // Поле direction сортируется по возрастанию
       *          {state: true} // Поле state сортируется по убыванию
       *       ],
       *       50, // Устанавливаем смещение: из всех подходящих записей отбор результатов начнём с 50-ой записи
       *       20, // Требуется вернуть только 20 записей
       *       true // После перезагрузки оставим узлы открытыми
       *    );
       * </pre>
       */
      /**
       * @event onSetRoot Происходит при загрузке данных и перед установкой корня иерархии.
       * @remark
       * При каждой загрузке данных, например вызванной методом {@link SBIS3.CONTROLS/ListView#reload}, происходит событие onSetRoot.
       * В этом есть необходимость, потому что в переданных данных может быть установлен новый path - путь для хлебных крошек (см. {@link WS.Data/Collection/RecordSet#meta}).
       * Хлебные крошки не перерисовываются, так как корень не поменялся.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} curRoot Идентификатор узла, который установлен в качестве текущего корня иерархии.
       * @param {Array.<Object>} hierarchy Массив объектов, каждый из которых описывает узлы иерархии установленного пути.
       * @param {String|Number|Null} root Идентификатор узла, который установлен в качестве корня иерархии для всего реестра.
       * Каждый объект содержит следующие свойства:
       * <ul>
       *    <li>id - идентификатор текущего узла иерархии;</li>
       *    <li>parent - идентификатор предыдущего узла иерархии;</li>
       *    <li>title - значение поля отображения (см. {@link SBIS3.CONTROLS/Mixins/DSMixin#displayProperty});</li>
       *    <li>color - значение поля записи, хранящее данные об отметке цветом (см. {@link SBIS3.CONTROLS/Mixins/DecorableMixin#colorField});</li>
       *    <li>data - запись узла иерархии, экземпляр класса {@link WS.Data/Entity/Record}.</li>
       * </ul>
       * @see onBeforeSetRoot
       */
      /**
       * @event onBeforeSetRoot Происходит при установке текущего корня иерархии.
       * @remark
       * Событие может быть инициировано при использовании метода {@link setCurrentRoot}.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} key Идентификатор узла иерархии, который будет установлен. Null - это вершина иерархии.
       * @see onSetRoot
       */
      /**
       * @event onSearchPathClick Происходит при клике по хлебным крошкам, отображающим результаты поиска.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String|Number} id Ключ узла, по которому произвели клик.
       * @return Если из обработчика события вернуть false, то загрузка узла не произойдет.
       * @example
       * <pre>
       *    DataGridView.subscribe('onSearchPathClick', function(eventObject){
       *      searchForm.clearSearch();
       *    });
       * </pre>
       */
      /**
       * @event onNodeExpand Происходит после разворачивания узла.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String|Number} key Идентификатор узла.
       * @param {jQuery} object Контейнер узла.
       * @see onNodeCollapse
       */
      /**
       * @event onNodeCollapse Происходит после сворачивания узла.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String|Number} key Идентификатор узла.
       * @param {jQuery} object Контейнер узла.
       * @see onNodeExpand
       */
      $protected: {
         _options: {
            _hasNodeWithChild: hasNodeWithChild,
            _folderOffsets : {},
            _folderHasMore : {},
            _prepareGroupId: prepareGroupId,
            _buildTplArgs: buildTplArgsTV,
            _buildTplArgsTV: buildTplArgsTV,
            _getItemTemplateData: getItemTemplateData,
            _getHierarchyRelation: getHierarchyRelation,
            _defaultSearchRender: searchRender,
            _getSearchCfgTv: getSearchCfg,
            _getSearchCfg: getSearchCfg,
            _searchFolders: {},
            _getRecordsForRedraw: getRecordsForRedraw,
            _getRecordsForRedrawTree: getRecordsForRedraw,
            _createDefaultProjection : createDefaultProjection,
            _curRoot: null,
            /**
             * @cfg {String} Устанавливает режим отображения иконки разворота узла
             * @variant always Отображать иконку разворота узла всегда, не зависимо от наличия дочерних элементов
             * @variant withChild Отображать иконку разворота узла в том случае, если имеется хотя бы один дочерний элемент
             * @variant never Скрывать иконку разворота узла всегда
             */
            expanderDisplayMode: 'always',
            /**
             * @cfg {String|Number} Устанавливает идентификатор узла, относительно которого отображаются данные в текущий момент
             */
            currentRoot: null,
            /**
             * @cfg {String|Number} Устанавливает идентификатор узла, относительно которого нужно отображать данные. Такой узел будет считаться вершиной иерархии.
             * @example
             * <pre>
             *    <option name="root">12688410,ПапкаДокументов</option>
             * </pre>
             * @see setCurrentRoot
             * @see getCurrentRoot
             */
            root: undefined,
            /**
             * @cfg {String} Устанавливает поле иерархии, по которому будут установлены иерархические связи записей списка.
             * @remark
             * Поле иерархии хранит первичный ключ той записи, которая является узлом для текущей. Значение null - запись расположена в корне иерархии.
             * Например, поле иерархии "Раздел". Название поля "Раздел" необязательное, и в каждом случае может быть разным.
             * По полю иерархии устанавливаются два других служебных поля - "Раздел@" и "Раздел$" , подробнее о назначении которых вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/hierarchy/#_2">Требования к источнику данных</a>.
             * @example
             * <pre>
             *    <option name="hierField">Раздел</option>
             * </pre>
             * @see getHierarchy
             * @see setHierarchy
             * @deprecated Используйте опции {@link parentProperty}, {@link nodeProperty} и {@link hasChildrenProperty}.
             */
            hierField: null,
            /**
             * @cfg {String} Устанавливает поле, по значениям которого определяются иерархические отношения элементов списка.
             * @remark
             * Поле иерархии хранит первичный ключ той записи, которая является узлом для текущей. Значение null - запись расположена в корне иерархии.
             * Например, поле иерархии "Раздел". Название поля "Раздел" необязательное, и в каждом случае может быть разным.
             * @see nodeProperty
             */
            parentProperty: null,
            /**
             * @cfg {String} Устанавливает имя поля, по значениям которого определяются <a href='/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy'>типы записей в иерархии</a>.
             * @see parentProperty
             */
            nodeProperty: null,
            /**
             * @cfg {String} Устанавливает поле, по значениям которого определяется признак наличия дочерних элементов.
             * @see parentProperty
             */
            hasChildrenProperty: null,
            /**
             * @cfg {String} Устанавливает режим отображения записей: отображать только записи типа "Узел" (папка) или любые типы записей.
             * @remark
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * В режиме развернутого списка будут отображены узлы группировки данных (папки) и данные, сгруппированные по этим узлам.
             * В режиме свернутого списка будет отображен только список узлов (папок).
             * @variant folders Отображать только записи типа "Узел".
             * @variant all Отображать записи всех типов иерархии.
             *
             * Подробное описание иерархической структуры приведено в документе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Типы отношений в таблицах БД</a>.
             * @example
             * Устанавливаем режим полного отображения данных: будут отображены элементы коллекции и папки, по которым сгруппированы эти элементы.
             * <pre class="brush:xml">
             *     <option name="displayType">all</option>
             * </pre>
             */
            displayType : 'all',
            /**
             * @cfg {Boolean} Устанавливает поведение, при котором единовременно может быть раскрыт только одна запись типа "Узел" или "Скрытый узел" на одном структурном уровне.
             * @remark
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <option name="singleExpand">true</option>
             * </pre>
             */
            singleExpand: false,
            /**
             * @cfg {Boolean} Раскрыть содержимое папок (запись с типом "Узел") при первой загрузке контрола.
             * @remark
             * Когда опция expand установлена в значение true, опцию {@link partialyReload} необходимо установить в значение false, чтобы обеспечить корректную работу контрола.
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @see setExpand
             * @see getExpand
             */
            expand: false,
            /**
             * @cfg {Boolean} Устанавливает поведение загрузки дочерних данных для записей типа "Узел" (папка) и "Скрытый узел".
             * @remark
             * <ul>
             *    <li>В значении true данные подгружаются только при раскрытии или проваливании внутрь.</li>
             *    <li>В значении false данные подгружается сразу при загрузке контролов.</li>
             * </ul>
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <option name="partialyReload">false</option>
             * </pre>
             */
            partialyReload: true,
            /**
             * @cfg {Boolean} Глубокая перезагрузка. Позволяет запрашивать текущие открытые папки при перезагрузке
             * @deprecated Опция будет удалена в 3.7.4.100. Используйте передачу параметра deepReload в непосредственно в метод {@link reload}.
             */
            deepReload: false,
            /**
             * @cfg {Object} Устанавливает список записей типа "Узел" (папка) и "Скрытый узел", содержимое которых будет раскрыто.
             * @remark
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <options name="openedPath">
             *       <option name="12688410">true</option>
             *    </options>
             * </pre>
             * @see getOpenedPath
             * @see setOpenedPath
             */
            openedPath : {},
            /**
             * @cfg {Boolean} Устанавливает признак, при котором клик по записи типа "Узел" (папка) не производит проваливание внутрь иерархии, а раскрывает её содержимое.
             * @remark
             * При клике по записи типа "Скрытый узел" проваливание внутрь иерархии запрещено по умолчанию и не подлежит изменению.
             * Подробнее о типах иерархических записей читайте в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    allowEnterToFolder="{{false}}"
             * </pre>
             */
            allowEnterToFolder: true,
            /**
             * @cfg {Function|null} Устанавливает метод для сортировки элементов.
             * @remark
             * Если передать null, то данные сортироваться не будут. По умолчанию данные сортируются так: с начала папки потом листья.
             * @example
             * <pre>
             *    <option name="itemsSortMethod" value="null"></option>
             * </pre>
             * <pre>
             *    var tree = new Tree({
             *       elem: 'demoTree',
             *       itemsSortMethod: function (objA, objB) {
             *          var
             *             isNodeA = objA.item.isNode(),
             *             isNodeB = objB.item.isNode();
             *          if (isNodeA === isNodeB) {
             *             return objA.index > objB.index ? 1 : -1;
             *          } else {
             *              return isNodeA ? -1 : 1;
             *          }
             *       });
             * </pre>
             * @see SBIS3.CONTROLS/Mixins/ItemsControlMixin#itemsSortMethod
             * @see SBIS3.CONTROLS/Mixins/ItemsControlMixin#setItemsSortMethod
             */
            itemsSortMethod: _defaultItemsSortMethod,
            _applyFilterToProjection: applyFilterToProjection,
             /**
              * @cfg {Boolean}
              */
            hierarchyViewMode: false,
            hierarchyViewModeItemTpl: '',
            hierarchyViewModeItemContentTpl: '',
            /**
             * @cfg {String} Устанавливает стратегию действий с подгружаемыми в список записями
             * @variant merge - мержить, при этом записи с одинаковыми id схлопнутся в одну
             * @variant append - добавлять, при этом записи с одинаковыми id будут выводиться в списке
             *
             */
            loadItemsStrategy: 'merge',
            task1174261549: false,
            /**
             * @cfg {Boolean} Сохраняет значение выбранной записи после перезагрузки
             * @remark
             * Работает только с <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/navigations/cursor/">навигацией по курсору</a>.
             */
            saveReloadPosition: false
         },
         _lastParent : undefined,
         _lastDrawn : undefined,
         _lastPath : [],
         _loadedNodes: {},
         _previousRoot: undefined,
         _hier: [],
         _hierPages: {},
         _hierNodesCursor: {}
      },

      $constructor : function() {
         var
            filter = this.getFilter() || {};
         this._publish('onSearchPathClick', 'onNodeExpand', 'onNodeCollapse', 'onSetRoot', 'onBeforeSetRoot');
         if (typeof this._options.root != 'undefined') {
            filter[this._options.parentProperty] = this._options.root;
         }
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'С узлами и листьями';
         }
         this.setFilter(filter, true);
         CommandDispatcher.declareCommand(this, 'BreadCrumbsItemClick', this._breadCrumbsItemClick);
      },

      /**
       * Устанавливает поле иерархии.
       * @param {String }hierField Название поля иерархии.
       * @see hierField
       * @see getHierField
       */
      setHierField: function (hierField) {
         IoC.resolve('ILogger').log('TreeMixin', 'Метод setHierField устарел, используйте setParentProperty/setNodeProperty');
         this.setParentProperty(hierField);
      },
      /**
       * Возвращает название поля иерархии.
       * @return {String}
       * @see hierField
       * @see setHierField
       */
      getHierField : function(){
         IoC.resolve('ILogger').log('TreeMixin', 'Метод getHierField устарел, используйте getParentProperty/getNodeProperty');
         return this.getParentProperty();
      },
      /**
       * Устанавливает поле иерархии.
       * @param {String }pp Название поля иерархии.
       * @see parentProperty
       * @see getParentProperty
       */
      setParentProperty: function (pp) {
         this._options.parentProperty = pp;
         
         if (this._getItemsProjection()) {
            this._getItemsProjection().setParentProperty(pp);
         }
      },
      /**
       * Возвращает название поля иерархии.
       * @return {String}
       * @see parentProperty
       * @see setParentProperty
       */
      getParentProperty : function(){
         return this._options.parentProperty;
      },
      /**
       * Устанавливает поле типа записи в иерархии.
       * @param {String }np Название поля иерархии.
       * @see nodeProperty
       * @see getNodeProperty
       */
      setNodeProperty: function (np) {
         this._options.nodeProperty = np;
      },
      /**
       * Возвращает поле типа записи в иерархии.
       * @return {String}
       * @see nodeProperty
       * @see setNodeProperty
       */
      getNodeProperty : function(){
         return this._options.nodeProperty;
      },
      /**
       * Закрывает узел по переданному идентификатору.
       * @param {String|Number} id Идентификатор закрываемого узла.
       * @remark
       * Метод используют для программного управления видимостью содержимого узла в общей иерархии.
       * Чтобы раскрыть узел по переданному идентификатору, используйте метод {@link expandNode}.
       * Чтобы изменять видимость содержимого узла в зависимости от его текущего состояния, используйте метод {@link toggleNode}.
       * @see expandNode
       * @see toggleNode
       */
      collapseNode: function(id, hash) {
         //todo https://online.sbis.ru/opendoc.html?guid=561eb028-84bd-4395-a19f-898c0e2d2b5e&des=
         var item;
         if (hash) {
            item = this._getItemsProjection().getByHash(hash);
         } else {
            item = this._getItemProjectionByItemId(id);
         }
         if (item) {
            // Реакция на сворачивание может настать раньше чем долетит и будет обработано событие onChangeExpanded
            // Следовательно, при сворачивании сразу синхронизируем список развернутых узлов.
            delete this._options.openedPath[id];
            item.setExpanded(false);
            return Deferred.success();
         } else {
            return Deferred.fail();
         }
      },
      /**
       * Закрыть или открыть узел.
       * @param {String|Number} id Идентификатор переключаемого узла.
       * @see collapseNode
       * @see expandNode
       */
      toggleNode: function(id, hash) {
         //todo https://online.sbis.ru/opendoc.html?guid=561eb028-84bd-4395-a19f-898c0e2d2b5e&des=
         var item;
         if (hash) {
            item = this._getItemsProjection().getByHash(hash);
         }
         else {
            item = this._getItemProjectionByItemId(id);
         }
         if (item) {
            return this[item.isExpanded() ? 'collapseNode' : 'expandNode'](id, hash);
         } else {
            return Deferred.fail();
         }
      },
      /**
       * Раскрывает узел.
       * @param {String|Number} id Идентификатор раскрываемого узла
       * @returns {Deferred}
       * @see collapseNode
       * @see toggleNode
       */
      expandNode: function(id, hash) {
         //todo https://online.sbis.ru/opendoc.html?guid=561eb028-84bd-4395-a19f-898c0e2d2b5e&des=
         var
            item,
            ignoreKeys = {};
         if (hash) {
            item = this._getItemsProjection().getByHash(hash);
         }
         else {
            item = this._getItemProjectionByItemId(id);
         }
         if (item) {
            if (item.isExpanded()) {
               return Deferred.success();
            } else {
               if (this._options.singleExpand) {
                  ignoreKeys[id] = true;
                  this._collapseNodes(this.getOpenedPath(), ignoreKeys);
               }
               this._options.openedPath[id] = true;
               return this._loadNode(id, hash).addCallback(forAliveOnly(function() {
                  var expItem;
                  if (hash) {
                     expItem = this._getItemsProjection().getByHash(hash);
                  }
                  else {
                     expItem = this._getItemProjectionByItemId(id);
                  }
                  expItem.setExpanded(true);
               }).bind(this));
            }
         } else {
            return Deferred.fail();
         }
      },
      _loadNode: function(id, hash) {
         var
            preparedFilter;
         if (this._dataSource && !this._loadedNodes[id] && this._options.partialyReload) {
            this._toggleIndicator(true);
            preparedFilter = this._createTreeFilter(id);
            this._notify('onBeforeDataLoad', preparedFilter, this.getSorting(), 0, this._limit);
            return this._callQuery(preparedFilter, this.getSorting(), 0, this._limit).addCallback(forAliveOnly(function (list) {
               if (this._isCursorNavigation() && this._options.saveReloadPosition && list.getCount()) {
                  if (Object.prototype.toString.apply(this._options.navigation.config.field) === '[object Array]') {
                     this._hierNodesCursor[id] = [];
                     this._options.navigation.config.field.forEach(function(field) {
                        this._hierNodesCursor[id].push(list.at(list.getCount() - 1).get(field));
                     }.bind(this));
                  } else {
                     this._hierNodesCursor[id] = list.at(list.getCount() - 1).get(this._options.navigation.config.field);
                  }
               }
               this._options._folderHasMore[id] = list.getMetaData().more;
               this._options._folderOffsets[id] = 0;
               this._loadedNodes[id] = true;
               this._notify('onDataMerge', list); // Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad, так как на него много всего завязано. (пользуется Янис)
               this._onDataMergeCallback(list);
               if (this._options.loadItemsStrategy == 'merge') {
                  this._options._items.merge(list, {remove: false});
               }
               else {
                  this._options._items.append(list);
               }
               // Всегда стараемся работать через hash
               // https://online.sbis.ru/opendoc.html?guid=4b3c5ebf-f623-4d2e-9d96-8db8ee32d666
               if (hash) {
                  this._getItemsProjection().getByHash(hash).setLoaded(true);
               } else {
                  this._getItemProjectionByItemId(id).setLoaded(true);
               }
               this._dataLoadedCallback();
            }).bind(this))
            .addBoth(function(error){
               this._toggleIndicator(false);
               return error;
            }.bind(this));
         } else {
            return Deferred.success();
         }
      },
      _redrawHierarchyPathItem: function(item) {
         var
            displayProperty = this._options.displayProperty,
            itemContents = item.getContents(),
            displayPropertyNewValue = itemContents.get(displayProperty),
            id = itemContents.getId(),
            breadCrumbsWithItem = this._container.find('[data-id="'+ id + '"]').parents('.controls-TreeView__searchBreadCrumbs');
         breadCrumbsWithItem.each(function(idx, elem) {
            var
               breadCrumbsInst = elem.wsControl;
            // Нужно мержить изменения "во все места".
            breadCrumbsInst.getItems().getRecordById(id).set(displayProperty, displayPropertyNewValue);
            breadCrumbsInst.getItems().getRecordById(id).get('item').merge(itemContents);
            breadCrumbsInst.redraw();
         });
      },
      _setHierarchyViewMode: function(value) {
         if (this._options.hierarchyViewMode !== value) {
            this._options.hierarchyViewMode = value;
            if (this._isCursorNavigation() && this._options.saveReloadPosition) {
               // При переключении режима обнуляем запомненные позиции курсора
               // https://online.sbis.ru/opendoc.html?guid=c8920dc6-2fe4-475d-944e-2c2aa4018deb
               this.getListNavigation().setPosition(null);
               this._hierPages = {};
               this._hierNodesCursor = {};
            }
         }
      },
      /**
       * Получить список записей для отрисовки
       * @private
       */
      _breadCrumbsItemClick : function(id, crumbPath) {
         var
            self = this;
         //Таблицу нужно связывать только с тем PS, в который кликнули. Хорошо, что сначала идет _notify('onBreadCrumbClick'), а вотом выполняется setCurrentRoot
         if (this._notify('onSearchPathClick', id) !== false ) {


            var filter = cMerge(this.getFilter(), {
               'Разворот' : 'Без разворота'
            });
            /*TODO решить с этим параметром*/
            filter[this._searchParamName] = undefined;
            //Если бесконечный скролл был установлен в опции - вернем его
            this.setInfiniteScroll(this._options.infiniteScroll, true);
            this.setHighlightText('', false);
            this.setFilter(filter, true);
            this._setHierarchyViewMode(false);
            if (this._options.task1173671799 && !this._options.allowEnterToFolder) {
               crumbPath.forEach(function(id) {
                  self._options.openedPath[id] = true;
               });
               this.setCurrentRoot(this.getRoot());
               this.reload(undefined, undefined, undefined, undefined, true); // Это deepReload, детка!
            } else {
               this.setCurrentRoot(id);
               this.reload();
            }
         }
      },
      _isVisibleItem: function(item, onlyFolders) {
         if (onlyFolders && (item.isNode() !== true)) {
            return false;
         }
         var itemParent = item.getParent();
         return itemParent ? itemParent.isExpanded() ? this._isVisibleItem(itemParent) : false : true;
      },

      _getGroupItems: function(groupId) {
         var
            rootItems = [],
            fullItems = this._getItemsProjection().getGroupItems(groupId);

         for (var i = 0; i < fullItems.length; i++) {
            if (this._canApplyGrouping(fullItems[i])) {
               rootItems.push(fullItems[i]);
            }
         }
         return rootItems;
      },

      _getItemsForRedrawOnAdd: function(itemsArray) {
         var
            items = coreClone(itemsArray),
            itemsToAdd = [], start = 0, groupId, groupHash,
            lastItem, breadCrumbs;
         if (this._options.hierarchyViewMode) {
            itemsToAdd = searchProcessing(items, this._options);
            // При поиске может возникнуть ситуация, когда часть хлебных крошек прилетает на первой странице, а часть на второй.
            // В связи с этим проверяем последний элемент в itemsContainer. Если он является хлебными крошками, то проверяем
            // что первый элемент - является теми же крошками, то просто меняем набор данных в крошках и удаляем первый элемент.
            // https://online.sbis.ru/opendoc.html?guid=3c76d37f-365c-47a2-97b6-2851d3b66bf1
            lastItem = this._getItemsContainer().find('>.controls-ListView__item:last');
            if (lastItem.hasClass('controls-HierarchyDataGridView__path')) {
               breadCrumbs = lastItem.find('.controls-BreadCrumbs').wsControl();
               if (itemsToAdd[0].data && breadCrumbs.getItems().at(0).getId() === itemsToAdd[0].data.path[0][this._options.idProperty]) {
                  breadCrumbs.setItems(itemsToAdd[0].data.path);
                  itemsToAdd.shift();
               }
            }
         } else {
            if (items.length && cInstance.instanceOfModule(items[0], 'WS.Data/Display/GroupItem')) {
               groupId = items[0].getContents();
               groupHash = items[0].getHash();
               if (groupId !== false && items.length > 1 && this._canApplyGrouping(items[1])) {
                  this._options._groupItemProcessing(groupId, itemsToAdd, items[1], this._options, groupHash);
               }
               items.splice(0, 1);
               itemsToAdd = itemsToAdd.concat(items);
            } else {
               for (var i = start; i < items.length; i++) {
                  if (this._isVisibleItem(items[i])) {
                     itemsToAdd.push(items[i]);
                  }
               }
            }
         }
         return itemsToAdd;
      },
      /**
       * Создаёт фильтр для дерева (берет текущий фильтр и дополняет его)
       * @param key
       * @returns {Object|{}}
       * @private
       */
      _createTreeFilter: function(key) {
         var
            filter = coreClone(this.getFilter()) || {};
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
            this.setFilter(coreClone(filter), true);
         }
         filter[this._options.parentProperty] = key;
         return filter;
      },
      /**
       * Закрыть ветки, кроме переданных в параметре ignoreKeys
       * @param openedPath
       * @param ignoreKeys
       * @private
       */
      _collapseNodes: function(openedPath, ignoreKeys) {
         for (var key in openedPath) {
            if (openedPath.hasOwnProperty(key)) {
               if (!ignoreKeys || !ignoreKeys[key]) {
                  this.collapseNode(key);
               }
            }
         }
      },
      /**
       * Получить текущий набор открытых элементов иерархии.
       * @return {Object}
       * @see openedPath
       * @see setOpenedPath
       */
      getOpenedPath: function() {
         return this._options.openedPath;
      },
      /**
       * Устанавливает набор раскрытых узлов, метод работает только для уже ЗАГРУЖЕННЫХ узлов и только если у них есть дочерние записи
       * @param openedPath Список раскрываемых узлов
       * @example
       * <pre>
       *    DataGridView.setOpenedPath({
       *       1: true,
       *       3: true
       *    });
       * </pre>
       * @see openedPath
       * @see getOpenedPath
       */
      setOpenedPath: function(openedPath) {
         var
            itemsProjection = this._getItemsProjection(),
            projectionFilter;
         if (itemsProjection) { // Если имеется проекция - то применяем разворот к итемам, иначе он применится после создания проекции
            projectionFilter = resetFilterAndStopEventRaising(itemsProjection, true);
            this._collapseNodes(this.getOpenedPath(), openedPath);
            this._options.openedPath = coreClone(openedPath);
            applyExpandToItemsProjection(itemsProjection, this._options);
            restoreFilterAndRunEventRaising(itemsProjection, projectionFilter, true);
         } else {
            this._options.openedPath = coreClone(openedPath);
         }
      },
      _removeFromLoadedRemoteNodes: function(remoteNodes) {
         var isDeletingFromItems = false;
         if (remoteNodes.length) {
            for (var idx = 0; idx < remoteNodes.length; idx++) {
               if (!cInstance.instanceOfModule(remoteNodes[0], 'WS.Data/Display/GroupItem')) {
                  // Удаляем только если запись удалена из items, иначе - это было лишь сворачивание веток.
                  if (isDeletingFromItems || !this.getItems().getRecordById(remoteNodes[0].getContents().getId())) {
                     isDeletingFromItems = true;
                     delete this._loadedNodes[remoteNodes[idx].getContents().getId()];
                  }
                  else {
                     break;
                  }
               }
            }
         }
      },
      around: {
         _prepareAdditionalFilterForCursor: function(parentFn, filter, direction) {
            var
               position,
               nodeId = filter[this._options.parentProperty],
               fields = this._options.navigation.config.field instanceof Array ? this._options.navigation.config.field : [this._options.navigation.config.field];
            if (nodeId != this.getCurrentRoot() && !(typeof nodeId === 'undefined' && this.getCurrentRoot() === null) &&
               !(nodeId === null && typeof this.getCurrentRoot() === 'undefined')) {
               if (this._hierNodesCursor[nodeId] instanceof Array) {
                  position = this._hierNodesCursor[nodeId];
               } else if (typeof this._hierNodesCursor[nodeId] !== 'undefined') {
                  position = [this._hierNodesCursor[nodeId]];
               } else {
                  position = [null];
               }
               return CursorListNavigationUtils.getNavigationParams(fields, position, direction || this._options.navigation.config.direction);
            } else {
               return parentFn.call(this, filter, direction);
            }
         },
         _prepareClassesByConfig: function(parentFn, cfg) {
            parentFn(cfg);
            if (cfg.expanderDisplayMode === 'withChild') {
               cfg.preparedClasses += ' controls-TreeView__hideExpanderEmptyNodes';
               if (cfg._items && !cfg._hasNodeWithChild(cfg)) {
                  cfg.preparedClasses += ' controls-TreeView__hideExpands';
               }
            } else if (cfg.expanderDisplayMode === 'never') {
               cfg.preparedClasses += ' controls-TreeView__hideExpands';
            }
         },
         _getQueryForCall: function(parentFn, filter, sorting, offset, limit, direction) {
            var
               curRoot;
            // Устанавливаем позицию в listCursorNavigation при загрузке корня
            if (this._isCursorNavigation() && this._options.saveReloadPosition && filter[this._options.parentProperty] === this.getCurrentRoot()) {
               curRoot = this.getCurrentRoot();
               if (typeof curRoot === 'undefined') {
                  curRoot = null;
               }
               if (typeof this._hierPages[curRoot] !== 'undefined') {
                  this.getListNavigation().setPosition(this._hierPages[curRoot]);
               }
            }
            return parentFn.call(this, filter, sorting, offset, limit, direction);
         },
         /**
          * Позволяет перезагрузить данные как одной модели, так и всей иерархии из дочерних элементов этой записи.
          * @param {Number} id Идентификатор записи.
          * @param {Object|WS.Data/Entity/Model} [meta] Мета информация.
          * Значение параметра применяется, когда направление direction не установлено в значение "inside".
          * @param {String} [direction] Направление при иерархическом обходе дочерних узлов.
          * Варианты значений:
          * <ul>
          *    <li>undefined || "" (не задано, пустая строка) - осуществляется перезагрузка одной конкретной записи.</li>
          *    <li>"inside" - перезагрузка данных по иерархии внутрь.</li>
          * </ul>
          * В случае, когда direction принимает значение "inside", будет сформирован фильтр для перезагрузки данных.
          * Фильтр будет состоять из дополненного текущего фильтра представления:
          * <ul>
          *     <li><b>Поле иерархии</b> (например, "Раздел") будет содержать ID узла, перезагрузка которого осуществляется.</li>
          *     <li><b>Поле "reloadableNodes"</b> будет содержать объект, свойствами которого будут ID узлов, для которых необходимо обновить данные.
          *     Для обновления данных самого перезагружаемого узла достаточно вернуть его в результах запроса вместе с остальными данными.</li>
          * </ul>
          * @returns {Deferred}
          */
         reloadItem: function(parentFn, id, meta, direction) {
            var
               self = this,
               selectedKey = this._options.selectedKey,
               items = this.getItems(),
               item = items.getRecordById(id),
               hierarchyRelation = this._options._getHierarchyRelation(this._options),
               nodeProperty = this.getNodeProperty(),
               filter;
            if (direction === 'inside') {
               if (item) {
                  filter = coreClone(this.getFilter());
                  filter[this.getParentProperty()] = id === 'null' ? null : id;
                  filter.reloadableNodes = TreeDataReload.prepareReloadableNodes({
                     direction: direction,
                     hierarchyRelation: hierarchyRelation,
                     item: item,
                     items: items,
                     nodeProperty: nodeProperty
                  });
                  this._notify('onBeforeDataLoad', filter, this.getSorting(), this._offset, this._limit);
                  return this._callQuery(filter, this.getSorting(), this._offset, this._limit)
                     .addCallback(function (updatedItems) {
                        TreeDataReload.applyUpdatedData({
                           direction: direction,
                           hierarchyRelation: hierarchyRelation,
                           item: item,
                           items: items,
                           nodeProperty: nodeProperty,
                           updatedItems: updatedItems
                        });
                        // todo RecordSet.replace(...) вызывает последовательно remove и add, из-за чего сбивается выбранная запись.
                        // Приходится её восстанавливать. https://online.sbis.ru/opendoc.html?guid=54544dad-51ab-4116-82ba-44510370e599
                        self.setSelectedKey(selectedKey);
                     });
               } else {
                  return Deferred.success();
               }
            } else {
               return parentFn.call(this, id, meta);
            }
         },
         _getItemProjectionByItemId: function(parentFn, id) {
            var root;
            if (isPlainObject(this._options.root)) {
               root = this._getItemsProjection().getRoot();
               if (String(root.getContents().get(this._options.idProperty)) === String(id)) {
                  return root;
               }
            }
            return parentFn.apply(this, [id]);
         },
         _isSlowDrawing: function(parentFnc, easy) {
            if (this._options.hierarchyViewMode) {
               return false;
            }
            else {
               return parentFnc.call(this, easy);
            }
         },
         _canApplyGrouping: function(parentFn, projItem) {
            // Группировка при поиске не поддерживается. https://online.sbis.ru/opendoc.html?guid=aa8e9981-64fc-4bb1-a75c-ef2fa0c73176
            // https://online.sbis.ru/opendoc.html?guid=88a81ef7-9854-472a-9b2a-88a11072b1be
            if (this._isSearchMode()) {
               return false;
            }
            return parentFn.call(this, projItem);
         },
         /* ToDo. Используется для вызова перерисовки родительских элементов при изменении количества дочерних
          Удалить функцию, когда будет сделана нотификация по заданию: https://inside.tensor.ru/opendoc.html?guid=b53fc873-6355-4f06-b387-04df928a7681&description= */
         _findAndRedrawChangedBranches: function(newItems, oldItems) {
            var
               branches = {},
               fillBranchesForRedraw = function (items) {
                  var idx, parent;
                  for (idx = 0; idx < items.length; idx++) {
                     if (!cInstance.instanceOfModule(items[idx], 'WS.Data/Display/GroupItem')) {
                        parent = items[idx].getParent();
                        if (parent && !parent.isRoot()) {
                           if (!branches[parent.getContents().getId()]) {
                              branches[parent.getContents().getId()] = parent;
                           }
                        }
                     }
                  }
               }.bind(this);
            fillBranchesForRedraw(newItems);
            fillBranchesForRedraw(oldItems);
            for (var idx in branches) {
               if (branches.hasOwnProperty(idx)) {
                  if (this._isSlowDrawing(this._options.easyGroup)) {
                     this.redrawItem(branches[idx].getContents(), branches[idx]);
                  }
                  else {
                     this._redrawItem(branches[idx]);
                  }
                  //Пересоздадим футер для изменившихся папок, так как после перемещения/удаления/добавления записей
                  //футер может оказаться не там где он должен находиться.
                  this._createFolderFooter(branches[idx]);
               }
            }
         },
         _onCollectionAddMoveRemove: function(parentFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
            parentFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            // В режиме поиска не требуется реагирование на изменение дочерних элементов
            // https://online.sbis.ru/opendoc.html?guid=a1b14edd-6135-40ed-b937-e11df3e6752f
            // Чтобы сделать по хорошему - необходимо убрать _findAndRedrawChangedBranches и просто отлавливать на
            // событие onCollectionChange, которое теперь должно стрелять в нужное время
            if (!this._isSearchMode || !this._isSearchMode()) {
               this._findAndRedrawChangedBranches(newItems, oldItems);
            }
            this._removeFromLoadedRemoteNodes(oldItems);
            this._updateExpanderDisplay();
            //При перемещении записей в дереве, нет информации из какой папки в какую были перемещены записи.
            //Поэтом мы не можем перерисовать folderFooters непосредственно у изминившихся папок, и для корректоного
            //отображения списка, перерисуем все folderFooters. Наверно уже давно пора вынести понятие folderFooter
            //на уровень проекции, и отризовывать на серверной стороне, вместе со всеми элментами.
            //Выписал задачу: https://online.sbis.ru/opendoc.html?guid=a8b77646-5dcb-4133-8917-f61ce1a6c63e
            if (action === IBindCollection.ACTION_MOVE) {
               this._createAllFolderFooters();
            }
         },
         _onCollectionReset: function(parentFn) {
            parentFn.call(this);
            this._updateExpanderDisplay();
         },
         _onUpdateItemProperty: function (parentFn, item, property) {
            parentFn.call(this, item, property);
            this._updateExpanderDisplay();
         },
         _onCollectionReplace: function(parentFn, newItems) {
            parentFn.call(this, newItems);
            this._updateExpanderDisplay();
         },
         _updateExpanderDisplay: function() {
            if (this._options.expanderDisplayMode === 'withChild') {
               this._container.toggleClass('controls-TreeView__hideExpands',
                  !this._options._hasNodeWithChild(this._options));
            }
         },
         //В режиме поиска в дереве, при выборе всех записей, выбираем только листья, т.к. папки в этом режиме не видны.
         _getAllItemsForSelect: function(parentFn) {
            var
               result,
               keys = [],
               self = this,
               items = this.getItems(),
               nodeProperty = this._options.nodeProperty;
            if (items && this._isSearchMode && this._isSearchMode()) {
               items.each(function(rec){
                  if ((rec.get(nodeProperty) !== true) || (self._options._searchFolders[rec.get(self._options.idProperty)])) {
                     keys.push(rec.getId())
                  }
               });
               result = keys;
            } else {
               result = parentFn.call(this);
            }
            return result;
         }
      },
      _getFilterForReload: function(filter, sorting, offset, limit, deepReload) {
         var
            filter = coreClone(this._options.filter),
            parentProperty;
         if ((this._options.deepReload || deepReload) && !isEmpty(this._options.openedPath)) {
            parentProperty = this._options.parentProperty;
            if (!(filter[parentProperty] instanceof Array)) {
               filter[parentProperty] = [];
            }
            filter[parentProperty].push(this.getCurrentRoot() || null);
            filter[parentProperty] = filter[parentProperty].concat(Object.keys(this._options.openedPath));
         }
         return filter;
      },
      /**
       * Обработка загрузки ветки
       * @param id
       * @private
       */
      _folderLoad: function(id) {
         var
            self = this,
            filter = this._createTreeFilter(id);
         this._toggleIndicator(true);
         if (this._isCursorNavigation()) { //https://online.sbis.ru/opendoc.html?guid=7117f61d-ab58-434b-99b1-fc6528ffe641
            this._notify('onBeforeDataLoad', filter, this.getSorting(), (id ? this._options._folderOffsets[id] : this._options._folderOffsets['null']) + this._limit, this._limit);
         }
         this._loader = this._callQuery(filter, this.getSorting(), (id ? this._options._folderOffsets[id] : this._options._folderOffsets['null']) + this._limit, this._limit, 'after').addCallback(forAliveOnly(function (dataSet) {
            if (this._isCursorNavigation() && this._options.saveReloadPosition) {
               this._hierNodesCursor[id] = dataSet.at(dataSet.getCount() - 1).get(this._options.navigation.config.field);
            }
            //ВНИМАНИЕ! Здесь стрелять onDataLoad нельзя! Либо нужно определить событие, которое будет
            //стрелять только в reload, ибо между полной перезагрузкой и догрузкой данных есть разница!
            self._notify('onDataMerge', dataSet);
            self._onDataMergeCallback(dataSet);
            self._loader = null;
            //нам до отрисовки для пейджинга уже нужно знать, остались еще записи или нет
            if (id) {
               self._options._folderOffsets[id] += self._limit;
            }
            else {
               self._options._folderOffsets['null'] += self._limit;
            }
            self._options._folderHasMore[id] = dataSet.getMetaData().more;
            //Если данные пришли, нарисуем
            if (dataSet.getCount()) {
               if (this._options.loadItemsStrategy == 'merge') {
                  self._options._items.merge(dataSet, {remove: false});
               }
               else {
                  self._options._items.append(dataSet);
               }
               self._updateItemsToolbar();
               self._dataLoadedCallback();
            }
            self._createFolderFooter(id);
            self._toggleIndicator(false);

         }, self)).addErrback(function (error) {
            //Здесь при .cancel приходит ошибка вида DeferredCanceledError
            return error;
         });
      },

      _afterAddItems: function() {
         // В виду проблем, возникающих в режиме поиска при разрыве путей до искомых записей - помочь в настоящий момент может только redraw
         if (this._options.hasNodes && this._isSearchMode()) {
            this.redraw();
         }
      },

      _getReloadOffset: function(){
         var offset;
         if (this._hierPages[this.getCurrentRoot()] !== undefined) {
            offset = this._hierPages[this.getCurrentRoot()] * this._limit;
         } else {
            offset = 0;
         }
         return offset;
      },

      _getRootCount: function(){
         return this._getItemsProjection().getChildren(this._getItemsProjection().getRoot()).getCount();
      },

      before: {
         _modifyOptions: function(cfg) {
            if (cfg._curRoot !== null && cfg.currentRoot === null) {
               cfg.currentRoot = cfg._curRoot;
            }
            if (cfg.currentRoot === null) {
               this._previousRoot = cfg.currentRoot = cfg.root;
            } else {
               this._previousRoot = cfg.root;
            }
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('TreeMixin', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            if (cfg.parentProperty && !cfg.nodeProperty) {
               cfg.nodeProperty = cfg.parentProperty + '@';
            }
            if (cfg.parentProperty && !cfg.hasChildrenProperty) {
               // todo временное решение, т.к. с бизнес-логики прилетает инвертированное значение признака загруженности ветки
               cfg.hasChildrenProperty = cfg.parentProperty + '$';
            }
         },
         _addItems: function() {
            // При добавлении новых элементов восстанавливаем раскрытые узлы, т.к. записи, необходимые для восстановления
            // состояния дерева могут придти и на второй странице
            // https://inside.tensor.ru/opendoc.html?guid=4f8e94ac-6303-4878-b608-8d17a54d8bd5&des=
            applyExpandToItemsProjection(this._getItemsProjection(), this._options);
         },
         _stateResetHandler: function () {
            this._options._folderOffsets['null'] = 0;
            this._lastParent = undefined;
            this._lastDrawn = undefined;
            this._lastPath = [];
            this._loadedNodes = {};
            this._hierNodesCursor = {};
            // При перезагрузке приходят новые данные, т.ч. сбрасываем объект, хранящий список узлов с "есть ещё"
            this._options._folderHasMore = {};
         },
         reload: function() {
            this._stateResetHandler();
         },
         setItems: function() {
            this._stateResetHandler();
         },
         redraw: function() {
            this._updateExpanderDisplay();
         },
         _applyExpandToItems: function(items) {
            var hierarchy = this._options._getHierarchyRelation(this._options),
               openedPath = this._options.openedPath;
            items.each(function(item) {
               var id = item.getId(),
                  children = hierarchy.getChildren(item, items);
               if (children.length && id != 'null' && id != this._curRoot) {
                  openedPath[id] = true;
               }
            });
         },
         _onDataMergeCallback: function(items) {
            if (this._options.expand) {
               this._applyExpandToItems(items);
            }
         },
         _dataLoadedCallback: function () {
            var path = this._options._items.getMetaData().path,
                hierarchy = coreClone(this._hier),
                self = this,
                previousRoot = this._previousRoot,
                curRoot = this.getCurrentRoot(),
                item;
            if (typeof curRoot === 'undefined') {
               curRoot = null;
            }
            if (this._options.expand) {
               this._applyExpandToItems(this.getItems());
            }
            if (path) {
               hierarchy = this.getHierarchy(path, this._options.currentRoot);
            }
            if (this._previousRoot !== this._options.currentRoot) {
               this._notify('onSetRoot', this._options.currentRoot, hierarchy, this._options.root);
               //TODO Совсем быстрое и временное решение. Нужно скроллиться к первому элементу при проваливании в папку.
               // Выпилить, когда это будет делать установка выделенного элемента
               //TODO курсор
               /*Если в текущем списке есть предыдущий путь, значит это выход из папки*/
               if (this.getItems().getRecordById(this._previousRoot)) {
                  this.setSelectedKey(this._previousRoot);
                  //todo Это единственный на текущий момент способ проверить, что наш контейнер уже в контейнере ListView и тогда осуществлять scrollTo не нужно!
                  // В режиме поиска скролить к предыдущей записи не нужно: https://online.sbis.ru/opendoc.html?guid=3f384ac7-a935-4af4-aa56-91b2e44f4d7e
                  if (!self._isSearchMode() && !this._container.parents('.controls-ListView').length) {
                     /* requestAnimationFrame в ie не пакетирует скролы, только перерисовки,
                        поэтому при использовании requestAnimationFrame будет дергаться страница. */
                     if (constants.browser.isIE) {
                        self._scrollToItem(previousRoot);
                     } else {
                        runDelayed(function () {
                           self._scrollToItem(previousRoot);
                        });
                     }
                  }
               } else {
                  /*иначе вход в папку*/
                  // Если используется курсор и сохранение позиции при перезагрузке, то находим запись, сохраненную ранее и скролим до неё
                  // https://online.sbis.ru/opendoc.html?guid=178ddc57-9e78-4136-8257-44ebb28a2d44
                  if (this._isCursorNavigation() && this._options.saveReloadPosition && typeof this._hierPages[curRoot] !== 'undefined') {
                     item = this.getItems().at(this.getItems().getIndexByValue(this._options.navigation.config.field, this._hierPages[curRoot]));
                  } else {
                     for (var i = 0; i < this._getItemsProjection().getCount(); i++) {
                        item = this._getItemsProjection() && this._getItemsProjection().at(i);
                        if (item && !cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
                           item = item.getContents();
                           break;
                        }
                     }
                  }
                  if (item) {
                     this.setSelectedKey(item.getId());
                     if (!this._container.parents('.controls-ListView').length) {
                        //todo Это единственный на текущий момент способ проверить, что наш контейнер уже в контейнере ListView и тогда осуществлять scrollTo не нужно!
                        this._scrollToItem(item.getId());
                     }
                  }
               }

               this._previousRoot = this._options.currentRoot;

            }
            this._updateExpanderDisplay();
         }
      },
      /**
       * Метод разврачивает узлы дерева до нужной записи
       * @param {String} key ключ записи
       */
      expandToItem: function(key){
         var items = this.getItems(),
            projection = this._options._itemsProjection,
            recordKey = key,
            nodes = [],
            hasItemInProjection,
            record;

         while(!hasItemInProjection && recordKey){
            record = items.getRecordById(recordKey);
            hasItemInProjection = projection.getItemBySourceItem(record);
            //если hasItemInProjection = true - это значит что мы нашли запись, которая находится в раскрытом узле
            if (!hasItemInProjection){
               if (record){
                  recordKey = record.get(this._options.parentProperty);
                  nodes.push(recordKey);
               }
               else{
                  recordKey = undefined;
               }
            }
         }

         for (var i = nodes.length - 1, l = 0; i >= l; i--){
            this.expandNode(nodes[i]);
         }
      },
      /**
       * Устанавливает узел, относительно которого будет производиться выборка данных.
       * @param {String|Number} root Идентификатор корня.
       * @see root
       * @see getRoot
       */
      setRoot: function(root) {
         this._options.root = root;
         // при изменении корня, сбросим предыдущий, так как он теряет актуальность
         this._previousRoot = undefined;
      },


      /**
       * Возвращает узел, относительно которого будет производиться выборка данных списочным методом.
       * @return {String|Number} Идентификатор корня.
       * @see root
       * @see setRoot
       */
      getRoot: function(){
         return this._options.root;
      },
      /**
       * Возвращает идентификатор узла, в который было установлено проваливание.
       * @returns {String|Number}
       * @see setCurrentRoot
       * @see root
       */
      getCurrentRoot : function(){
         return this._options.currentRoot;
      },
      /**
       * Устанавливает проваливание в узел и вызывает отрисовку хлебных крошек (если они есть), относительно вершины иерархии (см. {@link root}).
       * @remark
       * После применения метода нужно вызвать {@link reload} для перерисовки отображения списка.
       * @param {String|Number} key Идентификатор узла, в который будет установлено проваливание.
       * @see getCurrentRoot
       * @see root
       */
      setCurrentRoot: function(key) {
         var
            newRoot,
            curRoot,
            filter = this.getFilter() || {},
            isFakeRoot = isPlainObject(this._options.root) && this._options.root[this._options.idProperty] === key;
         // Internet Explorer при удалении элемента сбрасывает фокус не выше по иерархии, а просто "в никуда" (document.activeElement === null).
         // Для того, чтобы фокус при проваливании в папку не терялся - перед проваливанием устанавливаем его просто
         // на контейнер на котором устанавливается фокус по умолчанию, но только в том случае,
         // если ранее фокус реально был на элементе таблицы.
         // https://inside.tensor.ru/opendoc.html?guid=7b093780-dc30-4f90-b443-0d6f96992490&des=
         // https://online.sbis.ru/opendoc.html?guid=2e08f9cc-d86b-411d-8eb4-344e5e0c00ec&des=
         if (constants.browser.isIE && $.contains(this._container[0], document.activeElement)) {
            this._getElementToFocus();
         }
         // todo Удалить при отказе от режима "hover" у редактирования по месту [Image_2016-06-23_17-54-50_0108] https://inside.tensor.ru/opendoc.html?guid=5bcdb10f-9d69-49a0-9807-75925b726072&description=
         this._destroyEditInPlaceController();
         if (isFakeRoot || (key !== undefined && key !== null)) {
            filter[this._options.parentProperty] = key;
         } else if (this._options.root) {
            filter[this._options.parentProperty] = this._options.root;
         } else {
            delete(filter[this._options.parentProperty]);
         }
         this.setFilter(filter, true);
         /* При смене узла, данные надо грузить с 0-ой страницы,
            при этом скролить к 0 странице не надо, т.к. после перерисовки мы и так окажемся вверху списка. */
         this.setPage(0, true, true);
         //Если добавить проверку на rootChanged, то при переносе в ту же папку, из которой искали ничего не произойдет
         this._notify('onBeforeSetRoot', key);

         // сохраняем текущую страницу при проваливании в папку
         if (this._isCursorNavigation() && this._options.saveReloadPosition) {
            this.getListNavigation().setPosition(null);
            if (this.getSelectedItem()) {
               // Сохраняем ключ узла, в который провалились
               curRoot = this.getCurrentRoot();
               if (typeof this.getCurrentRoot() === 'undefined') {
                  curRoot = null;
               }
               var
                  newRootParent = this.getSelectedItem().get(this._options.parentProperty);
               if (newRootParent === curRoot) {
                  this._hierPages[curRoot] = this.getSelectedItem().get(this._options.navigation.config.field);
               } else {
                  // Мы можем перейти в узел раскрыв дерево, а значит нужно сохранить курсор для родителя узла в который мы провалились
                  // https://online.sbis.ru/opendoc.html?guid=8e6b6c2b-9dc4-44ef-8cad-8662f2ec65d8
                  this._hierPages[newRootParent] = this.getSelectedItem().get(this._options.navigation.config.field);
                  // Пробегаем также по родителям узла, в который проваливаемся вплоть до currentRoot и таким образом запоминаем исчерпывающий путь
                  // https://online.sbis.ru/opendoc.html?guid=fdfc17bd-043d-45d8-8c77-29ab5547205a
                  var
                     nextParent = this.getItems().getRecordById(newRootParent).get(this._options.parentProperty),
                     root = this.getRoot();
                  if (typeof root === 'undefined') {
                     root = null;
                  }
                  while (nextParent !== curRoot && nextParent !== root) {
                     this._hierPages[nextParent] = this.getItems().getRecordById(newRootParent).get(this._options.navigation.config.field);
                     newRootParent = nextParent;
                     nextParent = this.getItems().getRecordById(newRootParent).get(this._options.parentProperty);
                  }
                  this._hierPages[nextParent] = this.getItems().getRecordById(newRootParent).get(this._options.navigation.config.field);
               }
            }
         }

         this._options.currentRoot = (isFakeRoot || (key !== undefined && key !== null)) ? key : this._options.root;

         if (isFakeRoot) {
            newRoot = Model.fromObject(this._options.root, this.getItems() ? this.getItems().getAdapter() : 'adapter.sbis');
            newRoot.setIdProperty(this._options.idProperty);
         } else {
            newRoot = this._options.currentRoot !== undefined ? this._options.currentRoot : null
         }
         
         if (this._options._itemsProjection) {
            this._options._itemsProjection.setEventRaising(false);
            this._options._itemsProjection.setRootEnumerable(isFakeRoot);
            this._options._itemsProjection.setRoot(newRoot);
            this._options._itemsProjection.setEventRaising(true);
         }
         this._hier = this.getHierarchy(this.getItems(), key);
      },
      getHierarchy: function(items, key) {
         var record, parentKey,
            hierarchy = [],
            processedKeys = [];
         if (items && items.getCount()) {
            // пока не дойдем до корня (корень может быть undefined), с проверкой на зацикливание
            while ((key !== null && key !== undefined) && String(key) !== String(this.getRoot()) && processedKeys.indexOf(key) === -1) {
               processedKeys.push(key);
               record = items.getRecordById(key);
               parentKey = record ? record.get(this._options.parentProperty) : null;
               if (record) {
                  hierarchy.push({
                     // key может быть 0, но по другому проверять крайне страшно
                     // https://online.sbis.ru/opendoc.html?guid=d98cc32e-540e-4ba6-8f90-6deb992cbd0e
                     'id': (key || key === 0) ? key : null,
                     'parent' : parentKey,
                     'title' : record.get(this._options.displayProperty),
                     'color' : this._options.colorField ? record.get(this._options.colorField) : '',
                     'data' : record
                  });
               }
               key = parentKey;
            }
         }
         return hierarchy;
      },
      /**
       * Устанавливает режим отображения содержимого записей типа "Узел" (папка) при первой загрузке контрола.
       * @remark
       * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
       * @param {Boolean} expand true - содержимое узлов раскрыто, false - содержимое узлов скрыто.
       * @see expand
       * @see getExpand
       */
      setExpand: function(expand) {
         this._options.expand = !!expand;
      },
      /**
       * Возвращает признак установленного режима отображения содержимого записей типа "Узел" (папка) при первой загрузке контрола.
       * @remark
       * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
       * @returns {Boolean} true - содержимое узлов раскрыто, false - содержимое узлов скрыто.
       * @see expand
       * @see setExpand
       */
      getExpand: function() {
         return this._options.expand;
      },
      getParentKey: function (DataSet, item) {
         var itemProjection = this._options._itemsProjection.getItemBySourceItem(item);
         if( itemProjection !== undefined ) {
            var itemParent = itemProjection.getParent().getContents();
            return cInstance.instanceOfModule(itemParent, 'WS.Data/Entity/Record') ? itemParent.getId() : itemParent;
         }
         return undefined;
      },

      _dropPageSave: function(){
         var root = this._options.root;
         this._pageSaver = {};
         this._pageSaver[root] = 0;
      },

      _onDragCallback: function(dragObject) {
         var target = dragObject.getTarget();
         if (target && cInstance.instanceOfModule(target, 'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row')) {
            var model = target.getModel(),
               itemsProjection = this._getItemsProjection(),
               projectionItem = itemsProjection.getItemBySourceItem(model);
            if (projectionItem && projectionItem.isNode() && !projectionItem.isExpanded()) {//раскрываем папку если зависли над ней на 1 секунду
               window.setTimeout(function () {
                  if (dragObject.isDragging() && target == dragObject.getTarget()) {
                     var projectionItem = itemsProjection.getItemBySourceItem(model);//еще раз проверим есть ли эелемент в проекции
                     if (projectionItem && !projectionItem.isExpanded()) {
                        this.expandNode(model.getId());
                     }
                  }
               }.bind(this), 1000);
            }
         }
      }
   };
   return TreeMixin;
});