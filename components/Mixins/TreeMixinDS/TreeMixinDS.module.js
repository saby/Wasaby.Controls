define('js!SBIS3.CONTROLS.TreeMixinDS', [
   "Core/core-functions",
   "Core/core-merge",
   "Core/constants",
   "js!SBIS3.CORE.Control",
   "js!SBIS3.CONTROLS.BreadCrumbs",
   "html!SBIS3.CONTROLS.DataGridView/resources/DataGridViewGroupBy",
   "js!WS.Data/Display/Tree",
   "js!WS.Data/Relation/Hierarchy",
   "Core/helpers/collection-helpers",
   "Core/helpers/functional-helpers"
], function ( cFunctions, cMerge, constants,Control, BreadCrumbs, groupByTpl, TreeProjection, HierarchyRelation, colHelpers, fHelpers) {
   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeMixinDS
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var TreeMixinDS = /** @lends SBIS3.CONTROLS.TreeMixinDS.prototype */{
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
       *
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
             * @cfg {String} Устанавливает шаблон футера, который отображается в конце каждого узла иерархии.
             * @remark
             * Опция используется только в иерархических представлениях данных для того, чтобы создать футер в каждом узле иерархии.
             * В качестве значения опции можно передавать следующее:
             * <ul>
             *    <li>Вёрстку. Этот способ применяется редко, когда шаблон небольшой по содержимому.</li>
             *    <li>Шаблон. Этот способ применяется значительно чаще, чем передача вёрстки напрямую в опцию. Шаблон представляет собой XHTML-файл, в котором создана вёрстка футера.
             *    Создание отдельного шаблона позволяет использовать его в дальнейшем и в других компонентах. Шаблон должен быть создан внутри компонента в подпапке resources.
             *    Чтобы шаблон можно было использовать в опции, его нужно подключить в массив зависимостей компонента.</li>
             * </ul>
             * @example
             * В частном случае шаблон футера узла иерархии используют для размещения кнопок создания нового листа или папки.
             * ![](/folderFooterTpl.png)
             * Подробный пример использования футера для решения этой прикладной задачи вы можете найти в разделе {@link /doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/users/add-in-place-hierarchy/ Добавление по месту в иерархическом списке}.
             * @see SBIS3.CONTROLS.List#footerTpl
             */
            folderFooterTpl: undefined,
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
         _loadedNodes: {}
      },

      $constructor : function() {
         var filter = this.getFilter() || {};
         this._publish('onSearchPathClick', 'onNodeExpand', 'onNodeCollapse');

         if (this._options.expand) {
            filter['Разворот'] = 'С разворотом';
            filter['ВидДерева'] = 'С узлами и листьями';
         }
         this.setFilter(filter, true);
      },

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
            idProperty: this._options.idProperty || (this._dataSource ? this._dataSource.getIdProperty() : ''),
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            unique: true,
            root: root
         });
      },

      _getHierarchyRelation: function(idProperty) {
         return new HierarchyRelation({
            idProperty: idProperty || (this._items ? this._items.getIdProperty() : ''),
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty
         });
      },

      _getRecordsForRedraw: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            self = this,
            records = [];
         if (this._options.expand) {
            this.hierIterate(this._items, function (record) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.nodeProperty)) {
                     records.push(record);
                  }
               }
               else {
                  records.push(record);
               }
            });
         }
         else {
            return this._getRecordsForRedrawCurFolder();
         }

         return records;
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
      collapseNode: function (key) {
         /* Закроем узел, только если он раскрыт */
         if(!this.getOpenedPath()[key]) {
            return;
         }

         this._drawExpandArrow(key, false);
         this._collapseChilds(key);
         delete(this._options.openedPath[key]);
         this._nodeClosed(key);
         this._updateItemsToolbar();
         this._notify('onNodeCollapse', key);
      },

      //Рекурсивно удаляем из индекса открытых узлов все дочерние узлы закрываемого узла
      _collapseChilds: function(key){
         var idProperty =  this._options.idProperty || (this._dataSource ? this._dataSource.getIdProperty() : ''),
            hierarchy = this._getHierarchyRelation(idProperty),
            children = hierarchy.getChildren(key, this._items),
            childId;

         for (var i = 0; i < children.length; i++){
            childId = children[i].get(idProperty);
            this._collapseChilds(childId);
            delete(this._options.openedPath[childId]);
         }
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */

      toggleNode: function (key) {
         this[this.getOpenedPath()[key] ? 'collapseNode' : 'expandNode'](key);
      },

      _findExpandByElement: function(elem){
         if (elem.hasClass('js-controls-TreeView__expand')) {
            return elem;
         }
         else {
            var closest = elem.closest('.js-controls-TreeView__expand');
            if (elem.closest('.js-controls-TreeView__expand').length){
               return closest
            }
            else {
               return elem;
            }
         }
      },
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
        * Раскрывает узел (папку) по переданному идентификатору
        * @param {String} key Идентификатор раскрываемого узла
        * @remark
        * Метод используют для программного управления видимостью содержимого узла в общей иерархии.
        * Чтобы закрыть узел по переданному идентификатору, используйте метод {@link collapseNode}.
        * Чтобы изменять видимость содержимого узла в зависимости от его текущего состояния, используйте метод {@link toggleNode}.
        * @see collapseNode
        * @see toggleNode
        */
      expandNode: function (key) {

         if(!this._options.openedPath[key]) {
            var self = this;

            this._folderOffsets[key || 'null'] = 0;
            this._options.openedPath[key] = true;
            this._closeAllExpandedNode(key);
            if (!this._loadedNodes[key] && this._options.partialyReload) {
               this._toggleIndicator(true);
               this._notify('onBeforeDataLoad', this.getFilter(), this.getSorting(), 0, this._limit);
               return this._callQuery(this._createTreeFilter(key), this.getSorting(), 0, this._limit).addCallback(function (dataSet) {
                  // TODO: Отдельное событие при загрузке данных узла. Сделано так как тут нельзя нотифаить onDataLoad,
                  // так как на него много всего завязано. (пользуется Янис)
                  self._folderHasMore[key] = dataSet.getMetaData().more;
                  self._loadedNodes[key] = true;
                  self._notify('onDataMerge', dataSet);
                  self._toggleIndicator(false);
                  self._nodeDataLoaded(key, dataSet);
                  self._notify('onNodeExpand', key);
               });
            } else {
               var hierarchy = this._getHierarchyRelation(),
                  records = hierarchy.getChildren(key, this._items);
               this._drawLoadedNode(key, records, this._folderHasMore[key]);
               this._notify('onNodeExpand', key);
            }
         }
      },
      _closeAllExpandedNode: function(key){
         var self = this;
         if (this._options.singleExpand){
            $.each(this._options.openedPath, function(openedKey, _value){
               if (key != openedKey){
                  self.collapseNode(openedKey);
               }
            });
         }
      },
      /**
       * Получить текущий набор открытых элементов иерархии
       */
      getOpenedPath: function(){
         return this._options.openedPath;
      },

      _drawLoadedNode: function(key, records){
         this._drawExpandArrow(key);
         for (var i = 0; i < records.length; i++) {
            var record = records[i];
            var targetContainer = this._getTargetContainer(record);
            if (targetContainer) {
               if (this._options.displayType == 'folders') {
                  if (record.get(this._options.nodeProperty)) {
                     this._drawAndAppendItem(record, targetContainer);
                  }
               }
               else {
                  this._drawAndAppendItem(record, targetContainer);
               }
            }
         }
         this._updateItemsToolbar();
      },

      _drawExpandArrow: function(key, flag){
         var itemCont = $('.controls-ListView__item[data-id="' + key + '"]', this.getContainer().get(0));
         $('.js-controls-TreeView__expand', itemCont).first().toggleClass('controls-TreeView__expand__open', flag);
      },

      _nodeDataLoaded : function(key, dataSet) {
         var self = this;
         this._needToRedraw = false;
         this._items.merge(dataSet, {remove: false});
         this._needToRedraw = true;
         var records = [];
         dataSet.each(function (record) {
            records.push(record);
         });
         self._drawLoadedNode(key, records, self._folderHasMore[key]);
      },

      around : {
         _addItem: function (parentFnc, item, at) {
            //TODO придрот, чтоб не отрисовывались данные в дереве при первом открытии узла
            var parent = item.getContents().get(this._options.parentProperty);
            if (this._options.openedPath[parent] || (parent == this._curRoot)) {
               parentFnc.call(this, item, at);
            }
         },
         _isViewElement: function(parentFunc, elem) {
            return  parentFunc.call(this, elem) && !elem.hasClass('controls-HierarchyDataGridView__path') && !(elem.wsControl() instanceof BreadCrumbs);
         }
      },

      _nodeClosed : function(key) {

      },

      /* здесь добавляется запись "Еще 50" в корень таблицы, но сейчас мы включаем подгрузку по скроллу в папках, значит этот код не нужен
       _processPaging: function() {
       var more, nextPage;
       if (!this._treePager) {
       more = this._dataSet.getMetaData().more;
       //Убираем текст "Еще n", если включена бесконечная подгрузка
       nextPage = this.isInfiniteScroll() ? false : this._hasNextPage(more);
       var
       container = this.getContainer().find('.controls-TreePager-container'),
       self = this;
       this._treePager = new TreePagingLoader({
       pageSize: this._options.pageSize,
       opener: this,
       hasMore: nextPage,
       element: container,
       handlers : {
       'onClick' : function(){
       self._folderLoad();
       }
       }
       });
       }
       more = this._dataSet.getMetaData().more;
       nextPage = this._hasNextPage(more);
       this._treePager.setHasMore(nextPage);
       },
       */
      _folderLoad: function(id) {
         var
            self = this,
            filter = id ? this._createTreeFilter(id) : this.getFilter();
         this._notify('onBeforeDataLoad', filter, this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit);
         this._loader = this._callQuery(filter, this.getSorting(), (id ? this._folderOffsets[id] : this._folderOffsets['null']) + this._limit, this._limit).addCallback(fHelpers.forAliveOnly(function (dataSet) {
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
               self._drawItemsFolderLoad(this._normalizeItems(dataSet), id);
               self._dataLoadedCallback();
            }

         }, self)).addErrback(function (error) {
            //Здесь при .cancel приходит ошибка вида DeferredCanceledError
            return error;
         });
      },

      _drawItemsFolderLoad: function(records) {
         this._drawItems(records);
      },

      _createFolderPager: function(key, container, more) {
         var
            self = this,
            nextPage = this._hasNextPageInFolder(more, key);

         if (this._options.pageSize) {
            this._treePagers[key] = new TreePagingLoader({
               pageSize: this._options.pageSize,
               opener: this,
               parent: this,
               hasMore: nextPage,
               element: container,
               id: key,
               handlers: {
                  'onClick': function () {
                     self._folderLoad(this._options.id);
                  }
               }
            });
         }
      },

      _hasNextPageInFolder: function(more, id) {
         if (!id) {
            return typeof (more) !== 'boolean' ? more > (this._folderOffsets['null'] + this._options.pageSize) : !!more;
         }
         else {
            return typeof (more) !== 'boolean' ? more > (this._folderOffsets[id] + this._options.pageSize) : !!more;
         }
      },
      _createFolderFooter: function(key) {
         var
            footerTpl = this._options.folderFooterTpl,
            options = this._getFolderFooterOptions(key),
            container = $('<div class="controls-TreeView__folderFooterContainer">' + (footerTpl ? footerTpl(options) : '') + '</div>');
         this._destroyFolderFooter([key]);
         this._createFolderPager(key, $('<div class="controls-TreePager-container">').appendTo(container), options.more);
         this._foldersFooters[key] = container;
      },
      _getFolderFooterOptions: function(key) {
         return {
            keys: key,
            more: this._folderHasMore[key]
         };
      },
      _destroyFolderFooter: function(items) {
         var
            controls,
            self = this;
         colHelpers.forEach(items, function(item) {
            if (self._foldersFooters[item]) {
               controls = self._foldersFooters[item].find('.ws-component');
               for (var i = 0; i < controls.length; i++) {
                  controls[i].wsControl.destroy();
               }
               self._foldersFooters[item].remove();
               delete self._foldersFooters[item];
            }
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
         _keyboardHover: function(e) {
            switch(e.which) {
               case constants.key.m:
                  e.ctrlKey && this.moveRecordsWithDialog();
                  break;
            }
         },
         _dataLoadedCallback: function () {
            //this._options.openedPath = {};
            if (this._options.expand) {
               var hierarchy = this._getHierarchyRelation(),
                  items = this._items,
                  openedPath = this._options.openedPath;
               items.each(function(item) {
                  var id = item.getId(),
                     children = hierarchy.getChildren(item, items);
                  if (children.length && id != 'null' && id != this._curRoot) {
                     openedPath[id] = true;
                  }
               });
            }
         },
         destroy : function() {
            if (this._treePager) {
               this._treePager.destroy();
            }
         },
         _clearItems: function(container) {
            if (this._getItemsContainer().get(0) == $(container).get(0) || !container) {
               var self = this;
               this._lastParent = this._curRoot;
               this._lastDrawn = undefined;
               this._lastPath = [];
               this._destroySearchBreadCrumbs();
               colHelpers.forEach(this._foldersFooters, function(val, key) {
                  self._destroyFolderFooter([key]);
               });
            }
         }
      },
      after : {
         _modifyOptions: function (opts) {
            var tpl = opts.folderFooterTpl;
            //Если нам передали шаблон как строку вида !html, то нужно из нее сделать функцию
            if (tpl && typeof tpl === 'string' && tpl.match(/^html!/)) {
               opts.folderFooterTpl = require(tpl);
            }
            return opts;
         }
      },

      _elemClickHandlerInternal: function (data, id, target) {
         var
            nodeID = $(target).closest('.controls-ListView__item').data('id'),
            closestExpand = this._findExpandByElement($(target));

         if (closestExpand.hasClass('js-controls-TreeView__expand')) {
            this.toggleNode(nodeID);
         }
         else {
            if ((this._options.allowEnterToFolder) && ((data.get(this._options.nodeProperty)))){
               this.setCurrentRoot(nodeID);
               this.reload();
            }
            else {
               this._activateItem(id);
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
      _searchMethod: function(record, at, last){
         //TODO lastParent - curRoot - правильно?. 2. Данные всегда приходят в правильном порядке?
         var key,
            curRecRoot,
            drawItem = false,
            kInd = -1;
         if (this._lastParent === undefined) {
            this._lastParent = this._curRoot;
         }
         key = record.getId();
         curRecRoot = record.get(this._options.parentProperty);
         //TODO для SBISServiceSource в ключе находится массив, а теперь он еще и к строке приводится...
         curRecRoot = curRecRoot instanceof Array ? curRecRoot[0] : curRecRoot;
         if (curRecRoot == this._lastParent){
            //Лист
            if (record.get(this._options.nodeProperty) !== true){
               //Нарисуем путь до листа, если пришли из папки
               if (this._lastDrawn !== 'leaf' && this._lastPath.length) {
                  this._drawGroup(record, at);
               }
               this._lastDrawn = 'leaf';
               drawItem = true;
            } else { //папка
               this._lastDrawn = undefined;
               this._lastPath.push(record);
               this._lastParent = key;
               //Если мы уже в последней записи в иерархии, то нужно отрисовать крошки и сбросить сохраненный путь
               if (last) {
                  this._drawGroup(record, at);
                  this._lastPath = [];
                  this._lastParent = this._curRoot;
               }
            }
         } else {//другой кусок иерархии
            //Если текущий раздел у записи есть в lastPath, то возьмем все элементы до этого ключа
            kInd = -1;
            for (var k = 0; k < this._lastPath.length; k++) {
               if (this._lastPath[k].getId() == curRecRoot){
                  kInd = k;
                  break;
               }
            }
            //Если текущий раздел есть в this._lastPath его надо нарисовать
            if (  this._lastDrawn !== 'leaf' && this._lastPath.length) {
               this._drawGroup(record, at);
            }
            this._lastDrawn = undefined;
            this._lastPath = kInd >= 0 ? this._lastPath.slice(0, kInd + 1) : [];
            //Лист
            if (record.get(this._options.nodeProperty) !== true){
               if ( this._lastPath.length) {
                  this._drawGroup(record, at);
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
                  this._drawGroup(record, at);
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
                  var filter = cMerge(self.getFilter(), {
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
            parentID = pathRecords[i].get(this._options.parentProperty);
            dsItems.push({
               id: pathRecords[i].getId(),
               title: pathRecords[i].get(this._options.displayProperty),
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
      }
   };

   var TreePagingLoader = Control.Control.extend({
      $protected :{
         _options : {
            id: null,
            pageSize : 20,
            hasMore : false
         }
      },
      $constructor : function(){
         this._container.addClass('controls-TreePager');
         this.setHasMore(this._options.hasMore);
      },
      setHasMore: function(more) {
         this._options.hasMore = more;
         if (this._options.hasMore) {
            this._container.html('Еще ' + this._options.pageSize);
         }
         else {
            this._container.empty();
         }
      }
   });

   return TreeMixinDS;

});