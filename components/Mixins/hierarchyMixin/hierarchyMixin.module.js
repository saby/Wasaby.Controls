define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   // только работа с иерархией + методы для отображения

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _openedPath: [],
         _indexTree: {},
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

            openType: 'nothing',

            /**
             * @cfg {String} Поле иерархии
             */
            hierField: null
         }
      },
      $constructor: function () {
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
            indexTree = {};

         do {

            DataSet.each(function (record) {
               var parentKey = self.getParentKey(DataSet, record);

               if ((parentKey || null) === (curParent ? curParent.getKey() : null)) {
                  parents.push(record);

                  if (!indexTree.hasOwnProperty(parentKey)) {
                     indexTree[self.getParentKey(DataSet, record)] = [];
                  }

                  indexTree[self.getParentKey(DataSet, record)].push(record.getKey());

                  iterateCallback.call(this, record);
               }

            }, status);

            if (parents.length) {
               var a = Array.remove(parents, 0);
               curParent = a[0];
            }
            else {
               curParent = null;
            }
         } while (curParent);

         this._indexTree = indexTree;
      },

      getChildItems: function (parentId) {
         parentId = parentId || null;
         return this._indexTree[parentId];
      },

      hasChild: function (parentKey) {
         return this._indexTree.hasOwnProperty(parentKey);
      },

      getParent: function () {

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
         throw new Error('Method openNode() must be implemented');
      },

      /**
       * Закрыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      closeNode: function (key) {
         throw new Error('Method closeNode() must be implemented');
      },

      /**
       * Закрыть или открыть определенный узел
       * @param {String} key Идентификатор раскрываемого узла
       */
      toggleNode: function (key) {
         throw new Error('Method toggleNode() must be implemented');
      },

      after: {
         _drawItems: function () {
            this._drawOpenedPath();
         }
      },

      _drawOpenedPath: function () {
         if (this._options.openType == 'all') {
            //TODO: Открыть для всех
         }
         else {
            for (var i = 0; i < this._openedPath.length; i++) {
               this.openNode(this._openedPath[i]);
            }
         }
      }

   };

   return hierarchyMixin;

});