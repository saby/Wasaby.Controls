define('js!SBIS3.CONTROLS.DSMixin', [
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CONTROLS.SbisJSONStrategy',
   'js!SBIS3.CONTROLS.DataFactory',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Query.Query',
   'js!SBIS3.CORE.MarkupTransformer'
], function (StaticSource, ArrayStrategy, SbisJSONStrategy, DataFactory, DataSet, RecordSet, Query, MarkupTransformer) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   var DSMixin = /**@lends SBIS3.CONTROLS.DSMixin.prototype  */{
       /**
        * @event onDrawItems После отрисовки всех элементов коллекции
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @example
        * <pre>
        *     Menu.subscribe('onDrawItems', function(){
        *        if (Menu.getItemsInstance(2).getCaption() == 'Входящие'){
        *           Menu.getItemsInstance(2).destroy();
        *        }
        *     });
        * </pre>
        * @see items
        * @see displayField
        */
       /**
        * @event onDataLoad При загрузке данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {SBIS3.CONTROLS.DataSet} dataSet Набор данных.
        * @example
        * <pre>
        *     myComboBox.subscribe('onDataLoad', function(eventObject) {
        *        TextBox.setText('Загрузка прошла успешно');
        *     });
        * </pre>
        * @see items
        * @see setDataSource
        * @see getDataSource
        */
      $protected: {
         _itemsInstances: {},
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            /**
             * @cfg {String} Поле элемента коллекции, которое является идентификатором записи
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента.
             * @example
             * <pre class="brush:xml">
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             * @see displayField
             * @see setDataSource
             * @see SBIS3.CONTROLS.Selectable#selectedKey
             * @see SBIS3.CONTROLS.Selectable#setSelectedKey
             * @see SBIS3.CONTROLS.Selectable#getSelectedKey
             */
            keyField : null,
            /**
             * @cfg {String} Поле элемента коллекции, из которого отображать данные
             * @example
             * <pre class="brush:xml">
             *     <option name="displayField">Название</option>
             * </pre>
             * @remark
             * Данные задаются либо в опции {@link items}, либо методом {@link setDataSource}.
             * Источник данных может состоять из множества полей. В данной опции необходимо указать имя поля, данные
             * которого нужно отобразить в выпадающем списке.
             * @see keyField
             * @see items
             * @see setDataSource
             */
            displayField: null,
             /**
              * @cfg {Array.<Object.<String,String>>} Масив объектов. Набор исходных данных, по которому строится отображение
              * @remark
              * !Важно: данные для коллекции элементов можно задать либо в этой опции,
              * либо через источник данных методом {@link setDataSource}.
              * @example
              * <pre class="brush:xml">
              *     <options name="items" type="array">
              *        <options>
              *            <option name="id">1</option>
              *            <option name="title">Пункт1</option>
              *         </options>
              *         <options>
              *            <option name="id">2</option>
              *            <option name="title">Пункт2</option>
              *         </options>
              *         <options>
              *            <option name="id">3</option>
              *            <option name="title">ПунктПодменю</option>
              *            <!--необходимо указать это полем иерархии для корректной работы-->
              *            <option name="parent">2</option>
              *            <option name="icon">sprite:icon-16 icon-Birthday icon-primary</option>
              *         </options>
              *      </options>
              *      <option name="hierField">parent</option>
              * </pre>
              * @see keyField
              * @see displayField
              * @see setDataSource
              * @see getDataSet
              * @see hierField
              */
            items: [],
            /**
             * @cfg {DataSource} Набор исходных данных, по которому строится отображение
             * @noShow
             * @see setDataSource
             */
            dataSource: undefined,
             /**
              * @cfg {Number} Количество записей, запрашиваемых с источника данных
              * @remark
              * Опция определяет количество запрашиваемых записей с источника даныых как при построении контрола, так и
              * при осуществлении подгрузки.
              * Для иерархических структур при пейджинге по скроллу опция также задаёт количество подгружаемых записей
              * кликом по кнопке "Ещё".
              * !Важно: в базе данных как листья, так и узлы являются записями. Поэтому необходимо учитывать, что в
              * количество записей считаются и узлы, и листья. Т.е. подсчёт идёт относительно полностью развёрнутого
              * представления данных. Например, узел с тремя листьями - это 4 записи.
              * </ul>
              * @example
              * <pre class="brush:xml">
              *     <option name="pageSize">10</option>
              * </pre>
              * @see setPageSize
              */
            pageSize: undefined,
            /**
             * @typedef {Object} GroupBy
             * @property {String} field Поле записи
             * @property {Function} method Метод группировки
             * @property {String} template Шаблон вёрстки
             * @property {Function} render Функция визуализации
             */
            /**
             * @cfg {GroupBy} Настройка группировки записей
             * @remark
             * Если задать только поле записи(field), то будет группировать по типу лесенки (Пример 1).
             * Т.е. перед каждым блоком с одинаковыми данными будет создавать блок, для которого можно указать шаблон
             * Внимание! Для правильной работы группировки данные уже должны прийти отсортированные!
             * @example
             * 1:
             * <pre class="brush:xml">
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *    </options>
             * </pre>
             * Пример с указанием метода группировки:
             * <pre class="brush:xml">
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *         <option name="method" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myGroupBy</option>
             *    </options>
             * </pre>
             */
            groupBy : {},
            /**
             * @cfg {Function} Пользовательский метод добавления атрибутов на элементы коллекции
             */
            userItemAttributes : null,
            /**
             * @cfg {String|HTMLElement|jQuery} Отображаемый контент при отсутствии данных
             * @example
             * <pre class="brush:xml">
             *     <option name="emptyHTML">Нет данных</option>
             * </pre>
             * @remark
             * Опция задаёт текст, отображаемый как при абсолютном отсутствии данных, так и в результате {@link groupBy фильтрации}.
             * @see items
             * @see setDataSource
             * @see groupBy* @cfg {Function} Пользовательский метод добавления атрибутов на элементы коллекции
             */
            emptyHTML: '',
            /**
             * @var {Object} Фильтр данных
             * @example
             * <pre class="brush:xml">
             *     <options name="filter">
             *        <option name="creatingDate" bind="selectedDocumentDate"></option>
             *        <option name="documentType" bind="selectedDocumentType"></option>
             *     </options>
             * </pre>
             */
            filter: {},
            sorting: [],
            /**
             * @cfg {Object.<String,String>} соответствие опций шаблона полям в рекорде
             */
            templateBinding: {},
            /**
             * @cfg {Object.<String,String>} подключаемые внешние шаблоны, ключу соответствует поле it.included.<...> которое будет функцией в шаблоне
             */
            includedTemplates: {}
         },
         _loader: null
      },

      $constructor: function () {
         this._publish('onDrawItems', 'onDataLoad');
         if (typeof this._options.pageSize === 'string') {
            this._options.pageSize = this._options.pageSize * 1;
         }
         //Для совместимости пока делаем Array
         if (this._options.dataSource) {
            this._dataSource = this._options.dataSource;
         }
         else {
            var items;
            if (this._options.items && this._options.items.length) {
               if (this._options.items instanceof Array) {
                  items = this._options.items;
               }
               else {
                  throw new Error('Array expected');
               }
               var
                  item = items[0];
               if (!this._options.keyField) {
                 if (item && Object.prototype.toString.call(item) === '[object Object]') {
                   this._options.keyField = Object.keys(item)[0];
                 }
               }
               this._dataSource = new StaticSource({
                  compatibilityMode: true,
                  data: items,
                  strategy: new ArrayStrategy(),
                  keyField: this._options.keyField
               });
            }
         }
      },
       /**
        * Метод установки источника данных.
        * @remark
        * Данные могут быть заданы либо этим методом, либо опцией {@link items}.
        * @param ds Новый источник данных.
        * @param noLoad Установить новый источник данных без запроса на БЛ.
        * @example
        * <pre>
        *     define(
        *     'SBIS3.MY.Demo',
        *     'js!SBIS3.CONTROLS.StaticSource',
        *     'js!SBIS3.CONTROLS.ArrayStrategy',
        *     function(StaticSource, ArrayStrategy){
        *        //коллекция элементов
        *        var arrayOfObj = [
        *           {'@Заметка': 1, 'Содержимое': 'Пункт 1', 'Завершена': false},
        *           {'@Заметка': 2, 'Содержимое': 'Пункт 2', 'Завершена': false},
        *           {'@Заметка': 3, 'Содержимое': 'Пункт 3', 'Завершена': true}
        *        ];
        *        //источник статических данных
        *        var ds1 = new StaticSource({
        *           data: arrayOfObj,
        *           keyField: '@Заметка',
        *           strategy: ArrayStrategy
        *        });
        *        this.getChildControlByName("ComboBox 1").setDataSource(ds1);
        *     })
        * </pre>
        * @see dataSource
        * @see onDrawItems
        * @see onDataLoad
        */
      setDataSource: function (ds, noLoad) {
         this._dataSource = ds;
         this._dataSet = null;
          if(!noLoad) {
             return this.reload();
          }
      },
      /**
       * Метод получения набора данных, который в данный момент установлен в представлении.
       * @example
       * <pre>
       *     var dataSet = myComboBox.getDataSet(),
       *     count = dataSet.getCount();
       *     if (count > 1) {
	   *        title.setText('У вас есть выбор: это хорошо!');
       *     }
       * </pre>
       * @see dataSource
       * @see setDataSource
       * @see onDrawItems
       * @see onDataLoad
       */
      getDataSet: function() {
         return this._dataSet;
      },
       /**
        * Метод перезагрузки данных.
        * Можно задать фильтрацию, сортировку.
        * @param {String} filter Параметры фильтрации.
        * @param {String} sorting Параметры сортировки.
        * @param offset Элемент, с которого перезагружать данные.
        * @param {Number} limit Ограничение количества перезагружаемых элементов.
        */
      reload: propertyUpdateWrapper(function (filter, sorting, offset, limit) {
         if (this._options.pageSize) {
            this._limit = this._options.pageSize;
         }

         var
            def = new $ws.proto.Deferred(),
            self = this,
            filterChanged = typeof(filter) !== 'undefined',
            sortingChanged = typeof(sorting) !== 'undefined',
            offsetChanged = typeof(offset) !== 'undefined',
            limitChanged = typeof(limit) !== 'undefined';

         this._cancelLoading();
         if (filterChanged) {
            this.setFilter(filter, true);
         }
          if (sortingChanged) {
             this.setSorting(sorting, true);
          }
         this._offset = offsetChanged ? offset : this._offset;
         this._limit = limitChanged ? limit : this._limit;

         if (this._dataSource){
            this._toggleIndicator(true);
	         this._loader = this._callQuery(this._options.filter, this.getSorting(), this._offset, this._limit).addCallback($ws.helpers.forAliveOnly(function (dataSet) {
	            self._toggleIndicator(false);
	            self._loader = null;//Обнулили без проверки. И так знаем, что есть и загрузили
	            if (self._dataSet) {
	               self._dataSet.setRawData(dataSet.getRawData());
	               self._dataSet.setMetaData(dataSet.getMetaData());
	            } else {
	               self._dataSet = dataSet;
	            }
	            self._dataLoadedCallback();
	            self._notify('onDataLoad', dataSet);
	            //self._notify('onBeforeRedraw');
	            def.callback(dataSet);
	            self._redraw();
	         }, self)).addErrback($ws.helpers.forAliveOnly(function(error){
	            if (!error.canceled) {
	               self._toggleIndicator(false);
	               $ws.helpers.message(error.message.toString().replace('Error: ', ''));
	            }
	            def.errback(error);
	         }, self));
         }

         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('sorting');
         this._notifyOnPropertyChanged('offset');
         this._notifyOnPropertyChanged('limit');

         return def;
      }),

      _callQuery: function (filter, sorting, offset, limit) {
         if (!this._dataSource) {
            return;
         }

         //TODO: remove switch after migration to SBIS3.CONTROLS.Data.Source.ISource
         if ($ws.helpers.instanceOfMixin(this._dataSource, 'SBIS3.CONTROLS.Data.Source.ISource')) {
            var query = new Query();
            query.where(filter)
               .offset(offset)
               .limit(limit)
               .orderBy(sorting);

            return this._dataSource.query(query).addCallback((function(newDataSet) {
               return new RecordSet({
                  compatibleMode: true,
                  strategy: this._dataSource.getAdapter(),
                  model: newDataSet.getModel(),
                  data: newDataSet.getProperty(newDataSet.getItemsProperty()),
                  meta: {
                     results: newDataSet.getProperty('r'),
                     more: newDataSet.getTotal(),
                     path: newDataSet.getProperty('p')
                  },
                  keyField: this._options.keyField || newDataSet.getIdProperty() || this._dataSource.getAdapter().forRecord(newDataSet.getRawData()).getKeyField()
               });
            }).bind(this));
         } else {
            return this._dataSource.query(filter, sorting, offset, limit);
         }
      },

      _toggleIndicator:function(){
         /*Method must be implemented*/
      },
      _toggleEmptyData:function() {
         /*Method must be implemented*/
      },
       /**
        * Метод установки количества элементов на одной странице.
        * @param {Number} pageSize Количество записей.
        * @example
        * <pre>
        *     myListView.setPageSize(20);
        * </pre>
        * @remark
        * Метод задаёт/меняет количество записей при построении представления данных.
        * В случае дерева и иерархии:
        * <ul>
        *    <li>при пейджинге по скроллу опция также задаёт количество подгружаемых записей кликом по кнопке "Ещё";</li>
        *    <li>как листья, так и узлы являются записями, количество записей считается относительно полностью
        *    развёрнутого представления данных. Например, узел с тремя листьями - это 4 записи.</li>
        * </ul>
        * @see pageSize
        */
      setPageSize: function(pageSize){
         this._options.pageSize = pageSize;
         this._dropPageSave();
         this.reload(this._options.filter, this.getSorting(), 0, pageSize);
      },
      /**
       * Метод получения количества элементов на одной странице.
       * @see pageSize
       */
      getPageSize: function() {
         return this._options.pageSize
      },
      /**
       * Получить текущий фильтр в наборе данных
       * @returns {Object|*|DSMixin._filter}
       */
      getFilter: function() {
         return this._options.filter;
      },
      /**
       * Установить фильтр на набор данных
       * @param {Object} filter
       * @param {Boolean} noLoad установить фильтр без запроса на БЛ
       */
      setFilter: function(filter, noLoad){
         this._options.filter = filter;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         }
      },
      /**
       * Получить текущую сортировку
       * @returns {Array}
       */
      getSorting: function() {
         return this._options.sorting;
      },
      /**
       * Получить текущую сортировку
       * @returns {Array}
       */
      setSorting: function(sorting, noLoad) {
         this._options.sorting = sorting;
         this._dropPageSave();
         if (this._dataSource && !noLoad) {
            this.reload(this._options.filter, this.getSorting(), 0, this.getPageSize());
         }
      },
      //переопределяется в HierarchyMixin
      _setPageSave: function(pageNum){
      },
      //переопределяется в HierarchyMixin
      _dropPageSave: function () {
      },
      //TODO Сделать публичным? вроде так всем захочется делать
      _isLoading: function () {
         return this._loader && !this._loader.isReady();
      },
      //TODO Сделать публичным? вроде так всем захочется делать
      /**
       * После использования нужно присвоить null переданному loader самостоятельно!
       * @param loader
       * @private
       */
      _cancelLoading: function () {
         if (this._isLoading()) {
            this._loader.cancel();
         }
         this._loader = null;
      },
      //TODO поддержка старого - обратная совместимость
      getItems : function() {
         if (this._dataSet) {
            return this._dataSet.getRawData();
         }
         else {
            return this._options.items;
         }
      },
       /**
        * Метод установки либо замены коллекции элементов, заданных опцией {@link items}.
        * @param {Object} items Набор новых данных, по которому строится отображение.
        * @example
        * <pre>
        *     setItems: [
        *        {
        *           id: 1,
        *           title: 'Сообщения'
        *        },{
        *           id: 2,
        *           title: 'Прочитанные',
        *           parent: 1
        *        },{
        *           id: 3,
        *           title: 'Непрочитанные',
        *           parent: 1
        *        }
        *     ]
        * </pre>
        * @see items
        * @see addItem
        * @see getItems
        * @see onDrawItems
        * @see onDataLoad
        */
       setItems: function (items) {
          //TODO Сделать метод для очистки всех Items, ибо setItems([]) - не очевидно
          var keyField, item;

          if (this._options.keyField) {
             keyField = this._options.keyField;
          }

          if (items && items.length) {
             item = items[0];

             if (item && !keyField && Object.prototype.toString.call(item) === '[object Object]') {
                keyField = Object.keys(item)[0];
             }
          }
          else {
             items = [];
          }

          this._dataSource = new StaticSource({
             compatibilityMode: true,
             data: items,
             strategy: new ArrayStrategy(),
             keyField: keyField
          });
          this.reload();
       },

      _drawItemsCallback: function () {
         /*Method must be implemented*/
      },

      _redraw: function () {
         var records;

         if (this._dataSet) {
            this._clearItems();
            records = this._getRecordsForRedraw();
            this._toggleEmptyData(!records.length && this._options.emptyHTML);
            this._drawItems(records);
         }
      },
      _destroySearchBreadCrumbs: function(){
      },
      _getRecordsForRedraw : function() {
         return this._dataSet._getRecords();
      },

      _drawItems: function (records, at) {
         var
            curAt = at;
         if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
               this._drawAndAppendItem(records[i], curAt, i === records.length - 1);
               if (curAt && curAt.at) {
                  curAt.at++;
               }
            }
            this.reviveComponents().addCallback(this._notifyOnDrawItems.bind(this)).addErrback(function(e){
               throw e;
            });
         } else {
            this._notifyOnDrawItems();
         }
      },

      /**
       * Сигналит о том, что отрисовка набора закончена
       */
      _notifyOnDrawItems: function() {
         this._notify('onDrawItems');
         this._drawItemsCallback();
      },

      _clearItems: function (container) {
         container = container || this._getItemsContainer();
         /*Удаляем компоненты-инстансы элементов*/
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};
         if (container.length){
            var itemsContainers = $('.controls-ListView__item, .controls-GroupBy', container.get(0));
            /*Удаляем вложенные компоненты*/
            $('[data-component]', itemsContainers).each(function (i, item) {
               var inst = $(item).wsControl();
               if (inst) {
                  inst.destroy();
               }
            });

            /*Удаляем сами items*/
            itemsContainers.remove();
         }
      },

      //метод определяющий в какой контейнер разместить определенный элемент
      _getTargetContainer: function (item) {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function () {
         return this._container;
      },

      /**
       * Метод перерисовки определенной записи
       * @param {Object} item Запись, которую необходимо перерисовать
       */
      redrawItem: function(item) {
         var
            targetElement = this._getElementForRedraw(item),
            newElement = this._drawItem(item).addClass(targetElement.attr('class'));
         targetElement.after(newElement).remove();
         this.reviveComponents();
      },

      _getElementForRedraw: function(item) {
         return this._getItemsContainer().find('.js-controls-ListView__item[data-id="' + item.getKey() + '"]');
      },

      _drawItem: function (item, at, last) {
         var
            itemInstance;
         //Запускаем группировку если она есть. Иногда результат попадает в группровку и тогда отрисовывать item не надо
         if (this._group(item, at, last) !== false) {
            itemInstance = this._createItemInstance(item, this._getTargetContainer(item), at);
            this._addItemAttributes(itemInstance, item);
         }
         return itemInstance;
      },

      _drawAndAppendItem: function(item, at, last) {
         var
            itemInstance = this._drawItem(item, at, last);
         if (itemInstance) {
            this._appendItemTemplate(item, this._getTargetContainer(item), itemInstance, at);
         }
      },

      /**
       *
       * Из метода группировки можно вернуть Boolean - рисовать ли группировку
       * или Объект - {
       *    drawItem - рисовать ли текущую запись
       *    drawGroup - рисовавть ли группировку перед текущей записью
       * }
       * @param item
       * @param at
       */
      _group: function(item, at, last){
         var groupBy = this._options.groupBy,
               resultGroup,
               drawGroup,
               drawItem = true;
         if (!Object.isEmpty(groupBy)){
            resultGroup = groupBy.method.apply(this, [item, at, last]);
            drawGroup = typeof resultGroup === 'boolean' ? resultGroup : (resultGroup instanceof Object && resultGroup.hasOwnProperty('drawGroup') ? !!resultGroup.drawGroup : false);
            drawItem = resultGroup instanceof Object && resultGroup.hasOwnProperty('drawItem') ? !!resultGroup.drawItem : true;
            if (drawGroup){
               this._drawGroup(item, at, last)
            }
         }
         return drawItem;
      },
      _drawGroup: function(item, at, last){
         var
               groupBy = this._options.groupBy,
               tplOptions = {
                  columns : $ws.core.clone(this._options.columns || []),
                  multiselect : this._options.multiselect,
                  hierField: this._options.hierField + '@'
               },
               targetContainer,
               itemInstance;
         targetContainer = this._getTargetContainer(item);
         tplOptions.item = item;
         tplOptions.colspan = tplOptions.columns.length + this._options.multiselect;
         itemInstance = this._buildTplItem(item, groupBy.template(tplOptions));
         this._appendItemTemplate(item, targetContainer, itemInstance, at);
         //Сначала положим в дом, потом будем звать рендеры, иначе контролы, которые могут создать в рендере неправмльно поймут свою ширину
         if (groupBy.render && typeof groupBy.render === 'function') {
            groupBy.render.apply(this, [item, itemInstance, last]);
         }
         //Навесим класс группировки и удалим лишний класс на item, если он вдруг добавился
         itemInstance.addClass('controls-GroupBy')
               .removeClass('controls-ListView__item');

      },
      /**
       * Установка группировки элементов. Если нужно, чтобы стандартаная группировка для этого элемента не вызывалась -
       * нужно обязательно переопределить(передать) все опции (field, method, template, render) иначе в группировку запишутся стандартные параметры.
       * @remark Всем элементам группы добавляется css-класс controls-GroupBy
       * @param group
       * @param redraw
       */
      setGroupBy : function(group, redraw){
         //TODO может перерисовку надо по-другому делать
         this._options.groupBy = group;
         // запросим данные из источника
         if (!Object.isEmpty(this._options.groupBy)){
            if (!this._options.groupBy.hasOwnProperty('method')){
               this._options.groupBy.method = this._groupByDefaultMethod;
            }
            if (!this._options.groupBy.hasOwnProperty('template')){
               this._options.groupBy.template = this._getGroupTpl();
            }
            if (!this._options.groupBy.hasOwnProperty('render')){
               this._options.groupBy.render = this._groupByDefaultRender;
            }

         }
         if (redraw){
            this._redraw();
         }
      },
      _groupByDefaultMethod: function(){
         throw new Error('Method _groupByDefaultMethod() must be implemented');
      },
      _getGroupTpl : function(){
         throw new Error('Method _getGroupTpl() must be implemented');
      },
      _groupByDefaultRender: function(){
         throw new Error('Method _groupByDefaultRender() must be implemented');
      },
      _getItemTemplate: function () {
         throw new Error('Method _getItemTemplate() must be implemented');
      },

      _addItemAttributes: function (container, item) {
         container.attr('data-id', item.getKey()).addClass('controls-ListView__item');
         if (this._options.userItemAttributes && this._options.userItemAttributes instanceof Function) {
            this._options.userItemAttributes(container, item);
         }
      },

      _createItemInstance: function (item, targetContainer, at) {
         return this._buildTplItem(item, this._getItemTemplate(item));
      },
      _buildTplItem: function(item, itemTpl){
         var
               buildedTpl,
               dotTemplate;
         if (typeof itemTpl == 'string') {
            if (itemTpl.indexOf('html!') == 0) {
               dotTemplate = require(itemTpl);
            }
            else {
               dotTemplate = doT.template(itemTpl);
            }

         }
         else if (typeof itemTpl == 'function') {
            dotTemplate = itemTpl;
         }

         if (typeof dotTemplate == 'function') {
            buildedTpl = $(MarkupTransformer(dotTemplate(this._buildTplArgs(item))));
            return buildedTpl;
         }
         else {
            throw new Error('Ошибка в itemTemplate');
         }
      },
      _buildTplArgs: function(item) {
         var
            tplOptions = {
               templateBinding : this._options.templateBinding,
               item: item
            };
         if (this._options.includedTemplates) {
            var tpls = this._options.includedTemplates;
            tplOptions.included = {};
            for (var j in tpls) {
               if (tpls.hasOwnProperty(j)) {
                  tplOptions.included[j] = require(tpls[j]);
               }
            }
         }
         return tplOptions
      },
      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl, at) {
         if (at && (typeof at.at !== 'undefined')) {
            var atContainer = at.at !== 0 && $('.controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at-1);
            if (atContainer.length) {
               atContainer.after(itemBuildedTpl);
            }
            else {
               atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).eq(at.at);
               if (atContainer.length) {
                  atContainer.before(itemBuildedTpl);
               }
            }
         }
         else {
            targetContainer.append(itemBuildedTpl);
         }
      },

      _fillItemInstances: function () {
         var childControls = this.getChildControls();
         for (var i = 0; i < childControls.length; i++) {
            if (childControls[i].getContainer().hasClass('controls-ListView__item')) {
               var id = childControls[i].getContainer().attr('data-id');
               this._itemsInstances[id] = childControls[i];
            }
         }

      },
       /**
        * Метод получения элементов коллекции.
        * @returns {*}
        * @example
        * <pre>
        *     var ItemsInstances = Menu.getItemsInstances();
        *     for (var i = 0; i < ItemsInstances.length; i++){
        *        ItemsInstances[i].setCaption('Это пункт меню №' + ItemsInstances[i].attr('data-id'));
        *     }
        * </pre>
        */
      getItemsInstances: function () {
         if (Object.isEmpty(this._itemsInstances)) {
            this._fillItemInstances();
         }
         return this._itemsInstances;
      },
       /**
        * Метод получения контрола по идентификатору элемента коллекции.
        * @param {String|Number|*} id Идентификатор элемента коллекции.
        * @returns {*} Возвращает:
        * <ul>
        *    <li>для группы радиокнопок - соответствующую радиокнопку;</li>
        *    <li>для группы флагов - соответствующий флаг;</li>
        *    <li>для меню - соответствующий элемент меню.</li>
        * </ul>
        * @example
        * <pre>
        *     Menu.getItemsInstance(3).setCaption('SomeNewCaption');
        * </pre>
        * @see getItems
        * @see setItems
        * @see items
        * @see getItemInstances
        */
      getItemInstance: function (id) {
         var instances = this.getItemsInstances();
         return instances[id];
      },
      //TODO Сделать публичным? И перенести в другое место
      _hasNextPage: function (hasMore, offset) {
         offset = offset === undefined ? this._offset : offset;
         //n - приходит true, false || общее количество записей в списочном методе
         //Если offset отрицательный, значит запрашивали последнюю страницу
         return offset < 0 ? false : (typeof (hasMore) !== 'boolean' ? hasMore > (offset + this._options.pageSize) : !!hasMore);
      },
      /**
       * Установить что отображается при отсутствии записей.
       * @param html Содержимое блока.
       * @example
       * <pre>
       *     DataGridView.setEmptyHTML('Нет записей');
       * </pre>
       * @see emptyHTML
       */
      setEmptyHTML: function (html) {
         this._options.emptyHTML = html;
      },

      /**
       * Возвращает источник данных.
       * @returns {*}
       */
      getDataSource: function(){
         return this._dataSource;
      },

      _dataLoadedCallback: function () {

      }


   };

   return DSMixin;

});