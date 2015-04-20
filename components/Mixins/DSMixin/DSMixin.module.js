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

   var setDataSourceCB = function () {
      this.reload();
   };

   var DSMixin = /**@lends SBIS3.CONTROLS.DSMixin.prototype  */{
      $protected: {
         _itemsInstances: {},
         _filter: undefined,
         _sorting: undefined,
         _offset: 0,
         _limit: undefined,
         _dataSource: undefined,
         _setDataSourceCB: null, //чтобы подписки отрабатывали всегда
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
            keyField: null,
            items: undefined,
            /**
             * @cfg {DataSource} Набор исходных данных по которому строится отображение
             */
            dataSource: undefined,
            pageSize: null
         }
      },

      $constructor: function () {
         this._publish('onDrawItems');
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


         this._setDataSourceCB = setDataSourceCB.bind(this);
         this._dataSource.subscribe('onDataSync', this._setDataSourceCB);
      },

      setDataSource: function (ds) {
         this._dataSource.unsubscribe('onDataSync', this._setDataSourceCB);
         this._dataSource = ds;
         this.reload();
         this._dataSource.subscribe('onDataSync', this._setDataSourceCB);
      },

      reload: function (filter, sorting, offset, limit) {
         if (this._options.pageSize) {
            this._limit = this._options.pageSize;
         }
         var self = this;
         this._filter = typeof(filter) != 'undefined' ? filter : this._filter;
         this._sorting = typeof(sorting) != 'undefined' ? sorting : this._sorting;
         this._offset = typeof(offset) != 'undefined' ? offset : this._offset;
         this._limit = typeof(limit) != 'undefined' ? limit : this._limit;
         this._dataSource.query(this._filter, this._sorting, this._offset, this._limit).addCallback(function (dataSet) {
            if (self._dataSet) {
               self._dataSet.merge(dataSet);
            } else {
               self._dataSet = dataSet;
            }
            self._redraw();
         });
      },
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
         //TODO совместимость
         if (typeof(window) != 'undefined') {
            console['log']('Метод setItems устарел. Он прекратит работу в версии 3.7.2');
         }
      },

      _drawItemsCallback: function () {
         /*Method must be implemented*/
      },

      _redraw: function () {
         this._clearItems();
         var
            self = this,
            DataSet = this._dataSet;

         DataSet.each(function (item, key, i, parItem, lvl) {
            var
               targetContainer = self._getTargetContainer(item, key, parItem, lvl);
            if (targetContainer) {
               self._drawItem(item, targetContainer, key, i, parItem, lvl);
            }
         });

         self.reviveComponents().addCallback(function () {
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });
      },

      _drawItems: function (records) {
         var self = this;
         if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
               var
                  targetContainer = this._getTargetContainer(records[i], records[i].getKey());
               if (targetContainer) {
                  this._drawItem(records[i], targetContainer, records[i].getKey(), i);
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
      _getTargetContainer: function () {
         //по стандарту все строки рисуются в itemsContainer
         return this._getItemsContainer();
      },

      //метод отдающий контейнер в котором надо отрисовывать элементы
      _getItemsContainer: function () {
         return this._container;
      },

      _drawItem: function (item, targetContainer) {

         this._createItemInstance(item, targetContainer);
      },

      _getItemTemplate: function () {
         throw new Error('Method _getItemTemplate() must be implemented')
      },

      _addItemClasses: function (container, key) {
         container.attr('data-id', key).addClass('controls-ListView__item');
      },

      _createItemInstance: function (item, targetContainer) {
         var
            key = item.getKey(),
            itemTpl = this._getItemTemplate(item),
            container, dotTemplate;

         if (typeof itemTpl == 'string') {
            dotTemplate = itemTpl;
         }
         else if (itemTpl instanceof Function) {
            dotTemplate = itemTpl(item);
         }

         if (typeof dotTemplate == 'string') {
            container = $(MarkupTransformer(doT.template(dotTemplate)(item)));
            this._addItemClasses(container, key);
            targetContainer.append(container);
         }
         else {
            throw new Error('Шаблон должен быть строкой');
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

      getItemsInstances: function () {
         if (Object.isEmpty(this._itemsInstances)) {
            this._fillItemInstances();
         }
         return this._itemsInstances;
      },

      getItemInstance: function (id) {
         var instances = this.getItemsInstances();
         return instances[id];
      },
      _hasNextPage: function (hasMore) {
         //n - приходит true, false || общее количество записей в списочном методе
         return typeof (hasMore) !== 'boolean' ? hasMore > this._offset : !!hasMore;
      }

   };

   return DSMixin;

});