define('js!SBIS3.CONTROLS.DSMixin', [
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CORE.MarkupTransformer'
], function (StaticSource, ArrayStrategy, MarkupTransformer) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

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
        */
       /**
        * @event onDataLoad При загрузке данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Array} dataSet Набор данных.
        * @example
        * <pre>
        *     myComboBox.subscribe('onDataLoad', function(eventObject) {
        *        title.setText('Загрузка прошла успешно');
        *     });
        * </pre>
        */
      $protected: {
         _itemsInstances: {},
         _filter: undefined,
         _sorting: undefined,
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            /**
             * @cfg {String} Поле элемента коллекции, которое является ключом
             * @example
             * <pre>
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             */
            keyField : null,
            /**
             * @cfg {String} Название поля из набора, отображающее данные
             * @example
             * <pre>
             *     <option name="displayField">Название</option>
             * </pre>
             */
            displayField: null,
             /**
              * @cfg {Items[]} Набор исходных данных, по которому строится отображение
              * @example
              * <pre>
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
              *            <option name="parent">2</option>
              *            <option name="icon">sprite:icon-16 icon-Birthday icon-primary</option>
              *         </options>
              *      </options>
              * </pre>
              * @see keyField
              */
            items: [],
            /**
             * @cfg {DataSource} Набор исходных данных, по которому строится отображение
             * @see setDataSource
             */
            dataSource: undefined,
             /**
              * @cfg {Number} Количество записей на странице
              * <pre>
              *     <option name="pageSize">10</option>
              * </pre>
              * @see setPageSize
              */
            pageSize: null,
            /**
             * cfg {Object} Настройка группировки записей. Если задать только поле записи(field), то будет группировать по типу лесенки.
             * Т.е. перед каждым блоком с одинаковыми данными будет создавать блок, для которого можно указать шаблон
             * Внимание! Для правильной работы группировки данные уже должны прийти отсортированные!
             * @example
             * <pre>
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *    </options>
             * </pre>
             * @example
             * <pre>
             *    <options name="groupBy">
             *        <option name="field">ДатаВремя</option>
             *         <option name="method" type="function">js!SBIS3.CONTROLS.Demo.MyListViewDS:prototype.myGroupBy</option>
             *    </options>
             * </pre>
             */
            groupBy : {},
            /**
             * @cfg {String|HTMLElement|jQuery} что отображается при отсутствии данных 
             */
            emptyHTML: ''
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
            if (this._options.items) {
               if (this._options.items instanceof Array) {
                  items = this._options.items;
               }
               else {
                  throw new Error('Array expected');
               }
            }
            else {
               items = [];
            }
            var
               item = items[0];
            if (!this._options.keyField) {
              if (item && Object.prototype.toString.call(item) === '[object Object]') {
                this._options.keyField = Object.keys(item)[0];
              }
            }
            this._dataSource = new StaticSource({
               data: items,
               strategy: new ArrayStrategy(),
               keyField: this._options.keyField
            });
         }
      },
       /**
        * Метод установки либо замены источника данных, установленного опцией {@link dataSource}.
        * @param ds Новый источник данных.
        * @example
        * <pre>
        *     var arrayOfObj = [
        *        {'@Заметка': 1, 'Содержимое': 'Пункт 1', 'Завершена': false},
        *        {'@Заметка': 2, 'Содержимое': 'Пункт 2', 'Завершена': false},
        *        {'@Заметка': 3, 'Содержимое': 'Пункт 3', 'Завершена': true}
        *     ];
        *     var ds1 = new StaticSource({
        *        data: arrayOfObj,
        *        keyField: '@Заметка',
        *        strategy: ArrayStrategy
        *     });
        *     this.getChildControlByName("ComboBox 1").setDataSource(ds1);
        * </pre>
        * @see dataSource
        */
      setDataSource: function (ds) {
         this._dataSource = ds;
         this._dataSet = null;
         this.reload();
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
       */
      getDataSet: function() {
         return this._dataSet;
      },       /**
        * Метод перезагрузки данных.
        * Можно задать фильтрацию, сортировку.
        * @param {String} filter Параметры фильтрации.
        * @param {String} sorting Параметры сортировки.
        * @param offset Элемент, с которого перезагружать данные.
        * @param {Number} limit Ограничение количества перезагружаемых элементов.
        */
      reload: function (filter, sorting, offset, limit) {
         if (this._options.pageSize) {
            this._limit = this._options.pageSize;
         }
         var def = new $ws.proto.Deferred();
         var self = this;
         this._cancelLoading();
         this._filter = typeof(filter) != 'undefined' ? filter : this._filter;
         this._sorting = typeof(sorting) != 'undefined' ? sorting : this._sorting;
         this._offset = typeof(offset) != 'undefined' ? offset : this._offset;
         this._limit = typeof(limit) != 'undefined' ? limit : this._limit;
         this._toggleIndicator(true);
         this._loader = this._dataSource.query(this._filter, this._sorting, this._offset, this._limit).addCallback(function (dataSet) {
            self._notify('onDataLoad', dataSet);
            self._toggleIndicator(false);
            self._loader = null;//Обнулили без проверки. И так знаем, что есть и загрузили
            if (self._dataSet) {
               self._dataSet.setRawData(dataSet.getRawData());
               self._dataSet.setMetaData(dataSet.getMetaData());
            } else {
               self._dataSet = dataSet;
            }
            self._dataLoadedCallback();
            //self._notify('onBeforeRedraw');
            def.callback(dataSet);
            self._redraw();
         });
         return def;
      },
      _toggleIndicator:function(){
         /*Method must be implemented*/
      },
       /**
        * Метод установки количества элементов на одной странице.
        * @param pageSize Количество записей.
        * @example
        * <pre>
        *     myListView.setPageSize(20);
        * </pre>
        * @see pageSize
        */
      setPageSize: function(pageSize){
         this._options.pageSize = pageSize;
         this._dropPageSave();
         this.reload(this._filter, this._sorting, 0, pageSize);
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
       /**
        * Метод установки либо замены коллекции элементов, заданной опцией {@link items}.
        * @param {Object} items Набор исходных данных, по которому строится отображение.
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
        */
      setItems: function (items) {
         //TODO Сделать метод для очистки всех Items, ибо setItems([]) - не очевидно
         var
            item = items[0],
            keyField;

         if (this._options.keyField) {
            keyField = this._options.keyField;
         }
         else {
            if (item && Object.prototype.toString.call(item) === '[object Object]') {
               keyField = Object.keys(item)[0];
            }
         }
         this._dataSource = new StaticSource({
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
         var emptyHTML;
         if (this._dataSet) {
            this._clearItems();
            var records = this._getRecordsForRedraw(),
              container = this._getItemsContainer();
            if (!records.length && this._options.emptyHTML) {
                emptyHTML = $('<span></span>').append(this._options.emptyHTML).addClass(' controls-ListView__EmptyData');
              $('.controls-ListView__EmptyData', container).remove();
              container.append(emptyHTML);
            } else {
              $('.controls-ListView__EmptyData', container).remove();
            }
            this._drawItems(records);
         }
      },
      _destroySearchPathSelectors: function(){
      },
      _getRecordsForRedraw : function() {
         return this._dataSet._getRecords();
      },

      _drawItems: function (records, at) {
         var
            self = this,
            curAt = at;
         if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
               this._drawItem(records[i], curAt);

               if (curAt && curAt.at) {
                  curAt.at++;
               }
            }
            this.reviveComponents().addCallback(function () {
               self._notify('onDrawItems');
               self._drawItemsCallback();
            });
         }
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

         var itemsContainers = $(".controls-ListView__item", container.get(0));
         /*Удаляем вложенные компоненты*/
         $('[data-component]', itemsContainers).each(function (i, item) {
            var inst = $(item).wsControl();
            inst.destroy();
         });

         /*Удаляем сами items*/
         itemsContainers.remove();
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

      _drawItem: function (item, at) {
         var
            targetContainer,
            itemInstance;
         //Запускаем группировку если она есть. Иногда результат попадает в группровку и тогда отрисовывать item не надо
         if (this._group(item, at) !== false) {
            targetContainer = this._getTargetContainer(item);
            itemInstance = this._createItemInstance(item, targetContainer, at);
            this._addItemAttributes(itemInstance, item);
            this._appendItemTemplate(item, targetContainer, itemInstance, at);
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
      _group: function(item, at){
         var groupBy = this._options.groupBy,
               resultGroup,
               drawGroup,
               drawItem = true;
         if (!Object.isEmpty(groupBy)){
            resultGroup = groupBy.method.apply(this, [item, at]);
            drawGroup = typeof resultGroup === 'boolean' ? resultGroup : (resultGroup instanceof Object && resultGroup.hasOwnProperty('drawGroup') ? !!resultGroup.drawGroup : false);
            drawItem = resultGroup instanceof Object && resultGroup.hasOwnProperty('drawItem') ? !!resultGroup.drawItem : true;
            if (drawGroup){
               this._drawGroup(item, at)
            }
         }
         return drawItem;
      },
      _drawGroup: function(item, at){
         var
               groupBy = this._options.groupBy,
               tplOptions = {
                  columns : $ws.core.clone(this._options.columns),
                  multiselect : this._options.multiselect,
                  hierField: this._options.hierField + '@'
               },
               targetContainer,
               itemInstance;
         targetContainer = this._getTargetContainer(item);
         tplOptions.item = item;
         tplOptions.colspan = this._options.columns.length + this._options.multiselect;
         itemInstance = this._buildTplItem(item, groupBy.template(tplOptions));
         this._appendItemTemplate(item, targetContainer, itemInstance, at);
         //Сначала положим в дом, потом будем звать рендеры, иначе контролы, которые могут создать в рендере неправмльно поймут свою ширину
         if (groupBy.render && typeof groupBy.render === 'function') {
            groupBy.render.apply(this, [item, itemInstance]);
         }

      },
      /**
       * Установка группировки элементов. Если нужно, чтобы стандартаная группировка для этого элемента не вызывалась -
       * нужно обязательно переопределить(передать) все опции (field, method, template, render) иначе в группировку запишутся стандартные параметры.
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
      },

      _createItemInstance: function (item, targetContainer, at) {
         return this._buildTplItem(item, this._getItemTemplate(item));
      },
      _buildTplItem: function(item, itemTpl){
         var
               buildedTpl,
               dotTemplate;
         if (typeof itemTpl == 'string') {
            dotTemplate = itemTpl;
         }
         else if (typeof itemTpl == 'function') {
            dotTemplate = itemTpl(this._buildTplArgs(item));
         }

         if (typeof dotTemplate == 'string') {
            buildedTpl = $(MarkupTransformer(doT.template(dotTemplate)(this._buildTplArgs(item))));
            return buildedTpl;
         }
         else {
            throw new Error('Шаблон должен быть строкой');
         }
      },
      _buildTplArgs: function(item) {
         return {
            item: item
         };
      },
      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl, at) {
         if (at && (typeof at.at !== 'undefined')) {
            var atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).get(at.at-1);
            if ($(atContainer).length) {
               $(atContainer).after(itemBuildedTpl);
            }
            else {
               atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).get(at.at);
               if ($(atContainer).length) {
                  $(atContainer).before(itemBuildedTpl);
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
        * Метод получения элемента коллекции.
        * @param id Идентификатор элемента коллекции.
        * @returns {*} Возвращает элемент коллекции по указанному идентификатору.
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
         return typeof (hasMore) !== 'boolean' ? hasMore > (offset + this._options.pageSize) : !!hasMore;
      },

      _dataLoadedCallback: function () {

      }


   };

   return DSMixin;

});