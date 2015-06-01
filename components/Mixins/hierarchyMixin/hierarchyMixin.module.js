define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   // только работа с иерархией + методы для отображения

   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _curRoot: null,
         _options: {
            /**
             * @cfg {String} Идентификатор узла, относительно которого надо отображать данные
             * @noShow
             */
            root: null,

            /**
             * @cfg {String} Поле иерархии
             */
            hierField: null,
            /**
             * folders/all
             * */
            displayType : 'all'

         }
      },
      $constructor: function () {
         this._publish('onCurrentNodeChange');
         this._curRoot = this._options.root;
         this._filter = this._filter || {};
         this._filter[this._options.hierField] = this._options.root;
      },

      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },

      // обход происходит в том порядке что и пришли
      hierIterate: function (DataSet, iterateCallback, status) {
         if (Object.isEmpty(DataSet._indexTree)) {
            DataSet._reindexTree(this._options.hierField);
         }
         var
            indexTree = DataSet._indexTree,
            self = this,
            curParentId = (typeof this._curRoot != 'undefined') ? this._curRoot : null,
            curLvl = 0;

         var hierIterate = function(root) {
            var
               childKeys = indexTree[root];
            for (var i = 0; i < childKeys.length; i++) {
               var record = self._dataSet.getRecordByKey(childKeys[i]);
               iterateCallback.call(this, record, root, curLvl);
               if (indexTree[childKeys[i]]) {
                  curLvl++;
                  hierIterate(childKeys[i]);
                  curLvl--
               }
            }
         };
         hierIterate(curParentId);
      },


      _getRecordsForRedraw: function() {
         return this._getRecordsForRedrawCurFolder()
      },

      _getRecordsForRedrawCurFolder: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            records = [],
            self = this;
         this._dataSet.each(function (record) {
            if (self._dataSet.getParentKey(record, self._options.hierField) == self._curRoot) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.hierField + '@')) {
                     records.push(record);
                  }
               }
               else {
                  records.push(record);
               }
            }
         });

         return records;
      },

      getParentKey: function (DataSet, record) {
         return this._dataSet.getParentKey(record, this._options.hierField)
      },

      /* отображение */

      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function (root) {

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
         this._filter = filter;
         //узел грузим с 0-ой страницы
         this._offset = 0;
         return this._dataSource.query(filter, undefined, this._offset, this._limit);
      },

      toggleNode: function(key) {
         this.openNode(key);
      },

      _nodeDataLoaded: function (key, dataSet) {
         this._notify('onDataLoad', dataSet);
         this._setCurRootNode(key, dataSet);
         this._dataLoadedCallback();
      },

      _setCurRootNode: function(key, dataSet) {
         if (!this._dataSet){
            this._dataSet = dataSet;
         } else {
            this._dataSet.setRawData(dataSet.getRawData());
         }
         var title = key ? this._dataSet.getRecordByKey(key).get('title') : '';
         this._notify('onCurrentNodeChange', key, title);
         this._curRoot = key;
         this._redraw();
      }

   };

   return hierarchyMixin;

});