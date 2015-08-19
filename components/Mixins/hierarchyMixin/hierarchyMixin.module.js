define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   /**
    * только работа с иерархией + методы для отображения
    * @mixin SBIS3.CONTROLS.hierarchyMixin
    */
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
         this._curRoot = this._options.root;
         this._filter = this._filter || {};
         this._filter[this._options.hierField] = this._options.root;
      },

      setHierField: function (hierField) {
         this._options.hierField = hierField;
      },
      /**
       * Получить название поля иерархии
       */
      getHierField : function(){
         return this._options.hierField;
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
               childKeys = indexTree[root] || [];
            for (var i = 0; i < childKeys.length; i++) {
               var record = self._dataSet.getRecordByKey(childKeys[i]);
               iterateCallback.call(this, record, root, curLvl);
               if (indexTree[childKeys[i]]) {
                  curLvl++;
                  hierIterate(childKeys[i]);
                  curLvl--;
               }
            }
         };
         hierIterate(curParentId);
      },


      _getRecordsForRedraw: function() {
         return this._getRecordsForRedrawCurFolder();
      },

      _getRecordsForRedrawCurFolder: function() {
         /*Получаем только рекорды с parent = curRoot*/
         var
            records = [],
            self = this;
         if (!Object.isEmpty(this._options.groupBy)) {
            return this._dataSet._getRecords();
         }
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
         return this._dataSet.getParentKey(record, this._options.hierField);
      },

      /* отображение */

      /**
       * Установить корень выборки
       * @param {String} root Идентификатор корня
       */
      setRoot: function (root) {

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
         var hierarchy = this._getHierarchy(this._dataSet, key),
            record = this._dataSet.getRecordByKey(key),
            filter = this._filter || {},
            self = this;
         filter[this._options.hierField] = key;
         this._filter = filter;
         //узел грузим с 0-ой страницы
         this._offset = 0;
         this._curRoot = key;
         this.reload(filter).addCallback(function(dataSet){
            var path = dataSet.getMetaData().path;
            if (!record && path){
               hierarchy = self._getHierarchy(path, key);
               record = path.getRecordByKey(key);
            }
            self._notify('onSetRoot', key, hierarchy);
         });
      },

      _getHierarchy: function(dataSet, key){
         var record,
            parentKey = key || null,
            hierarchy = [];
         do {
            record = dataSet.getRecordByKey(parentKey);
            if (record) {
               hierarchy.push({
                  'id': parentKey,
                  'title' : record.get(this._options.displayField),
                  'color' : this._options.colorField ? record.get(this._options.colorField) : '',
                  'data' : record
               });
            }
            parentKey = record ? dataSet.getParentKey(record, this._options.hierField) : null;
         } while (parentKey);
         return hierarchy;
      },
      
      _dropPageSave: function(){
         var root = this._options.root;
         this._pageSaver = {};
         this._pageSaver[root] = 0;
      }

   };

   return hierarchyMixin;

});