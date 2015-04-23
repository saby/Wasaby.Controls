define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   // только работа с иерархией + методы для отображения

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _indexTree: null,
         _openedPath: [],
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
         this._checkOptions();
      },

      _checkOptions: function () {
         if (this._options.openedPath.length) {
            this._openedPath = this._options.openedPath;
         }
      },

      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },

      // обход происходит в том порядке что и пришли
      hierIterate: function (DataSet, iterateCallback, status) {
         var self = this,
            curParent = null,
            parents = [],
            indexTree = {},
            curLvl = 0;

         do {

            DataSet.each(function (record) {
               var parentKey = self.getParentKey(DataSet, record);

               if ((parentKey || null) === (curParent ? curParent.getKey() : null)) {
                  parents.push({record: record, lvl: curLvl});

                  if (!indexTree.hasOwnProperty(parentKey)) {
                     indexTree[self.getParentKey(DataSet, record)] = [];
                  }

                  indexTree[self.getParentKey(DataSet, record)].push(record.getKey());
                  if (typeof iterateCallback == 'function') {
                     iterateCallback.call(this, record, curParent, curLvl);
                  }
               }

            }, status);

            if (parents.length) {
               var a = Array.remove(parents, 0);
               curParent = a[0]['record'];
               curLvl = a[0].lvl + 1;
            }
            else {
               curParent = null;
            }
         } while (curParent);
         this._indexTree = indexTree;
         DataSet.setIndexTree(indexTree);
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
         var
            self = this,
            filter = this._filter || {};
         filter[self._options.hierField] = key;

         //TODO: проверка что уже загружали ветку и просто показать ее
         self._dataSource.query(filter).addCallback(function (dataSet) {
            self._nodeDataLoaded(key, dataSet);
            self.refreshIndexTree();
         });
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
            for (var i = 0; i < this._openedPath.length; i++) {
               this.openNode(this._openedPath[i]);
            }
         }
      },

      _nodeDataLoaded: function (key, dataSet) {
         this._dataSet = dataSet;
         this._redraw()
      },

      around: {
         _elemClickHandler: function (parentFnc, id, data, target) {
            if ($(target).hasClass('js-controls-TreeView__expand')) {
               var nodeID = $(target).closest('.controls-ListView__item').data('id');
               this.toggleNode(nodeID)
            }
            else {
               parentFnc.call(this, id, data, target)
            }
         }
      }

   };

   return hierarchyMixin;

});