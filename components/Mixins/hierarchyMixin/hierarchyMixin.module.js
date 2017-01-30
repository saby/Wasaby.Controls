define('js!SBIS3.CONTROLS.hierarchyMixin', [
   "Core/core-functions",
   "js!WS.Data/Relation/Hierarchy"
], function ( cFunctions,Hierarchy) {

   /**
    * Миксин, добавляющий только работу с иерархией и методы для отображения.
    * @mixin SBIS3.CONTROLS.hierarchyMixin
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   var hierarchyMixin = /** @lends SBIS3.CONTROLS.hierarchyMixin.prototype */{
      /**
       * @event onSetRoot Происходит при загрузке данных и перед установкой корня иерархии.
       * @remark
       * При каждой загрузке данных, например вызванной методом {@link SBIS3.CONTROLS.ListView#reload}, происходит событие onSetRoot.
       * В этом есть необходимость, потому что в переданных данных может быть установлен новый path - путь для хлебных крошек (см. {@link WS.Data/Collection/RecordSet#meta}).
       * Хлебные крошки не перерисовываются, так как корень не поменялся.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} curRoot Идентификатор узла, который установлен в качестве текущего корня иерархии.
       * @param {Array.<object>} hierarchy Массив объектов, каждый из которых описывает узлы иерархии установленного пути.
       * Каждый объект содержит следующие свойства:
       * <ul>
       *    <li>id - идентификатор текущего узла иерархии;</li>
       *    <li>parent - идентификатор предыдущего узла иерархии;</li>
       *    <li>title - значение поля отображения (см. {@link SBIS3.CONTROLS.DSMixin#displayProperty});</li>
       *    <li>color - значение поля записи, хранящее данные об отметке цветом (см. {@link SBIS3.CONTROLS.DecorableMixin#colorField});</li>
       *    <li>data - запись узла иерархии, экземпляр класса {@link WS.Data/Entity/Record}.</li>
       * </ul>
       * @see onBeforeSetRoot
       */
      /**
       * @event onBeforeSetRoot Происходит при установке текущего корня иерархии.
       * @remark
       * Событие может быть инициировано при использовании метода {@link setCurrentRoot}.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String|Number|Null} key Идентификатор узла иерархии, который нужно установить. Null - это вершина иерархии, в наборе данных отображены только те записи, которые являются родительскими для других.
       * @see onSetRoot
       */
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
             * @cfg {String} Устанавливает поле иерархии.
             * @remark
             * Полем иерархии называют поле записи, по значениям которой устанавливаются иерархические отношения между записями набора данных.
             * Для таблиц БД, для которых установлен <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">тип отношений Иерархия</a>, по умолчанию поле иерархии называется "Раздел".
             * @see setParentProperty
             * @see getParentProperty
             */
            parentProperty: null,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             *
             * @example
             * <pre>
             *    <option name="parentProperty">Раздел@</option>
             * </pre>
             */
            nodeProperty: null,
            /**
             * @cfg {String} Устанавливает режим отображения данных, имеющих иерархическую структуру.
             * @remark
             * Для набора данных, имеющих иерархическую структуру, опция определяет режим их отображения. Она позволяет пользователю отображать данные в виде развернутого или свернутого списка.
             * В режиме развернутого списка будут отображены узлы группировки данных (папки) и данные, сгруппированные по этим узлам.
             * В режиме свернутого списка будет отображен только список узлов (папок).
             * <br/>
             * Возможные значения опции:
             * <ul>
             *    <li>folders - будут отображаться только узлы (папки);</li>
             *    <li>all - будут отображаться узлы (папки) и их содержимое - элементы коллекции, сгруппированные по этим узлам.</li>
             * </ul>
             *
             * Подробное описание иерархической структуры приведено в документе {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy Типы отношений в таблицах БД}.
             * @example
             * Устанавливаем режим полного отображения данных: будут отображены элементы коллекции и папки, по которым сгруппированы эти элементы.
             * <pre class="brush:xml">
             *     <option name="displayType">all</option>
             * </pre>
             */
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
            filter[this._options.parentProperty] = this._options.root;
         }
         this._previousRoot = this._curRoot;
         this.setFilter(filter, true);
      },
      /**
       * Устанавливает поле иерархии.
       * @param {String }hierField Название поля иерархии.
       * @see hierField
       * @see getHierField
       */
      setHierField: function (hierField) {
         IoC.resolve('ILogger').log('hierarchyMixin', 'Метод setHierField устарел, используйте setParentProperty/setNodeProperty');
         this.setParentProperty(hierField);
      },
      /**
       * Возвращает название поля иерархии.
       * @return {String}
       * @see hierField
       * @see setHierField
       */
      getHierField : function(){
         IoC.resolve('ILogger').log('hierarchyMixin', 'Метод getHierField устарел, используйте getParentProperty/getNodeProperty');
         return this.getParentProperty();
      },
      /**
       * Устанавливает поле иерархии.
       * @param {String }pp Название поля иерархии.
       * @see parentProperty
       * @see getParentProperty
       */
      setParentProperty: function (pp) {
         this._options.parentProperty = pp;
      },
      /**
       * Возвращает название поля иерархии.
       * @return {String}
       * @see parentProperty
       * @see setParentProperty
       */
      getParentProperty : function(){
         return this._options.parentProperty;
      },
      /**
       * Устанавливает поле типа записи в иерархии.
       * @param {String }np Название поля иерархии.
       * @see nodeProperty
       * @see getNodeProperty
       */
      setNodeProperty: function (np) {
         this._options.nodeProperty = np;
      },
      /**
       * Возвращает поле типа записи в иерархии.
       * @return {String}
       * @see nodeProperty
       * @see setNodeProperty
       */
      getNodeProperty : function(){
         return this._options.nodeProperty;
      },
      hierIterate: function (DataSet, iterateCallback, status) {
         var
            hierarchy = new Hierarchy({
               idProperty: DataSet.getIdProperty(),
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty
            });

         var
            curParentId = (typeof this._curRoot != 'undefined') ? this._curRoot : null,
            curPath = [],
            curLvl = 0,
            hierIterate = function(root) {
               if (Array.indexOf(curPath, root) > -1) {
                  var error = 'Recursive hierarchy structure detected: node with id "' + root + '" has link to itself';
                  if (curPath.map) {
                     error += ' (';
                     curPath.push(root);
                     error += curPath
                        .map(function(i) {
                           return '' + i;
                        })
                        .join(' -> ');
                     error += ')';
                  }
                  throw new Error(error);
               }
               curPath.push(root);

               var children = hierarchy.getChildren(root, DataSet);
               for (var i = 0; i < children.length; i++) {
                  var record = children[i];
                  iterateCallback.call(this, record, root, curLvl);

                  curLvl++;
                  hierIterate(record.getId());
                  curLvl--;
               }

               curPath.pop();
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
            return this._items.toArray();
         }
         var path = this._options.openedPath;
         this.hierIterate(this._items , function(record) {
            //Рисуем рекорд если он принадлежит текущей папке или если его родитель есть в openedPath
            var parentKey = record.get(self._options.parentProperty);
            if (parentKey == self._curRoot || path[parentKey]) {
               if (self._options.displayType == 'folders') {
                  if (record.get(self._options.nodeProperty)) {
                     records.push(record);
                  }
               } else {
                  records.push(record);
               }
            }
         });

         return records;
      },
      /**
       * Возвращает идентификатор родительской записи.
       * @param {WS.Data/Collection/RecordSet} DataSet Набор данных.
       * @param {WS.Data/Entity/Record} record Запись, для которой нужно определить идентификатор родителя.
       * @returns {*|{d: Array, s: Array}|String|Number}
       */
      getParentKey: function (DataSet, record) {
         return record.get(this._options.parentProperty);
      },
      /**
       * Установить корень выборки.
       * @param {String|Number} root Идентификатор корня
       */
      setRoot: function(root){
         this._options.root = root;
      },
      /**
       * Возвращает идентификатор корня иерархии.
       * @returns {String|Number|Null} Идентификатор текущего узла иерархии. Null - это вершина иерархии, в наборе данных отображены только те записи, которые являются родительскими для других.
       * @see setCurrentRoot
       */
      getCurrentRoot : function(){
         return this._curRoot;
      },
      /**
       * Устанавливает текущий корень иерархии.
       * @remark
       * Метод производит изменение набора данных: он будет соответствовать содержимому узла, идентификатор которого был установлен в качестве корня иерархии.
       * В иерархических списках существует три типа записей: лист, узел и скрытый узел. Подробнее о различиях между ними читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Типы отношений в БД</a>.
       * При выполнении метода происходит событие {@link onBeforeSetRoot}.
       * @param {String|Number|Null} key Идентификатор узла иерархии, который нужно установить. Null - это вершина иерархии, в наборе данных отображены только те записи, которые являются родительскими для других.
       * @see getCurrentRoot
       * @see onBeforeSetRoot
       */
      setCurrentRoot: function(key) {
         var
            filter = this.getFilter() || {};
         if (key) {
            filter[this._options.parentProperty] = key;
         }
         else {
            if (this._options.root){
               filter[this._options.parentProperty] = this._options.root;
            } else {
               delete(filter[this._options.parentProperty]);
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
               hierarchy = cFunctions.clone(this._hier),
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
               parentKey = record ? record.get(this._options.parentProperty) : null;
               if (record) {
                  hierarchy.push({
                     'id': key || null,
                     'parent' : parentKey,
                     'title' : record.get(this._options.displayProperty),
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
            item = this._items.getRecordById(id),
            meta = {
               id: id,
               item: item,
               hierField : this._options.parentProperty,
               parentProperty : this._options.parentProperty,
               nodeProperty: this._options.nodeProperty
            };

         this._notify('onItemActivate', meta);
      }

   };

   return hierarchyMixin;

});