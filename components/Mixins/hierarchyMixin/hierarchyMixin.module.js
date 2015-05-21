define('js!SBIS3.CONTROLS.hierarchyMixin', ['js!SBIS3.CONTROLS.DataSet'], function (DataSet) {

   // только работа с иерархией + методы для отображения

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _indexTree: null,
         _options: {
            /**
             * @cfg {String} Идентификатор узла, относительно которого надо отображать данные
             * @noShow
             */
            root: null,

            /**
             * @cfg {Array} Набор идентификаторов, обозначающих какую ветку надо развернуть при инициализации
             */
            openedPath: [],

            /**
             * @cfg {Boolean} Открывать ли все узлы при отрисовке
             */
            openAllNodes: false,

            /**
             * @cfg {String} Поле иерархии
             */
            hierField: null

         }
      },
      $constructor: function () {
         this._curRoot = this._options.root;
      },

      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },

      // обход происходит в том порядке что и пришли
      hierIterate: function (DataSet, iterateCallback, status) {
         var self = this,
            curParentId = this._curRoot,
            parents = [],
            indexTree = {},
            curLvl = 0;
         do {

            DataSet.each(function (record) {
               var parentKey = self.getParentKey(DataSet, record);
              // if ((parentKey || null) === (curParent ? curParent.getKey() : null)) {
               if ((parentKey || null) === curParentId) {
                  parents.push({record: record, lvl: curLvl});

                  if (!indexTree.hasOwnProperty(parentKey)) {
                     indexTree[self.getParentKey(DataSet, record)] = [];
                  }

                  indexTree[self.getParentKey(DataSet, record)].push(record.getKey());
                  if (typeof iterateCallback == 'function') {
                     iterateCallback.call(this, record, curParentId, curLvl);
                  }
               }

            }, status);

            if (parents.length) {
               var a = Array.remove(parents, 0);
               curParentId = a[0]['record'].getKey();
               curLvl = a[0].lvl + 1;
            }
            else {
               curParentId = null;
            }
         } while (curParentId);
         this._indexTree = indexTree;
         DataSet.setIndexTree(indexTree);
      },

      _redraw: function () {
         this._clearItems();
         var records = [];

         /*TODO вынести середину в переопределяемый метод*/
         var self = this;
         this._dataSet.each(function (record) {
            if (self.getParentKey(self._dataSet, record) == self._curRoot) {
               records.push(record);
            }
         });

         this._drawItems(records);
      },

      refreshIndexTree: function () {
         this.hierIterate(this._dataSet);
      },

      getParentKey: function (DataSet, record) {
         return DataSet.getStrategy().getParentKey(record.get(this._options.hierField));
      },

      /* отображение */

      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function (root) {

      },

      /**
       * Открыть определенный путь
       * @param {Array} path набор идентификаторов
       */
      setOpenedPath: function (path) {

      },

      /**
       * Раскрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      openNode: function (key) {
         var self = this;
         this._loadNode(key).addCallback(function (dataSet) {
            self._nodeDataLoaded(key, dataSet);
         });
      },

      _loadNode : function(key) {
         /*TODO проверка на что уже загружали*/
         var filter = this._filter || {};
         filter[this._options.hierField] = key;
         return this._dataSource.query(filter);
      },

      toggleNode: function(key) {
         this.openNode(key);
      },

      after: {
         _drawItems: function () {
            this._drawOpenedPath();
         }

      },

      _drawOpenedPath: function () {
         if (this._options.openAllNodes) {
            //TODO: Открыть для всех
         }
         else {
            for (var i = 0; i < this._options.openedPath.length; i++) {
               this.openNode(this._options.openedPath[i]);
            }
         }
      },

      _nodeDataLoaded: function (key, dataSet) {
         this._notify('onDataLoad', dataSet);
         this._setCurRootNode(key, dataSet);
      },

      _setCurRootNode: function(key, dataSet) {
         var strategy = this._dataSet.getStrategy();
         this._dataSet = new DataSet({
            data: dataSet,
            strategy: strategy
         });
         this._curRoot = key;
         this._redraw();
      },

      around: {
         _elemClickHandler: function (parentFnc, id, data, target) {
            if ($(target).hasClass('js-controls-TreeView__expand') && $(target).hasClass('has-child')) {
               var nodeID = $(target).closest('.controls-ListView__item').data('id');
               this.toggleNode(nodeID);
            }
            else {
               parentFnc.call(this, id, data, target);
            }
         }
      }

   };

   return hierarchyMixin;

});