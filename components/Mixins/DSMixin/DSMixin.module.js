define('js!SBIS3.CONTROLS.DSMixin', [
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CORE.MarkupTransformer'
], function (StaticSource, ArrayStrategy, MarkupTransformer) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    * @public
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
        * @see items
        * @see displayField
        */
       /**
        * @event onDataLoad При загрузке данных
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {Array} dataSet Набор данных.
        * @example
        * <pre>
        *     myComboBox.subscribe('onDataLoad', function(eventObject) {
        *        caption.setText('Загрузка прошла успешно');
        *     });
        * </pre>
        * @see items
        * @see setDataSource
        * @see getDataSource
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
             * @remark
             * Выбранный элемент в коллекции задаётся указанием ключа элемента.
             * @example
             * <pre>
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             * @see SBIS3.CONTROLS.Selectable#selectedKey
             * @see SBIS3.CONTROLS.Selectable#setSelectedKey
             * @see SBIS3.CONTROLS.Selectable#getSelectedKey
             */
            keyField : null,
            /**
             * @cfg {String} Поле элемента коллекции, из которого отображать данные
             * @example
             * <pre>
             *     <option name="displayField">Название</option>
             * </pre>
             * @see keyField
             */
            displayField: null,
             /**
              * @cfg {Items[]} Набор исходных данных, по которому строится отображение
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
              * @see getDataSource
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
              * Опция задаёт количество записей при построении представления данных.
              * В случае дерева и иерархии:
              * <ul>
              *    <li>при пейджинге по скроллу опция также задаёт количество подгружаемых записей кликом по кнопке "Ещё";</li>
              *    <li>как листья, так и узлы являются записями, количество записей считается относительно полностью
              *    развёрнутого представления данных. Например, узел с тремя листьями - это 4 записи.</li>
              * </ul>
              * <pre>
              *     <option name="pageSize">10</option>
              * </pre>
              * @see setPageSize
              */
            pageSize: null,
            /**
             * @cfg {String|HTMLElement|jQuery} Что отображается при отсутствии данных
             * @example
             * <pre>
             *     <option name="emptyHTML">Нет данных</option>
             * </pre>
             * @remark
             * Опция задаёт текст, отображаемый как при абсолютном отсутствии данных, так и в результате фильтрации.
             * @see items
             * @see setDataSource
             */
            emptyHTML: ''
         },
         _loader: null
      },

      $constructor: function () {
         this._publish('onDrawItems', 'onDataLoad');
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
         }
      },
       /**
        * Метод установки источника данных.
        * @param ds Новый источник данных.
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
      reload: function (filter, sorting, offset, limit) {
         if (this._options.pageSize) {
            this._limit = this._options.pageSize;
         }
         var self = this;
         this._cancelLoading();
         this._filter = typeof(filter) != 'undefined' ? filter : this._filter;
         this._sorting = typeof(sorting) != 'undefined' ? sorting : this._sorting;
         this._offset = typeof(offset) != 'undefined' ? offset : this._offset;
         this._limit = typeof(limit) != 'undefined' ? limit : this._limit;
         this._loader = this._dataSource.query(this._filter, this._sorting, this._offset, this._limit).addCallback(function (dataSet) {
            self._notify('onDataLoad', dataSet);
            self._loader = null;//Обнулили без проверки. И так знаем, что есть и загрузили
            if (self._dataSet) {
               self._dataSet.setRawData(dataSet.getRawData());
            } else {
               self._dataSet = dataSet;
            }
            self._dataLoadedCallback();
            //self._notify('onBeforeRedraw');
            self._redraw();
         });
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
        * Метод установки либо замены коллекции элементов, заданных опцией {@link items}.
        * @param {Object} items Набор новых данных, по которому строится отображение.
        * @example
        * <pre>
        *     setItems: [
        *        {
        *           id: 1,
        *           caption: 'Сообщения'
        *        },{
        *           id: 2,
        *           caption: 'Прочитанные',
        *           parent: 1
        *        },{
        *           id: 3,
        *           caption: 'Непрочитанные',
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

      _getRecordsForRedraw : function() {
         var records = [];
         this._dataSet.each(function (record) {
            records.push(record);
         });
         return records;
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
         targetContainer = this._getTargetContainer(item);
         itemInstance = this._createItemInstance(item, targetContainer, at);
         this._addItemAttributes(itemInstance, item);
         this._appendItemTemplate(item, targetContainer, itemInstance, at);
      },

      _getItemTemplate: function () {
         throw new Error('Method _getItemTemplate() must be implemented');
      },

      _addItemAttributes: function (container, item) {
         var isFolder = (item.get(this._options.hierField + '@')) ? 'controls-ListView__folder' : '';
         container.attr('data-id', item.getKey()).addClass('controls-ListView__item ' + isFolder);
      },

      _createItemInstance: function (item, targetContainer, at) {
         var
            buildedTpl,
            dotTemplate,
            itemTpl = this._getItemTemplate(item);

         if (typeof itemTpl == 'string') {
            dotTemplate = itemTpl;
         }
         else if (typeof itemTpl == 'function') {
            dotTemplate = itemTpl(item);
         }

         if (typeof dotTemplate == 'string') {
            buildedTpl = $(MarkupTransformer(doT.template(dotTemplate)(item)));
            return buildedTpl;
         }
         else {
            throw new Error('Шаблон должен быть строкой');
         }
      },

      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl, at) {
         if (at && (typeof at.at !== 'undefined')) {
            var atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).get(at.at);
            if ($(atContainer).length) {
               $(atContainer).before(itemBuildedTpl);
            }
            else {
               atContainer = $('.controls-ListView__item', this._getItemsContainer().get(0)).get(at.at - 1);
               if ($(atContainer).length) {
                  $(atContainer).after(itemBuildedTpl);
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
      _hasNextPage: function (hasMore) {
         //n - приходит true, false || общее количество записей в списочном методе
         return typeof (hasMore) !== 'boolean' ? hasMore > (this._offset + this._options.pageSize) : !!hasMore;
      },

      _dataLoadedCallback: function () {

      }


   };

   return DSMixin;

});