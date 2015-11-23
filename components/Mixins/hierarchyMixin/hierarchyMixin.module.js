define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   /**
    * только работа с иерархией + методы для отображения
    * @mixin SBIS3.CONTROLS.hierarchyMixin
    * @public
    */
   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         //TODO FixMe этот флаг был введен для синхронизации иерархического представления и хлебных крошек
         //вместо того, чтобы рассылать событие о смене корня при проваливании в папку
         //нам приходиться ждать загрузки данных, потом понимать причину загрузки данных(этот флаг)
         //и после загрузки уже рассылать информацию о хлебных кношках, которые пришли в запросе с данными
         //по хорошему мы должны выносить запрос данных в некий контроллер, который разложит состояние
         //в представление данных и в хлебные кношки.
         //В таком случае этот флаг будет не нужен
         _rootChanged: false,
         _curRoot: null,
         _hier: [],
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
            displayType : 'all'

         }
      },
      $constructor: function () {
         var
            filter = this.getFilter() || {};
         this._curRoot = this._options.root;
         filter[this._options.hierField] = this._options.root;
         this.setFilter(filter, true);
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
         var
            indexTree = DataSet.getTreeIndex(this._options.hierField, true),
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
         var path = this._options.openedPath;
         this.hierIterate(this._dataSet , function(record) {
            //Рисуем рекорд если он принадлежит текущей папке или если его родитель есть в openedPath
            var parentKey = self._dataSet.getParentKey(record, self._options.hierField);
            if (parentKey == self._curRoot || path[parentKey]) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.hierField + '@')) {
                     records.push(record);
                  }
               } else {
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
         filter[this._options.hierField] = key;
         this.setFilter(filter, true);
         this._hier = this._getHierarchy(this._dataSet, key);
         //узел грузим с 0-ой страницы
         this._offset = 0;
         //TODO: нужно избавиться от флага когда будут готовы биндинги
         this._rootChanged = this._curRoot !== key;
         this._curRoot = key;
         this.setSelectedKey(null);
      },

      //TODO:После каждого релоада проверяется флаг _rootChanged и если флаг взведен, 
      //то запускается перерисовка хлебных крошек. Это сделано для того, что изначально 
      //грид может открыться на какой то внутренней папке, где надо рисовать хлебные крошки 
      //Избавиться от всего этого когда будут готовы биндинги
      _dataLoadedCallback: function(){
         var path = this._dataSet.getMetaData().path,
            hierarchy = this._hier;
         if (!hierarchy.length && path){
            hierarchy = this._getHierarchy(path, this._curRoot);
         }
         if (this._rootChanged) {
            this._notify('onSetRoot', this._curRoot, hierarchy);
            this._rootChanged = false;
         }
      },

      _getHierarchy: function(dataSet, key){
         var record, parentKey,
            hierarchy = [];
         if (dataSet){
            do {
               record = dataSet.getRecordByKey(key);
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

      _dropPageSave: function(){
         var root = this._options.root;
         this._pageSaver = {};
         this._pageSaver[root] = 0;
      }

   };

   return hierarchyMixin;

});