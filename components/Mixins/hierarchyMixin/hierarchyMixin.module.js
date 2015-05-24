define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

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
         if (Object.isEmpty(DataSet._indexTree)) {
            DataSet._reindexTree(this._options.hierField);
         }
         var indexTree = DataSet._indexTree;
         var self = this,
            curParentId = this._curRoot || null,
            parents = [],
            curLvl = 0;

         /*TODO мб в этом ереборе задействовать индекс?*/
         do {

            DataSet.each(function (record) {
               var parentKey = DataSet.getParentKey(record, self._options.hierField);
              // if ((parentKey || null) === (curParent ? curParent.getKey() : null)) {
               if ((parentKey || null) === curParentId) {
                  parents.push({record: record, lvl: curLvl});

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
               records.push(record);
            }
         });

         return records;
      },

      refreshIndexTree: function () {
         this.hierIterate(this._dataSet);
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
         return this._dataSource.query(filter);
      },

      toggleNode: function(key) {
         this.openNode(key);
      },



      _nodeDataLoaded: function (key, dataSet) {
         this._notify('onDataLoad', dataSet);
         this._setCurRootNode(key, dataSet);
      },

      _setCurRootNode: function(key, dataSet) {
         if (!this._dataSet){
            this._dataSet = dataSet;
         } else {
            this._dataSet.merge(dataSet);
         }
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