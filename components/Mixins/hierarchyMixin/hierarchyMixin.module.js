define('js!SBIS3.CONTROLS.hierarchyMixin', [], function () {

   /**
    * только работа с иерархией + методы для отображения
    * @mixin SBIS3.CONTROLS.hierarchyMixin
    * @public
    */
   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      $protected: {
         _previousRoot: null,
         _curRoot: null,
         _hier: [],
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
            displayType : 'all'

         }
      },
      $constructor: function () {
         var
            filter = this.getFilter() || {};
         //Внимание! Событие очень нужно иерархическому поиску. Подписано в ComponentBinder
         this._publish('onSetRoot', 'onBeforeSetRoot');
         if (typeof this._options.root != 'undefined') {
            this._curRoot = this._options.root;
            filter[this._options.hierField] = this._options.root;
         }
         this._previousRoot = this._curRoot;
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
               var record = self._items.getRecordByKey(childKeys[i]);
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
         //todo Проверка на "searchParamName" - костыль. Убрать, когда будет адекватная перерисовка записей (до 150 версии, апрель 2016)
         if (!Object.isEmpty(this._options.groupBy) && this._options.groupBy.field === this._searchParamName) {
            return this._items._getRecords();
         }
         var path = this._options.openedPath;
         this.hierIterate(this._items , function(record) {
            //Рисуем рекорд если он принадлежит текущей папке или если его родитель есть в openedPath
            var parentKey = self._items.getParentKey(record, self._options.hierField);
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
         return this._items.getParentKey(record, this._options.hierField);
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
         this._hier = this._getHierarchy(this._items, key);
         //узел грузим с 0-ой страницы
         this._offset = 0;
         //Если добавить проверку на rootChanged, то при переносе в ту же папку, из которой искали ничего не произойдет
         this._notify('onBeforeSetRoot', key);
         this._curRoot = key || this._options.root;
         if (this._itemsProjection) {
            this._itemsProjection.setRoot(this._curRoot || null);
         }
      },
      after : {
         _dataLoadedCallback: function () {
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

      _dropPageSave: function(){
         var root = this._options.root;
         this._pageSaver = {};
         this._pageSaver[root] = 0;
      },

      //Переопределяем метод, чтоб передать тип записи
      _activateItem : function(id) {
         var
            item = this._items.getRecordByKey(id),
            meta = {
               id: id,
               item: item,
               hierField : this._options.hierField
            };

         this._notify('onItemActivate', meta);
      }

   };

   return hierarchyMixin;

});