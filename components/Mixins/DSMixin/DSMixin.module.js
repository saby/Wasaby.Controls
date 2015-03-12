define('js!SBIS3.CONTROLS.DSMixin', [
   'js!SBIS3.CONTROLS.DataSourceMemory',
   'js!SBIS3.CONTROLS.DataStrategyArray',
   'js!SBIS3.CORE.MarkupTransformer'
], function (DataSourceMemory, DataStrategyArray, MarkupTransformer) {

   /**
    * Миксин, задающий любому контролу поведение работы с набором однотипных элементов.
    * @mixin SBIS3.CONTROLS.DSMixin
    */

   var setDataSourceCB = function () {
      this.reload();
   };

   var DSMixin = /**@lends SBIS3.CONTROLS.DSMixin.prototype  */{
      $protected: {
         _itemsInstances: {},
         _filter: undefined,
         _sorting: undefined,
         _offset: undefined,
         _limit: undefined,
         _dataSource: undefined,
         _setDataSourceCB: null, //чтобы подписки отрабатывали всегда
         _dataSet: null,
         _dotItemTpl: null,
         _options: {
            items: undefined,
            /**
             * @cfg {DataSource} Набор исходных данных по которому строится отображение
             */
            dataSource: undefined
         }
      },

      $constructor: function () {
         this._publish('onDrawItems');
         //Для совместимости пока делаем Array

         //TODO совместимость
         if (this._options.items) {
            if (this._options.items instanceof Array) {
               this._options.dataSource = this._options.items;
            }
            else {
               //TODO: как-то надо по другому
               this._options.dataSource = this._options.items;
            }
            if (typeof(window) != 'undefined') {
               console['log']('Опция items устарела. Она прекратит работу в версии 3.7.2');
            }
         }

         //TODO совместимость
         if (this._options.dataSource instanceof Array) {
            var
               item = this._options.dataSource[0],
               keyField;
            if (item && Object.prototype.toString.call(item) === '[object Object]') {
               keyField = Object.keys(item)[0];
            }
            this._dataSource = new DataSourceMemory({
               data: this._options.dataSource,
               strategy: new DataStrategyArray(),
               keyField: keyField
            });
            if (typeof(window) != 'undefined') {
               console['log']('В опции dataSource надо передавать экземпляр класса DataSource. Array прекратит работу в версии 3.7.2');
            }
         }
         else {
            this._dataSource = this._options.dataSource;
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
         var self = this;
         this._filter = typeof(filter) != 'undefined' ? filter : this._filter;
         this._sorting = typeof(sorting) != 'undefined' ? sorting : this._sorting;
         this._offset = typeof(offset) != 'undefined' ? offset : this._offset;
         this._limit = typeof(filter) != 'undefined' ? limit : this._limit;
         this._dataSource.query(this._filter, this._sorting, this._offset, this._limit).addCallback(function (DataSet) {
            self._dataSet = DataSet;
            self._drawItems();
         });
      },

      setItems: function (items) {
         var
            item = items[0],
            keyField;
         if (item && Object.prototype.toString.call(item) === '[object Object]') {
            keyField = Object.keys(item)[0];
         }
         this._dataSource = new DataSourceMemory({
            data: items,
            strategy: new DataStrategyArray(),
            keyField: keyField
         });
         this._drawItems();
         //TODO совместимость
         if (typeof(window) != 'undefined') {
            console['log']('Метод setItems устарел. Он прекратит работу в версии 3.7.2');
         }
      },

      _drawItemsCallback: function () {

      },

      _drawItems: function () {
         if (!Object.isEmpty(this._itemsInstances)) {
            for (var i in this._itemsInstances) {
               if (this._itemsInstances.hasOwnProperty(i)) {
                  this._itemsInstances[i].destroy();
               }
            }
         }
         this._itemsInstances = {};


         var
            self = this,
            DataSet = this._dataSet,
            targetContainersList = [];

         DataSet.each(function (item, key, i, parItem, lvl) {
            var
               targetContainer = self._getTargetContainer(item, key, parItem, lvl);

            if (Array.indexOf(targetContainersList, targetContainer.get(0)) < 0) {
               targetContainer.empty();
               targetContainersList.push(targetContainer.get(0));
            }
            self._drawItem(item, targetContainer, key, i, parItem, lvl);
         });

         self.reviveComponents().addCallback(function () {
            self._notify('onDrawItems');
            self._drawItemsCallback();
         });
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
      }

   };

   return DSMixin;

});