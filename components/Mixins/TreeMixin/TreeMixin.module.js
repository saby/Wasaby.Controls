define('js!SBIS3.CONTROLS.TreeMixin', ['js!SBIS3.CONTROLS.BreadCrumbs',
   'browser!html!SBIS3.CONTROLS.DataGridView/resources/DataGridViewGroupBy', 'js!SBIS3.CONTROLS.Data.Projection.Tree'], function (BreadCrumbs, groupByTpl, TreeProjection) {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var TreeMixin = /** @lends SBIS3.CONTROLS.TreeMixin.prototype */{
      /**
       * @event onSearchPathClick При клике по хлебным крошкам в режиме поиска.
       * Событие, происходящее после клика по хлебным крошкам, отображающим результаты поиска
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {number} id ключ узла, по которму кликнули
       * @return Если вернуть false - загрузка узла не произойдет
       * @example
       * <pre>
       *    DataGridView.subscribe('onSearchPathClick', function(event){
       *      searchForm.clearSearch();
       *    });
       * </pre>
       */
      /**
       * @event onNodeExpand После разворачивания ветки
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} key ключ разворачиваемой ветки
       * @example
       * <pre>
       *    onNodeExpand: function(event){
       *       $ws.helpers.question('Продолжить?');
       *    }
       * </pre>
       */
      /**
       * @event onNodeCollapse После сворачивания ветки
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} key ключ разворачиваемой ветки
       * @example
       * <pre>
       *    onNodeCollapse: function(event){
       *       $ws.helpers.question('Продолжить?');
       *    }
       * </pre>
       */
      /**
       * @event onSearchPathClick При клике по хлебным крошкам в режиме поиска.
       * Событие, происходящее после клика по хлебным крошкам, отображающим результаты поиска
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {number} id ключ узла, по которму кликнули
       * @return Если вернуть false - загрузка узла не произойдет
       * @example
       * <pre>
       *    DataGridView.subscribe('onSearchPathClick', function(event){
       *      searchForm.clearSearch();
       *    });
       * </pre>
       */
      $protected: {
         _folderOffsets : {},
         _folderHasMore : {},
         _treePagers : {},
         _treePager: null,
         _options: {
            /**
             * @cfg {String} Идентификатор узла, относительно которого надо отображать данные
             * @noShow
             */
            root: undefined,

            /**
             * @cfg {String} Поле иерархии
             */
            hierField: null,
            displayType : 'all',
            /**
             * @cfg {Boolean} При открытия узла закрывать другие
             */
            singleExpand: false,

            /**
             * @cfg {Boolean} Устанавливает режим отображения содержимого узлов (папок) в иерархии при построении контрола
             * @variant true Содержимое узлов раскрыто.
             * @variant false Содержимое узлов скрыто.
             */
            expand: false,
            /**
             * @cfg {Boolean} Запрашивать записи для папки если в текущем наборе данных их нет
             * @noShow
             */
            partialyReload: true,
            openedPath : {},
            /**
             * @cfg {Boolean}
             * Разрешить проваливаться в папки
             * Если выключено, то папки можно открывать только в виде дерева, проваливаться в них нельзя
             */
            allowEnterToFolder: true
         },
         _foldersFooters: {},
         _breadCrumbs : [],
         _lastParent : undefined,
         _lastDrawn : undefined,
         _lastPath : [],
         _loadedNodes: {},
         _previousRoot: null,
         _curRoot: null,
         _hier: [],
         _paddingSize: 16,
         _originallPadding: 6
      },

      $constructor : function() {
         var
            filter = this.getFilter() || {};
         this._publish('onSearchPathClick', 'onNodeExpand', 'onSetRoot', 'onBeforeSetRoot');
         if (typeof this._options.root != 'undefined') {
            this._curRoot = this._options.root;
            filter[this._options.hierField] = this._options.root;
         }
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         this._previousRoot = this._curRoot;
         this.setFilter(filter, true);
      },
      _projectionFilter: function(item, index, itemProj) {
         return this._isSearchMode() || this._isVisibleItem(itemProj, this._options.displayType == 'folders');
      },
      /**
       * Задать поле иерархии
       * @param hierField Название поля иерархии
       */
      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },
      /**
       * Получить название поля иерархии
       */
      getHierField : function(){
         return this._options.hierField;
      },
      /**
       * Создает проекцию итемов
       */
      _createDefaultProjection : function(items) {
         var root;
         if (typeof this._curRoot != 'undefined') {
            root = this._curRoot;
         }
         else {
            if (typeof this._options.root != 'undefined') {
               root = this._options.root;
            }
            else {
               root = null;
            }
         }
         this._itemsProjection = new TreeProjection({
            collection: items,
            idProperty: this._options.keyField || (this._dataSource ? this._dataSource.getIdProperty() : ''),
            parentProperty: this._options.hierField,
            nodeProperty: this._options.hierField + '@',
            root: root
         });
         this._itemsProjection.setFilter(this._projectionFilter.bind(this));
      },
      /**
       * Закрывает узел (папку) по переданному идентификатору
       * @param {String} key Идентификатор закрываемого узла
       * @remark
       * Метод используют для программного управления видимостью содержимого узла в общей иерархии.
       * Чтобы раскрыть узел по переданному идентификатору, используйте метод {@link expandNode}.
       * Чтобы изменять видимость содержимого узла в зависимости от его текущего состояния, используйте метод {@link toggleNode}.
       * @see expandNode
       * @see toggleNode
       */
      collapseNode: function(key) {
         this._getItemProjectionByItemId(key).setExpanded(false);
      },
      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      toggleNode: function(key) {
         this._getItemProjectionByItemId(key).toggleExpanded();
      },
      /**
       * Развернуть ветку
       * @param key
       * @returns {$ws.proto.Deferred}
       */
      expandNode: function(key) {
         this._getItemProjectionByItemId(key).setExpanded(true);
      },
      _expandAllItems: function() {
         var
            enumerator = this._itemsProjection.getEnumerator(),
            doNext = true,
            item;
         while (doNext && (item = enumerator.getNext())) {
            if (item.isNode() && !item.isExpanded()) {
               item.setExpanded(true);
               doNext = false;
               this._expandAllItems();
            }
         }
      },
      /**
       * Получить список записей для отрисовки
       * @private
       */
      _getRecordsForRedraw: function() {
         //*Получаем только рекорды с parent = curRoot*//
         var
            records = [];
         if (this._options.expand) {
            this._itemsProjection.setEventRaising(false);
            this._expandAllItems();
            this._itemsProjection.setEventRaising(true);
            this._itemsProjection.each(function(item) {
               records.push(item);
            });
         }
         else {
            return this._getRecordsForRedrawCurFolder();
         }
         return records;
      },
      _isVisibleItem: function(item, onlyFolders) {
         if (onlyFolders && (item.isNode() !== true)) {
            return false;
         }
         var itemParent = item.getParent();
         return itemParent ? itemParent.isExpanded() ? this._isVisibleItem(itemParent) : false : true;
      },
      _getItemsForRedrawOnAdd: function(items) {
         var result = [];
         for (var i = 0; i < items.length; i++) {
            if (this._isVisibleItem(items[i])) {
               result.push(items[i]);
            }
         }
         return result;
      },
      /**
       * todo Переписать, когда будет выполнена указанная ниже задача
       * Задача в разработку от 28.04.2016 №1172779597
       * В деревянной проекции необходима возможность определять, какие элементы создаются развернутыми. Т...
       * https://inside.tensor.ru/opendoc.html?guid=6f1758f0-f45d-496b-a8fe-fde7390c92c7
       * @private
       */
      _applyExpandToItemsProjection: function() {
         var idx, item;
         this._itemsProjection.setEventRaising(false);
         this._itemsProjection.setFilter(retTrue);
         for (idx in this._options.openedPath) {
            if (this._options.openedPath.hasOwnProperty(idx)) {
               item = this._getItemProjectionByItemId(idx);
               if (item && !item.isExpanded()) {
                  if (this._itemsProjection.getChildren(item).getCount()) {
                     item.setExpanded(true);
                  } else {
                     delete this._options.openedPath[idx];
                  }
               }
            }
         }
         this._itemsProjection.setFilter(this._projectionFilter.bind(this));
         this._itemsProjection.setEventRaising(true);
      },
      _getRecordsForRedrawCurFolder: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            items = [],
            itemParent;
         //todo Проверка на "searchParamName" - костыль. Убрать, когда будет адекватная перерисовка записей (до 150 версии, апрель 2016)
         if (this._isSearchMode()) {
            /*TODO нехорошее место, для поиска возвращаем приватное свойство, потому что надо в независимости от текущего корня
            * показать все записи, а по другому их не вытащить*/
            return this._itemsProjection._items;
         } else {
            this._applyExpandToItemsProjection();
            this._itemsProjection.each(function(item) {
               items.push(item);
            }.bind(this));
         }
         return items;
      },
      /**
       * Создаёт фильтр для дерева (берет текущий фильтр и дополняет его)
       * @param key
       * @returns {Object|{}}
       * @private
       */
      _createTreeFilter: function(key) {
         var
            filter = $ws.core.clone(this.getFilter()) || {};
         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'Узлы и листья';
         }
         this.setFilter($ws.core.clone(filter), true);
         filter[this._options.hierField] = key;
         return filter;
      },
      /**
       * Закрыть все открытые ветки, кроме переданной в параметре
       * @param key
       * @private
       */
      _closeAllExpandedNode: function(key) {
         if (this._options.singleExpand){
            $.each(this._options.openedPath, function(openedKey) {
               if (key != openedKey) {
                  this.collapseNode(openedKey);
               }
            }.bind(this));
         }
      },
      /**
       * Получить текущий набор открытых элементов иерархии
       */
      getOpenedPath: function(){
         return this._options.openedPath;
      },
      around : {
         _buildTplArgs: function(parentFnc, item) {
            var
               args = parentFnc.call(this, item);
            args.displayType = this._options.displayType;
            args.hierField = this._options.hierField;
            args.paddingSize = this._paddingSize;
            args.originallPadding = this._originallPadding;
            args.isSearch = (!Object.isEmpty(this._options.groupBy) && this._options.groupBy.field === this._searchParamName)
            return args;
         }
      },
      /**
       * Обработка загрузки ветки
       * @param id
       * @private
       */
      _folderLoad: function(id) {
         var
            self = this,
            filter = id ? this._createTreeFilter(id) : this.getFilter();
         this._notify('onBeforeDataLoad', filter, this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit);
         this._loader = this._callQuery(filter, this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit).addCallback($ws.helpers.forAliveOnly(function (dataSet) {
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
               self._hideLoadingIndicator();
            }
            //Если данные пришли, нарисуем
            if (dataSet.getCount()) {
               self._items.merge(dataSet, {remove: false});
               self._items.getTreeIndex(self._options.hierField, true);
               self._updateItemsToolbar();
               self._dataLoadedCallback();
            }

         }, self)).addErrback(function (error) {
            //Здесь при .cancel приходит ошибка вида DeferredCanceledError
            return error;
         });
      },
      before: {
         reload : function() {
            this._folderOffsets['null'] = 0;
            this._lastParent = undefined;
            this._lastDrawn = undefined;
            this._lastPath = [];
            this._loadedNodes = {};
         },
         _dataLoadedCallback: function () {
            //this._options.openedPath = {};
            if (this._options.expand) {
               var tree = this._dataSet.getTreeIndex(this._options.hierField);
               for (var i in tree) {
                  if (tree.hasOwnProperty(i) && i != 'null' && i != this._curRoot) {
                     this._options.openedPath[i] = true;
                  }
               }
            }
            var path = this._items.getMetaData().path,
               hierarchy = $ws.core.clone(this._hier),
               item;
            if (path) {
               hierarchy = this._getHierarchy(path, this._curRoot);
            }
            // При каждой загрузке данных стреляем onSetRoot, не совсем правильно
            // но есть случаи когда при reload присылают новый path,
            // а хлебные крошки не перерисовываются так как корень не поменялся
            this._notify('onSetRoot', this._curRoot, hierarchy);
            //TODO Совсем быстрое и временное решение. Нужно скроллиться к первому элементу при проваливании в папку.
            // Выпилить, когда это будет делать установка выделенного элемента
            if (this._previousRoot !== this._curRoot) {

               //TODO курсор
               /*Если в текущем списке есть предыдущий путь, значит это выход из папки*/
               if (this.getItems().getRecordById(this._previousRoot)) {
                  this.setSelectedKey(this._previousRoot);
                  this._scrollToItem(this._previousRoot);
               }
               else {
                  /*иначе вход в папку*/
                  item = this.getItems() && this.getItems().at(0);
                  if (item){
                     this.setSelectedKey(item.getId());
                     this._scrollToItem(item.getId());
                  }
               }

               this._previousRoot = this._curRoot;

            }
         },
         destroy : function() {
            if (this._treePager) {
               this._treePager.destroy();
            }
         }
      },
      /*----------------HierarchySearchGroupBy-----------------*/
      getSearchGroupBy: function(field){
         return {
            field: field,
            template : groupByTpl,
            method : this._searchMethod.bind(this),
            render : this._searchRender.bind(this)
         }
      },
      //----------------- defaultSearch group
      /**
       * Метод поиска по умолчанию
       * @param record
       * @param at
       * @returns {{drawItem: boolean, drawGroup: boolean}}
       */
      _searchMethod: function(record, at, last, projItem){
         //TODO lastParent - curRoot - правильно?. 2. Данные всегда приходят в правильном порядке?
         var key,
            curRecRoot,
            drawItem = false,
            kInd = -1;
         if (this._lastParent === undefined) {
            this._lastParent = this._curRoot;
         }
         key = record.getKey();
         curRecRoot = record.get(this._options.hierField);
         //TODO для SBISServiceSource в ключе находится массив, а теперь он еще и к строке приводится...
         curRecRoot = curRecRoot instanceof Array ? curRecRoot[0] : curRecRoot;
         if (curRecRoot == this._lastParent){
            //Лист
            if (record.get(this._options.hierField + '@') !== true){
               //Нарисуем путь до листа, если пришли из папки
               if (this._lastDrawn !== 'leaf' && this._lastPath.length) {
                  this._drawGroup(projItem.getContents(), at, undefined, projItem);
               }
               this._lastDrawn = 'leaf';
               drawItem = true;
            } else { //папка
               this._lastDrawn = undefined;
               this._lastPath.push(record);
               this._lastParent = key;
               //Если мы уже в последней записи в иерархии, то нужно отрисовать крошки и сбросить сохраненный путь
               if (last) {
                  this._drawGroup(projItem.getContents(), at, undefined, projItem);
                  this._lastPath = [];
                  this._lastParent = this._curRoot;
               }
            }
         } else {//другой кусок иерархии
            //Если текущий раздел у записи есть в lastPath, то возьмем все элементы до этого ключа
            kInd = -1;
            for (var k = 0; k < this._lastPath.length; k++) {
               if (this._lastPath[k].getKey() == curRecRoot){
                  kInd = k;
                  break;
               }
            }
            //Если текущий раздел есть в this._lastPath его надо нарисовать
            if (  this._lastDrawn !== 'leaf' && this._lastPath.length) {
               this._drawGroup(projItem.getContents(), at, undefined, projItem);
            }
            this._lastDrawn = undefined;
            this._lastPath = kInd >= 0 ? this._lastPath.slice(0, kInd + 1) : [];
            //Лист
            if (record.get(this._options.hierField + '@') !== true){
               if ( this._lastPath.length) {
                  this._drawGroup(projItem.getContents(), at, undefined, projItem);
               }
               drawItem = true;
               this._lastDrawn = 'leaf';
               this._lastParent = curRecRoot;
            } else {//папка
               this._lastDrawn = undefined;
               this._lastPath.push(record);
               this._lastParent = key;
               //Если мы уже в последней записи в иерархии, то нужно отрисовать крошки и сбросить сохраненный путь
               if (last) {
                  this._drawGroup(projItem.getContents(), at, undefined, projItem);
                  this._lastPath = [];
                  this._lastParent = this._curRoot;
               }
            }
         }
         return {
            drawItem : drawItem,
            drawGroup: false
         };
      },
      _searchRender: function(item, container){
         this._drawBreadCrumbs(this._lastPath, item, container);
         return container;
      },
      _drawBreadCrumbs:function(path, record, container){
         if (path.length) {
            var self = this,
               elem,
               groupBy = this._options.groupBy,
               cfg,
               td = container.find('td');
            td.append(elem = $('<div style="width:'+ td.width() +'px"></div>'));
            cfg = {
               element : elem,
               items: this._createPathItemsDS(path),
               parent: this.getTopParent(),
               highlightEnabled: this._options.highlightEnabled,
               highlightText: this._options.highlightText,
               colorMarkEnabled: this._options.colorMarkEnabled,
               colorField: this._options.colorField,
               className : 'controls-BreadCrumbs__smallItems',
               enable: this._options.allowEnterToFolder
            };
            if (groupBy.hasOwnProperty('breadCrumbsTpl')){
               cfg.itemTemplate = groupBy.breadCrumbsTpl
            }
            var ps = new BreadCrumbs(cfg);
            ps.once('onItemClick', function(event, id){
               //Таблицу нужно связывать только с тем PS, в который кликнули. Хорошо, что сначала идет _notify('onBreadCrumbClick'), а вотом выполняется setCurrentRoot
               event.setResult(false);
               //TODO Выпилить в .100 проверку на задизабленность, ибо событие вообще не должно стрелять и мы сюда не попадем, если крошки задизаблены
               if (this.isEnabled() && self._notify('onSearchPathClick', id) !== false ) {
                  //TODO в будущем нужно отдать уже dataSet крошек, ведь здесь уже все построено
                  /*TODO для Алены. Временный фикс, потому что так удалось починить*/
                  var filter = $ws.core.merge(self.getFilter(), {
                     'Разворот' : 'Без разворота'
                  });
                  if (self._options.groupBy.field) {
                     filter[self._options.groupBy.field] = undefined;
                  }
                  //Если бесконечный скролл был установлен в опции - вернем его
                  self.setInfiniteScroll(self._options.infiniteScroll, true);
                  self.setGroupBy({});
                  self.setHighlightText('', false);
                  self.setFilter(filter, true);
                  self.setCurrentRoot(id);
                  self.reload();
               }
            });
            this._breadCrumbs.push(ps);
         } else{
            //если пути нет, то группировку надо бы убить...
            container.remove();
         }

      },
      _createPathItemsDS: function(pathRecords){
         var dsItems = [],
            parentID;
         for (var i = 0; i < pathRecords.length; i++){
            //TODO для SBISServiceSource в ключе находится массив
            parentID = pathRecords[i].get(this._options.hierField);
            dsItems.push({
               id: pathRecords[i].getKey(),
               title: pathRecords[i].get(this._options.displayField),
               parentId: parentID instanceof Array ? parentID[0] : parentID,
               data: pathRecords[i]
            });
         }
         return dsItems;
      },
      _destroySearchBreadCrumbs: function(){
         for (var i =0; i < this._breadCrumbs.length; i++){
            this._breadCrumbs[i].destroy();
         }
         this._breadCrumbs = [];
      },
      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function(root){
         this._options.root = root;
      },
      /**
       * Получить текущий корень иерархии
       * @returns {*}
       */
      getCurrentRoot : function(){
         return this._curRoot;
      },
      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      setCurrentRoot: function(key) {
         var
            filter = this.getFilter() || {};
         if (key) {
            filter[this._options.hierField] = key;
         }
         else {
            if (this._options.root){
               filter[this._options.hierField] = this._options.root;
            } else {
               delete(filter[this._options.hierField]);
            }
         }
         this.setFilter(filter, true);
         this._notify('onBeforeSetRoot');
         this._hier = this._getHierarchy(this._dataSet, key);
         //узел грузим с 0-ой страницы
         this._offset = 0;
         //Если добавить проверку на rootChanged, то при переносе в ту же папку, из которой искали ничего не произойдет
         this._notify('onBeforeSetRoot', key);
         this._curRoot = key || this._options.root;
         if (this._itemsProjection) {
            this._itemsProjection.setEventRaising(false);
            this._itemsProjection.setRoot(this._curRoot || null);
            this._itemsProjection.setEventRaising(true);
         }
      },
      _getHierarchy: function(dataSet, key){
         var record, parentKey,
            hierarchy = [];
         if (dataSet){
            do {
               record = dataSet.getRecordById(key);
               parentKey = record ? dataSet.getParentKey(record, this._options.hierField) : null;
               if (record) {
                  hierarchy.push({
                     'id': key || null,
                     'parent' : parentKey,
                     'title' : record.get(this._options.displayField),
                     'color' : this._options.colorField ? record.get(this._options.colorField) : '',
                     'data' : record
                  });
               }
               key = parentKey;
            } while (key);
         }
         return hierarchy;
      },

      getParentKey: function (DataSet, item) {
         var
            itemParent = this._itemsProjection.getItemBySourceItem(item).getParent().getContents();
         return $ws.helpers.instanceOfModule(itemParent, 'SBIS3.CONTROLS.Data.Record') ? itemParent.getId() : itemParent;
      },

      _dropPageSave: function(){
         var root = this._options.root;
         this._pageSaver = {};
         this._pageSaver[root] = 0;
      }
   };

   return TreeMixin;
});