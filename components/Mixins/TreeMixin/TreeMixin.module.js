define('js!SBIS3.CONTROLS.TreeMixin', [
   "Core/core-functions",
   "Core/core-merge",
   "Core/constants",
   "Core/CommandDispatcher",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.BreadCrumbs",
   "html!SBIS3.CONTROLS.DataGridView/resources/DataGridViewGroupBy",
   "js!WS.Data/Display/Tree",
   "tmpl!SBIS3.CONTROLS.TreeMixin/resources/searchRender",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Relation/Hierarchy",
   "Core/helpers/collection-helpers",
   "Core/core-instance",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "Core/helpers/functional-helpers",
   "Core/IoC",
   "js!WS.Data/Adapter/Sbis"
], function ( cFunctions, cMerge, constants, CommandDispatcher, Deferred,BreadCrumbs, groupByTpl, TreeProjection, searchRender, Model, HierarchyRelation, colHelpers, cInstance, TemplateUtil, fHelpers, IoC) {

   var createDefaultProjection = function(items, cfg) {
      var
         root, projection, rootAsNode;
      if (typeof cfg._curRoot != 'undefined') {
         root = cfg._curRoot;
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

      var
         filterCallBack = cfg.displayType == 'folders' ? projectionFilterOnlyFolders.bind(this) : projectionFilter.bind(this),
         projOptions = {
            collection: items,
            idProperty: cfg.idProperty || (cfg.dataSource ? cfg.dataSource.getIdProperty() : ''),
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty,
            loadedProperty: cfg.parentProperty + '$',
            unique: true,
            root: root,
            rootEnumerable: rootAsNode,
            filter: filterCallBack,
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
         allowEnterToFolder: cfg.allowEnterToFolder
      }
   },
   searchProcessing = function(src, cfg) {
      var resRecords = [], lastNode, lastPushedNode, curPath = [], pathElem, curParentContents;

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
               path: cFunctions.clone(path),
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
            colHelpers.forEach(src, func);
         };
      }
      else {
         iterator = src.each.bind(src);
      }


      iterator(function (item) {
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

         if (item.isNode()) {
            curParentContents = item.getContents();
            pathElem = {};
            pathElem[cfg.idProperty] = curParentContents.getId();
            pathElem[cfg.displayProperty] = curParentContents.get(cfg.displayProperty);
            pathElem['projItem'] = item;
            pathElem['item'] = curParentContents;
            curPath.push(pathElem);
            lastNode = item;
         }
         else {
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
   getRecordsForRedraw = function(projection, cfg) {
      var
         records = [],
         projectionFilter,
         prevGroupId = undefined,
         analyzeChanges;

      projectionFilter = resetFilterAndStopEventRaising(projection, false);
      if (cfg.expand || cfg.hierarchyViewMode) {
         analyzeChanges = true;
         expandAllItems(projection, cfg);
      } else {
         /**
          * todo Переписать, когда будет выполнена указанная ниже задача
          * Задача в разработку от 28.04.2016 №1172779597
          * В деревянной проекции необходима возможность определять, какие элементы создаются развернутыми. Т...
          * https://inside.tensor.ru/opendoc.html?guid=6f1758f0-f45d-496b-a8fe-fde7390c92c7
          * @private
          */
         analyzeChanges = false;
         applyExpandToItemsProjection(projection, cfg);
      }
      restoreFilterAndRunEventRaising(projection, projectionFilter, analyzeChanges);

      cfg._searchFolders = {};
      cfg.hasNodes = false;
      if (cfg.hierarchyViewMode) {
         records = searchProcessing(projection, cfg);
      }
      else {
         projection.each(function(item, index, group) {
            if (item.isNode()){
               cfg.hasNodes = true;
            }
            if (!Object.isEmpty(cfg.groupBy) && cfg.easyGroup && cfg._canApplyGrouping(item, cfg)) {
               if (prevGroupId != group) {
                  cfg._groupItemProcessing(group, records, item, cfg);
                  prevGroupId = group;
               }
            }
            records.push(item);
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
   projectionFilter = function(item, index, itemProj) {
      // Добавил проверку на скрытый узел. Мы ожидаем, что скрытый узел при поиске не должен быть раскрытым (а его связанные записи - не должны сразу отрисовываться).
      var
          itemParent = itemProj.getParent(),
          itemParentContent = itemParent && itemParent.getContents();
      return (cInstance.instanceOfModule(itemParentContent, 'WS.Data/Entity/Record') && itemParentContent.get(this.nodeProperty) !== false && this._isSearchMode && this._isSearchMode()) || isVisibleItem(itemProj);
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
            if (item && !item.isExpanded()) {
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
         }
      }
   },
   expandAllItems = function(projection) {
      var
         recordSet = projection.getCollection(),
         projItems = projection.getItems(),
         hierarchy = new HierarchyRelation({
            idProperty: recordSet.getIdProperty(),
            parentProperty: projection.getParentProperty()
         }),
         item;
      for (var i = 0; i < projItems.length; i++) {
         item = projItems[i];
         if (item.isNode() && !item.isExpanded()) {
            if (hierarchy.getChildren(item.getContents().getId(), recordSet).length) {
               item.setExpanded(true);
               item.setLoaded(true);
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
      tplOptions.paddingSize = !isNaN(cfg.paddingSize) && typeof cfg.paddingSize === 'number' ? cfg.paddingSize : cfg._paddingSize;
      tplOptions.originallPadding = cfg.multiselect ? 0 : cfg._originallPadding;
      tplOptions.isSearch = cfg.hierarchyViewMode;
      tplOptions.hasNodes = cfg.hasNodes;
      tplOptions.hierarchy = new HierarchyRelation({
         idProperty: cfg.idProperty,
         parentProperty: cfg.parentProperty
      });

      return tplOptions;
   };
   /**
    * Миксин позволяет контролу отображать данные, которые имеют иерархическую структуру, и работать с ними.
    * На DOM-элементы, отображающие развернутые узлы вешается css-класс "controls-TreeView__item-expanded". Для свернутых узлов используется css-класс "controls-TreeView__item-collapsed".
    * @mixin SBIS3.CONTROLS.TreeMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var TreeMixin = /** @lends SBIS3.CONTROLS.TreeMixin.prototype */{

      /**
       * @name SBIS3.CONTROLS.TreeMixin#reload
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
       * При каждой загрузке данных, например вызванной методом {@link SBIS3.CONTROLS.ListView#reload}, происходит событие onSetRoot.
       * В этом есть необходимость, потому что в переданных данных может быть установлен новый path - путь для хлебных крошек (см. {@link WS.Data/Collection/RecordSet#meta}).
       * Хлебные крошки не перерисовываются, так как корень не поменялся.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} curRoot Идентификатор узла, который установлен в качестве текущего корня иерархии.
       * @param {Array.<Object>} hierarchy Массив объектов, каждый из которых описывает узлы иерархии установленного пути.
       * Каждый объект содержит следующие свойства:
       * <ul>
       *    <li>id - идентификатор текущего узла иерархии;</li>
       *    <li>parent - идентификатор предыдущего узла иерархии;</li>
       *    <li>title - значение поля отображения (см. {@link SBIS3.CONTROLS.DSMixin#displayProperty});</li>
       *    <li>color - значение поля записи, хранящее данные об отметке цветом (см. {@link SBIS3.CONTROLS.DecorableMixin#colorField});</li>
       *    <li>data - запись узла иерархии, экземпляр класса {@link WS.Data/Entity/Record}.</li>
       * </ul>
       * @see onBeforeSetRoot
       */
      /**
       * @event onBeforeSetRoot Происходит при установке текущего корня иерархии.
       * @remark
       * Событие может быть инициировано при использовании метода {@link setCurrentRoot}.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} key Идентификатор узла иерархии, который будет установлен. Null - это вершина иерархии.
       * @see onSetRoot
       */
      /**
       * @event onSearchPathClick Происходит при клике по хлебным крошкам, отображающим результаты поиска.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
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
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number} key Идентификатор узла.
       * @param {jQuery} object Контейнер узла.
       * @see onNodeCollapse
       */
      /**
       * @event onNodeCollapse Происходит после сворачивания узла.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number} key Идентификатор узла.
       * @param {jQuery} object Контейнер узла.
       * @see onNodeExpand
       */
      $protected: {
         _folderOffsets : {},
         _folderHasMore : {},
         _treePagers : {},
         _treePager: null,
         _options: {
            _buildTplArgs: buildTplArgsTV,
            _buildTplArgsTV: buildTplArgsTV,
            _defaultSearchRender: searchRender,
            _getSearchCfgTv: getSearchCfg,
            _getSearchCfg: getSearchCfg,
            _searchFolders: {},
            _paddingSize: 16,
            _originallPadding: 6,
            _getRecordsForRedraw: getRecordsForRedraw,
            _getRecordsForRedrawTree: getRecordsForRedraw,
            _curRoot: null,
            _createDefaultProjection : createDefaultProjection,
            /**
             * @cfg {Number} Задает размер отступов для каждого уровня иерархии
             * @example
             * <pre>
             *    <option name="paddingSize">24</option>
             * </pre>
             */
            paddingSize: undefined,
            /**
             * @cfg {String, Number} Устанавливает идентификатор узла, относительно которого нужно отображать данные. Такой узел будет считаться вершиной иерархии.
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
             * По полю иерархии устанавливаются два других служебных поля - "Раздел@" и "Раздел$" , подробнее о назначении которых вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/hierarchy/#_2">Требования к источнику данных</a>.
             * @example
             * <pre>
             *    <option name="hierField">Раздел</option>
             * </pre>
             * @see getHierarchy
             * @see setHierarchy
             * @deprecated
             */
            hierField: null,
            /**
             * @cfg {String} Устанавливает поле иерархии, по которому будут установлены иерархические связи записей списка.
             * @remark
             * Поле иерархии хранит первичный ключ той записи, которая является узлом для текущей. Значение null - запись расположена в корне иерархии.
             * Например, поле иерархии "Раздел". Название поля "Раздел" необязательное, и в каждом случае может быть разным.
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел</option>
             * </pre>
             */
            parentProperty: null,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             *
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел@</option>
             * </pre>
             */
            nodeProperty: null,
            /**
             * @cfg {String} Устанавливает режим отображения записей: отображать только записи типа "Узел" (папка) или любые типы записей.
             * @remark
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * В режиме развернутого списка будут отображены узлы группировки данных (папки) и данные, сгруппированные по этим узлам.
             * В режиме свернутого списка будет отображен только список узлов (папок).
             * @variant folders Отображать только записи типа "Узел".
             * @variant all Отображать записи всех типов иерархии.
             *
             * Подробное описание иерархической структуры приведено в документе {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy "Типы отношений в таблицах БД"}
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
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <option name="singleExpand">true</option>
             * </pre>
             */
            singleExpand: false,
            /**
             * @cfg {Boolean} Устанавливает режим отображения содержимого записей типа "Узел" (папка) при первой загрузке контрола.
             * @remark
             * true - содержимое узлов раскрыто, false - содержимое узлов скрыто.
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <option name="expand">true</option>
             * </pre>
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
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
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
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
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
             * @cfg {Boolean} Устанавливает признак, при котором клик по записи типа "Узел" (папка) или "Скрытый узел" не производит проваливание внутрь иерархии, а раскрывает её содержимое.
             * @remark
             * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
             * @example
             * <pre>
             *    <option name="allowEnterToFolder">false</option>
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
             * @see SBIS3.CONTROLS.ItemsControlMixin#itemsSortMethod
             * @see SBIS3.CONTROLS.ItemsControlMixin#setItemsSortMethod
             */
            itemsSortMethod: _defaultItemsSortMethod,
             /**
              * @cfg {Boolean}
              */
            hierarchyViewMode: false,
            hierarchyViewModeItemTpl: '',
            hierarchyViewModeItemContentTpl: '',
            /**
             * @cfg {String} Устанавливает стратегию действий с подгружаемыми в дерево записями
             * @variant merge - мержить, при этом записи с одинаковыми id схлопнутся в одну
             * @variant append - добавлять, при этом записи с одинаковыми id будут выводиться в списке
             *
             */
            loadItemsStrategy: 'merge'
         },
         _foldersFooters: {},
         _lastParent : undefined,
         _lastDrawn : undefined,
         _lastPath : [],
         _loadedNodes: {},
         _previousRoot: null,
         _hier: [],
         _hierPages: {}
      },

      $constructor : function(cfg) {
         var
            filter = this.getFilter() || {};
         cfg = cfg || {};
         this._publish('onSearchPathClick', 'onNodeExpand', 'onNodeCollapse', 'onSetRoot', 'onBeforeSetRoot');
         this._options._curRoot = this._options.root;
         if (typeof this._options.root != 'undefined') {
            filter[this._options.parentProperty] = this._options.root;
         }
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'С узлами и листьями';
         }
         this._previousRoot = this._options._curRoot;
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
      collapseNode: function(id) {
         var
            item = this._getItemProjectionByItemId(id);
         if (item) {
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
      toggleNode: function(id) {
         var
            item = this._getItemProjectionByItemId(id);
         if (item) {
            return this[item.isExpanded() ? 'collapseNode' : 'expandNode'](id);
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
      expandNode: function(id) {
         var
            item = this._getItemProjectionByItemId(id);
         if (item) {
            if (item.isExpanded()) {
               return Deferred.success();
            } else {
               if (this._options.singleExpand) {
                  this._collapseNodes(this.getOpenedPath(), id);
               }
               this._options.openedPath[id] = true;
               this._folderOffsets[id] = 0;
               return this._loadNode(id).addCallback(fHelpers.forAliveOnly(function() {
                  this._getItemProjectionByItemId(id).setExpanded(true);
               }).bind(this));
            }
         } else {
            return Deferred.fail();
         }
      },
      _loadNode: function(id) {
         if (this._dataSource && !this._loadedNodes[id] && this._options.partialyReload) {
            this._toggleIndicator(true);
            this._notify('onBeforeDataLoad', this._createTreeFilter(id), this.getSorting(), 0, this._limit);
            return this._callQuery(this._createTreeFilter(id), this.getSorting(), 0, this._limit).addCallback(fHelpers.forAliveOnly(function (list) {
               this._folderHasMore[id] = list.getMetaData().more;
               this._loadedNodes[id] = true;
               this._notify('onDataMerge', list); // Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad, так как на него много всего завязано. (пользуется Янис)
               if (this._options.loadItemsStrategy == 'merge') {
                  this._options._items.merge(list, {remove: false});
               }
               else {
                  this._options._items.append(list);
               }
               this._getItemProjectionByItemId(id).setLoaded(true);
            }).bind(this))
            .addBoth(function(error){
               this._toggleIndicator(false);
            }.bind(this));
         } else {
            return Deferred.success();
         }
      },
      /**
       * Получить список записей для отрисовки
       * @private
       */
      _breadCrumbsItemClick : function(id) {
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
            this._options.hierarchyViewMode = false;
            this.setCurrentRoot(id);
            this.reload();
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

      _getItemsForRedrawOnAdd: function(items, groupId) {
         var result = [];
         if (this._options.hierarchyViewMode) {
            result = searchProcessing(items, this._options);
         }
         else {
            var prevGroupId = undefined;  //тут groupId одинаковый для пачки данных, но группу надо вставить один раз, используем пермеенную как флаг
            for (var i = 0; i < items.length; i++) {
               if (!Object.isEmpty(this._options.groupBy) && this._options.easyGroup) {
                  if (this._canApplyGrouping(items[i]) && prevGroupId != groupId) {
                     prevGroupId = groupId;
                     if (this._getGroupItems(groupId).length <= items.length) {
                        this._options._groupItemProcessing(groupId, result, items[i], this._options);
                     }
                  }
               }
               if (this._isVisibleItem(items[i])) {
                  result.push(items[i]);
               }
            }
         }
         return result;
      },
      /**
       * Создаёт фильтр для дерева (берет текущий фильтр и дополняет его)
       * @param key
       * @returns {Object|{}}
       * @private
       */
      _createTreeFilter: function(key) {
         var
            filter = cFunctions.clone(this.getFilter()) || {};
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         this.setFilter(cFunctions.clone(filter), true);
         filter[this._options.parentProperty] = key;
         return filter;
      },
      /**
       * Закрыть ветки, кроме переданной в параметре ignoreKey
       * @param key
       * @private
       */
      _collapseNodes: function(openedPath, ignoreKey) {
         colHelpers.forEach(openedPath, function(value, key) {
            if (!ignoreKey || key != ignoreKey) {
               this.collapseNode(key);
            }
         }, this);
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
            this._collapseNodes(this.getOpenedPath());
            this._options.openedPath = openedPath;
            applyExpandToItemsProjection(itemsProjection, this._options);
            restoreFilterAndRunEventRaising(itemsProjection, projectionFilter, true);
         } else {
            this._options.openedPath = openedPath;
         }
      },
      _removeFromLoadedRemoteNodes: function(remoteNodes) {
         // Удаляем только если запись удалена из items, иначе - это было лишь сворачивание веток.
         if (remoteNodes.length && !this.getItems().getRecordById(remoteNodes[0].getContents().getId())) {
            for (var idx = 0; idx < remoteNodes.length; idx++) {
               delete this._loadedNodes[remoteNodes[idx].getContents().getId()];
            }
         }
      },
      around: {
         _getItemProjectionByItemId: function(parentFn, id) {
            var root;
            if (isPlainObject(this._options.root)) {
               root = this._getItemsProjection().getRoot();
               if (String(root.getContents().getId()) === String(id)) {
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
            if (this._isSearchMode()) {
               return true;
            }
            var
               itemParent = projItem.getParent();
            return parentFn.call(this, projItem) && itemParent && itemParent.isRoot();
         },
         /* ToDo. Используется для вызова перерисовки родительских элементов при изменении количества дочерних
          Удалить функцию, когда будет сделана нотификация по заданию: https://inside.tensor.ru/opendoc.html?guid=b53fc873-6355-4f06-b387-04df928a7681&description= */
         _findAndRedrawChangedBranches: function(newItems, oldItems) {
            var
               branches = {},
               fillBranchesForRedraw = function (items) {
                  var idx, parent;
                  for (idx = 0; idx < items.length; idx++) {
                     parent = items[idx].getParent();
                     if (!parent.isRoot()) {
                        if (!branches[parent.getContents().getId()]) {
                           branches[parent.getContents().getId()] = parent;
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
               }
            }
         },
         _onCollectionAddMoveRemove: function(parentFn, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId) {
            parentFn.call(this, event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, groupId);
            this._findAndRedrawChangedBranches(newItems, oldItems);
            this._removeFromLoadedRemoteNodes(oldItems);
         },
         //В режиме поиска в дереве, при выборе всех записей, выбираем только листья, т.к. папки в этом режиме не видны.
         setSelectedItemsAll: function(parentFn) {
            var
               self = this,
               keys = [],
               items = this.getItems(),
               nodeProperty = this._options.nodeProperty;
            if (items && this._isSearchMode && this._isSearchMode()) {
               items.each(function(rec){
                  if ((rec.get(nodeProperty) !== true) || (self._options._searchFolders[rec.get(self._options.idProperty)])) {
                     keys.push(rec.getId())
                  }
               });
               this.setSelectedKeys(keys);
            } else {
               parentFn.call(this);
            }
         }
      },
      _getFilterForReload: function(filter, sorting, offset, limit, deepReload) {
         var
            filter = cFunctions.clone(this._options.filter),
            parentProperty;
         if ((this._options.deepReload || deepReload) && !Object.isEmpty(this._options.openedPath)) {
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
            filter;
         this._toggleIndicator(true);
         this._notify('onBeforeDataLoad', this._createTreeFilter(id), this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit);
         this._loader = this._callQuery(this._createTreeFilter(id), this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit).addCallback(fHelpers.forAliveOnly(function (dataSet) {
            //ВНИМАНИЕ! Здесь стрелять onDataLoad нельзя! Либо нужно определить событие, которое будет
            //стрелять только в reload, ибо между полной перезагрузкой и догрузкой данных есть разница!
            self._notify('onDataMerge', dataSet);
            self._loader = null;
            //нам до отрисовки для пейджинга уже нужно знать, остались еще записи или нет
            if (id) {
               self._folderOffsets[id] += self._limit;
            }
            else {
               self._folderOffsets['null'] += self._limit;
            }
            self._folderHasMore[id] = dataSet.getMetaData().more;
            if (!self._hasNextPageInFolder(dataSet.getMetaData().more, id)) {
               if (typeof id != 'undefined') {
                  self._treePagers[id].setHasMore(false)
               }
               else {
                  self._treePager.setHasMore(false)
               }
            }
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
               self._createFolderFooter(id);
            }
            self._toggleIndicator(false);

         }, self)).addErrback(function (error) {
            //Здесь при .cancel приходит ошибка вида DeferredCanceledError
            return error;
         });
      },

      _getHierarchyRelation: function(idProperty) {
         var items = this.getItems();
         return new HierarchyRelation({
            idProperty: idProperty || (items ? items.getIdProperty() : ''),
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty
         });
      },

      _getAdditionalOffset: function(items){
         var currentRootItems = 0;
         for (i = 0; i < items.length; i++){
            if (items[i].getContents().get(this._options.parentProperty) == this.getCurrentRoot()){
               currentRootItems++;
            }
         }
         return currentRootItems;
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

      before: {
         _modifyOptions: function(cfg) {
            if (cfg.hierField) {
               IoC.resolve('ILogger').log('TreeMixin', 'Опция hierField является устаревшей, используйте parentProperty');
               cfg.parentProperty = cfg.hierField;
            }
            if (cfg.parentProperty && !cfg.nodeProperty) {
               cfg.nodeProperty = cfg.parentProperty + '@';
            }
         },
         _addItems: function() {
            // При добавлении новых элементов восстанавливаем раскрытые узлы, т.к. записи, необходимые для восстановления
            // состояния дерева могут придти и на второй странице
            // https://inside.tensor.ru/opendoc.html?guid=4f8e94ac-6303-4878-b608-8d17a54d8bd5&des=
            applyExpandToItemsProjection(this._getItemsProjection(), this._options);
         },
         reload: function() {
            // сохраняем текущую страницу при проваливании в папку
            if (this._options.saveReloadPosition && this._previousRoot !== this._options._curRoot) {  
               this._hierPages[this._previousRoot] = this._getCurrentPage();
            }
            this._folderOffsets['null'] = 0;
            this._lastParent = undefined;
            this._lastDrawn = undefined;
            this._lastPath = [];
            this._loadedNodes = {};
         },
         _dataLoadedCallback: function () {
            //this._options.openedPath = {};
            if (this._options.expand) {
               var hierarchy = this._getHierarchyRelation(),
                  items = this.getItems(),
                  openedPath = this._options.openedPath;
               items.each(function(item) {
                  var id = item.getId(),
                     children = hierarchy.getChildren(item, items);
                  if (children.length && id != 'null' && id != this._curRoot) {
                     openedPath[id] = true;
                  }
               });
            }
            var path = this._options._items.getMetaData().path,
               hierarchy = cFunctions.clone(this._hier),
               item;
            if (path) {
               hierarchy = this._getHierarchy(path, this._options._curRoot);
            }
            if (this._previousRoot !== this._options._curRoot) {
               this._notify('onSetRoot', this._options._curRoot, hierarchy);
               //TODO Совсем быстрое и временное решение. Нужно скроллиться к первому элементу при проваливании в папку.
               // Выпилить, когда это будет делать установка выделенного элемента
               //TODO курсор
               /*Если в текущем списке есть предыдущий путь, значит это выход из папки*/
               if (this.getItems().getRecordById(this._previousRoot)) {
                  this.setSelectedKey(this._previousRoot);
                  //todo Это единственный на текущий момент способ проверить, что наш контейнер уже в контейнере ListView и тогда осуществлять scrollTo не нужно!
                  if (!this._container.parents('.controls-ListView').length) {
                     this._scrollToItem(this._previousRoot);
                  }
               } else {
                  /*иначе вход в папку*/
                  item = this._getItemsProjection() && this._getItemsProjection().at(0);
                  if (item) {
                     this.setSelectedKey(item.getContents().getId());
                     if (!this._container.parents('.controls-ListView').length) {
                        //todo Это единственный на текущий момент способ проверить, что наш контейнер уже в контейнере ListView и тогда осуществлять scrollTo не нужно!
                        this._scrollToItem(item.getContents().getId());
                     }
                  }
               }

               this._previousRoot = this._options._curRoot;

            }
         },
         destroy : function() {
            if (this._treePager) {
               this._treePager.destroy();
            }
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
       * Устанавливает узел, относительно которого будет производиться выборка данных списочным методом.
       * @param {String, Number} root Идентификатор корня.
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
       * @return {String, Number} Идентификатор корня.
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
         return this._options._curRoot;
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
            filter = this.getFilter() || {};
         // Internet Explorer при удалении элемента сбрасывает фокус не выше по иерархии, а просто "в никуда" (document.activeElement === null).
         // Для того, чтобы фокус при проваливании в папку не терялся - перед проваливанием устанавливаем его просто на контейнер таблицы, но
         // только в том случае, если ранее фокус реально был на элементе таблицы.
         // https://inside.tensor.ru/opendoc.html?guid=7b093780-dc30-4f90-b443-0d6f96992490&des=
         if (constants.browser.isIE && $.contains(this._container[0], document.activeElement)) {
            this._container.focus();
         }
         // todo Удалить при отказе от режима "hover" у редактирования по месту [Image_2016-06-23_17-54-50_0108] https://inside.tensor.ru/opendoc.html?guid=5bcdb10f-9d69-49a0-9807-75925b726072&description=
         this._destroyEditInPlaceController();
         if (key !== undefined && key !== null) {
            filter[this._options.parentProperty] = key;
         } else {
            if (this._options.root){
               filter[this._options.parentProperty] = this._options.root;
            } else {
               delete(filter[this._options.parentProperty]);
            }
         }
         this.setFilter(filter, true);
         //узел грузим с 0-ой страницы
         this._offset = 0;
         //Если добавить проверку на rootChanged, то при переносе в ту же папку, из которой искали ничего не произойдет
         this._notify('onBeforeSetRoot', key);
         this._options._curRoot = key !== undefined && key !== null ? key : this._options.root;
         if (this._options._itemsProjection) {
            this._options._itemsProjection.setEventRaising(false);
            this._options._itemsProjection.setRoot(this._options._curRoot !== undefined ? this._options._curRoot : null);
            this._options._itemsProjection.setEventRaising(true);
         }
         this._hier = this._getHierarchy(this.getItems(), key);
      },
      _getHierarchy: function(items, key){
         var record, parentKey,
            hierarchy = [];
         if (items && items.getCount()){
            // пока не дойдем до корня (корень может быть undefined)
            while (key && key != this.getRoot()) {
               record = items.getRecordById(key);
               parentKey = record ? record.get(this._options.parentProperty) : null;
               if (record) {
                  hierarchy.push({
                     'id': key || null,
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
       * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
       * @param {Boolena} expand true - содержимое узлов раскрыто, false - содержимое узлов скрыто.
       * @see expand
       * @see getExpand
       */
      setExpand: function(expand) {
         this._options.expand = !!expand;
      },
      /**
       * Возвращает признак установленного режима отображения содержимого записей типа "Узел" (папка) при первой загрузке контрола.
       * @remark
       * Подробнее о типах иерархических записей вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
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
         if (target) {
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