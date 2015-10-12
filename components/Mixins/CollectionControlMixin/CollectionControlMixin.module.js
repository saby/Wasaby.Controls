/* global define, $ws */
define('js!SBIS3.CONTROLS.CollectionControlMixin', [
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.PagerMore'
], function (Projection, IBindCollection, PagerMore) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с коллекцией элементов
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.CollectionControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var CollectionControlMixin = /**@lends SBIS3.CONTROLS.CollectionControlMixin.prototype  */{
      /**
       * @event onItemAction Уведомляет о необходимости выполнить действие по умолчанию для выбранного элемента
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} item Выбранный элемент
       * @param {Number} at Индекс выбранного элемента
       */

      $protected: {
         _options: {
            /**
             * @typedef {Object} DataSource
             * @property {DataSourceModule} module Модуль, реализующий ISource, например js!SBIS3.CONTROLS.Data.Source.SbisService
             * @property {Object} options Опции конструктора
             */

            /**
             * @typedef {String} DataSourceModule
             * @variant js!SBIS3.CONTROLS.Data.Source.SbisService Источник данных на базе сервиса БЛ СБиС
             * @variant js!SBIS3.CONTROLS.Data.Source.Memory Источник данных в памяти
             */

            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.ISource|DataSource|Function} Источник данных. Если указан, то опция {@link items} не действует.
             * @remark Нужен только для того, чтобы создать SBIS3.CONTROLS.Data.Collection.ISourceLoadable коллекцию в конструкторе. Далее не используется.
             * @example
             * Задаем источник данных декларативно:
             * <pre class="brush:xml">
             *     <options name="dataSource">
             *        <option name="module">js!SBIS3.CONTROLS.Data.Source.SbisService</option>
             *        <options name="options">
             *           <option name="service">Сотрудник</option>
             *        </options>
             *     </options>
             * </pre>
             * Задаем источник данных через функцию:
             * <pre class="brush:xml">
             *     <option name="dataSource" type="function">js!MyApp.SomeEntity.Controller:prototype.getDataSource</option>
             * </pre>
             * @see getDataSource
             * @see setDataSource
             */
            dataSource: undefined,

            /**
             * @cfg {Number} Количество записей на одну страницу, запрашиваемых с источника данных
             * @remark
             * Опция определяет количество запрашиваемых записей с источника данных при использовании постраничной навигации.
             * @example
             * <pre class="brush:xml">
             *     <option name="pageSize">10</option>
             * </pre>
             * @see getPageSize
             * @see setPageSize
             */
            pageSize: undefined,
            
            /**
             * @typedef {String} PageType
             * @variant scroll Загрузка по скроллу
             * @variant more Загрузка по нажатии на кнопку "Показать еще"
             */
            
            /**
             * @cfg {PageType} Вид контроллера постраничной навигации
             * @example
             * <pre class="brush:xml">
             *     <option name="pageType">scroll</option>
             * </pre>
             */
            pageType: 'more',

            /**
             * @cfg {Array} Коллекция, отображаемая контролом
             * @name SBIS3.CONTROLS.CollectionControlMixin#items
             */

            /**
             * @cfg {String|Function} Шаблон разметки каждого элемента списка
             */
            itemTemplate: '',

            /**
             * @cfg {Function} Селектор шаблона разметки для каждого элемента. Если указан, то {@link _itemTemplate} не действует.
             */
            itemTemplateSelector: undefined,

            /**
             * @cfg {String|HTMLElement|jQuery} Что отображается при отсутствии данных
             */
            emptyHTML: ''
         },

         _keysWeHandle: [
            $ws._const.key.up,
            $ws._const.key.down,
            $ws._const.key.space,
            $ws._const.key.enter,
            $ws._const.key.right,
            $ws._const.key.left
         ],

         /**
          * @var {Object} Коллекция, отображаемая контролом (приведенная к внутреннему представлению)
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection} Проекция коллекции
          */
         _itemsProjection: undefined,

         /**
          * @var {Function} Конструктор представления коллекции
          */
         _viewConstructor: undefined,

         /**
          * @var {SBIS3.CONTROLS.CollectionControl.CollectionView} Представление коллекции
          */
         _view: undefined,

         /**
          * @var {Object} Контрол постраничной навигации
          */
         _pager: undefined,

         /**
          * @var {Boolean} Выполнять действие по умолчанию по одинарному клику
          */
         _oneClickAction: true,

         /**
          * @var {Function} Действие по умолчанию для выбранного элемента
          */
         _itemAction: undefined,

         /**
          * @var {Boolean} Изменять позицию при нажатии клавиш со стрелками
          */
         _moveCurrentByKeyPress: true,

         /**
          * @var {Object} Дочерние визуальные компоненты
          */
         _childInstances: undefined,

         /**
          * @var {Function} Обработчик перед загрузкой элементов
          */
         _onBeforeItemsLoad: undefined,

         /**
          * @var {Function} Обработчик после загрузки элементов
          */
         _onAfterItemsLoad: undefined,

         /**
          * @var {Function} Обработчик события изменения коллекции
          */
         _onCollectionChange: undefined,

         /**
          * @var {Function} Обработчик события изменения текущего элемента коллекции
          */
         _onCurrentChange: undefined
      },

      $constructor: function (cfg) {
         this._publish('onItemAction');

         this._onBeforeItemsLoad = onBeforeItemsLoad.bind(this);
         this._onAfterItemsLoad = onAfterItemsLoad.bind(this);
         this._dataLoadedCallback = this._dataLoadedCallback.bind(this);
         this._onCollectionChange = onCollectionChange.bind(this);
         this._onCurrentChange = onCurrentChange.bind(this);

         this._normalizeConfig(cfg);
      },

      //region After- injections

      after: {
         init: function () {
            if ($ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
               (!this._items.isLoaded() || this._items.isQueryChanged())
            ) {
               this._items.load();
            }
         },

         destroy: function () {
            this._unsetItemsEventHandlers();
            if (this._view) {
               this._view.destroy();
            }
         }
      },

      //endregion After- injections

      //region Public methods

      /**
       * Возвращает источник данных
       * @returns {SBIS3.CONTROLS.Data.Source.ISource}
       */
      getDataSource: function () {
         return this._options.dataSource;
      },

      /**
       * Устанавливает источник данных
       * @param {SBIS3.CONTROLS.Data.Source.ISource} source
       * @example
       * <pre>
       *    myListView.setDataSource(new SbisSevice({
       *       service: 'Сотрудники'
       *    }));
       * </pre>
       */
      setDataSource: function (source) {
         this._options.dataSource = source;
         this._setItems(
            this._convertDataSourceToItems(source)
         );
      },

      /**
       * Возвращает количество записей, выводимое на одной странице.
       * @returns {Number}
       * @see pageSize
       * @see setPageSize
       */
      getPageSize: function() {
         return this._options.pageSize;
      },

      /**
       * Устанавливает количество записей, выводимое на одной странице.
       * @param {Number} pageSize Количество записей.
       * @example
       * <pre>
       *     myListView.setPageSize(20);
       * </pre>
       * @see pageSize
       * @see getPageSize
       */
      setPageSize: function(pageSize) {
         if (this._options.pageSize === pageSize) {
            return;
         }
         this._options.pageSize = pageSize;

         if (this._pager) {
            this._pager.setPageSize(pageSize);
         }
      },

      /**
       * Возвращает список, отображаемый контролом
       * @returns {Object}
       */
      getItems: function () {
         return this._items;
      },

      /**
       * Возвращает проекцию списка, отображаемого контролом
       * @returns {SBIS3.CONTROLS.Data.Projection}
       */
      getItemsProjection: function () {
         return this._itemsProjection;
      },

      /**
       * Возвращает дочерние контролы
       * @returns {Object}
       * @example
       * <pre>
       *     $ws.helpers.forEach(menu.getChildInstances(), function (item) {
       *         item.setCaption('Это пункт меню №' + item.attr('data-id'));
       *     });
       * </pre>
       */
      getChildInstances: function () {
         //FIXME: при добавлении элементов во view после рендера, этот кэш станет невалидным
         if (this._childInstances === undefined) {
            this._childInstances = {};
            var childControls = this.getChildControls();
            for (var i = 0; i < childControls.length; i++) {
               var id = childControls[i].getContainer().attr('data-id');
               this._childInstances[id] = childControls[i];
            }
         }

         return this._childInstances;
      },

      /**
       * Возвращает дочерний контрол
       * @param id Идентификатор контрола.
       * @returns {*}
       * @example
       * <pre>
       *     menu.getChildInstance('id123').setCaption('SomeNewCaption');
       * </pre>
       * @see getChildInstances
       */
      getChildInstance: function (id) {
         return this.getChildInstances()[id];
      },

      /**
       * Выполняет перерисовку представления
       */
      redraw: function () {
         if (!this._view) {
            return;
         }
         
         var items = this._getItemsForRedraw();
         this._view.render(items);
         
         if (this._options.pageSize > 0) {
            var collection = $ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Projection') ?
                  items.getCollection() :
                  items;
            if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
               collection.hasMore()
            ) {
               //TODO: перенести в шаблон в новом шаблонизаторе
               this._pager = new PagerMore({
                  element: this._view.getPagerContainer(collection),
                  items: collection,
                  pageSize: this._options.pageSize,
                  pageType: this._options.pageType
               });
            }
         }
         
         this.reviveComponents();
      },

      /**
       * Выполняет перезагрузку элементов {@link items} и перерисовку представления
       */
      reload: function () {
         if (!$ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            throw new Error('Source collection should implement SBIS3.CONTROLS.Data.Collection.ISourceLoadable.');
         }

         this._items.load();
      },

      //endregion Public methods

      //region Protected methods

      //region Collection
      
      /**
       * Приводит объекты, переданные через опции, к внутреннему представлению
       * @private
       */
      _normalizeConfig: function (cfg) {
         cfg = cfg || {};

         if ('dataSource' in cfg) {
            switch (typeof cfg.dataSource) {
               case 'function':
                  this._options.dataSource = cfg.dataSource.call(this);
                  break;
               case 'object':
                  if (!$ws.helpers.instanceOfMixin(cfg.dataSource, 'SBIS3.CONTROLS.Data.Source.ISource') &&
                     'module' in cfg.dataSource
                  ) {
                     var DataSourceConstructor = require(cfg.dataSource.module);
                     this._options.dataSource = new DataSourceConstructor(cfg.dataSource.options || {});
                  }
                  break;
            }
            cfg.items = this._convertDataSourceToItems(this._options.dataSource);
         }

         if (typeof cfg.items === 'function') {
            cfg.items = cfg.items.call(this);
         }

         this._setItems(cfg.items);
      },

      /**
       * Возвращает отображаемую контролом коллекцию, сделанную на основе источника данных
       * @param {SBIS3.CONTROLS.Data.Source.ISource} source
       * @private
       */
      _convertDataSourceToItems: function (source) {
         throw new Error('Method must be implemented');
      },

      /**
       * Конвертирует список, отображаемый контролом, во внутреннее представление
       * @param {Object} items
       * @private
       */
      _convertItems: function (items) {
         return items;
      },

      /**
       * Устанавливает список, отображаемый контролом
       * @param {Object} items
       * @private
       */
      _setItems: function (items) {
         this._unsetItemsEventHandlers();

         items = this._convertItems(items);
         if ($ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Projection')) {
            this._itemsProjection = items;
            this._items = this._itemsProjection.getCollection();
         } else  {
            this._items = items;
            this._itemsProjection = Projection.getDefaultProjection(this._items);
         }

         this._setItemsEventHandlers();

         this._setPagerItems(items);
      },

      /**
       * Подключает обработчики событий элементов
       * @private
       */
      _setItemsEventHandlers: function () {
         this.subscribeTo(this._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.subscribeTo(this._itemsProjection, 'onCurrentChange', this._onCurrentChange);
         
         if (this._items && $ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._items.subscribe('onBeforeCollectionLoad', this._onBeforeItemsLoad);
            this._items.subscribe('onAfterCollectionLoad', this._onAfterItemsLoad);
            this._items.subscribe('onAfterLoadedApply', this._dataLoadedCallback);
         }
      },

      /**
       * Отключает обработчики событий элементов
       * @private
       */
      _unsetItemsEventHandlers: function () {
         this.unsubscribeFrom(this._itemsProjection, 'onCollectionChange', this._onCollectionChange);
         this.unsubscribeFrom(this._itemsProjection, 'onCurrentChange', this._onCurrentChange);
            
         if (this._items && $ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._items.unsubscribe('onBeforeCollectionLoad', this._onBeforeItemsLoad);
            this._items.unsubscribe('onAfterCollectionLoad', this._onAfterItemsLoad);
            this._items.unsubscribe('onAfterLoadedApply', this._dataLoadedCallback);
         }
      },

      /**
       * Возвращает коллекцию для отрисовки в представлении
       * @returns {*}
       */
      _getItemsForRedraw: function () {
         return this._itemsProjection;
      },
      
      //endregion Collection

      //region View
      
      /**
       * Инициализирует представление
       * @private
       */
      _initView: function() {
         var view = this._getView();
 
         if (!$ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.CollectionControl.ICollectionView')) {
            throw new Error('View should implement SBIS3.CONTROLS.CollectionControl.ICollectionView');
         }
         
         this.subscribeTo(view, 'onKeyPressed', this._onKeyPressed.bind(this));
         
         this.redraw();
      },

      /**
       * Возвращает представление
       * @returns {SBIS3.CONTROLS.CollectionControl.CollectionView}
       * @private
       */
      _getView: function () {
         return this._view || (this._view = this._createView());
      },

      /**
       * Создает инстанс представления
       * @returns {SBIS3.CONTROLS.CollectionControl.CollectionView}
       * @private
       */
      _createView: function () {
         return new this._viewConstructor(this._getViewOptions());
      },

      /**
       * Возвращает опции инстанса представления
       * @returns {Object}
       * @private
       */
      _getViewOptions: function () {
         var options = {
            rootNode: this._getViewNode(),
            template: this._getViewTemplate(),
            itemTemplate: this._getItemTemplate(),
            itemTemplateSelector: this._getItemTemplateSelector(),
            emptyHTML: this._options.emptyHTML
         };

         return options;
      },

      /**
       * Возвращает DOM элемент, в котором размещается представление. По умолчанию - контейнер контрола.
       * @returns {jQuery|String}
       * @private
       */
      _getViewNode: function () {
         return this._container;
      },

      /**
       * Возвращает шаблон отображения представления
       * @returns {String|Function}
       * @private
       */
      _getViewTemplate: function() {
         throw new Error('Template must be overwritten');
      },

      /**
       * Возвращает шаблон разметки каждого элемента коллекции (если не указан, то элемент должен уметь строить свою разметку сам)
       * @returns {String|Function}
       * @private
       */
      _getItemTemplate: function() {
         return this._options.itemTemplate;
      },

      /**
       * Возвращает селектор шаблона разметки для каждого элемента. Если указан, то _getItemTemplate не действует
       * @returns {Function}
       * @private
       */
      _getItemTemplateSelector: function() {
         return this._options.itemTemplateSelector;
      },
      
      /**
       * Устанавливает коллекцию для контрола постраничной навигации
       * @private
       */
      _setPagerItems: function(items) {
         if (this._options.pageSize > 0 && this._pager) {
            this._pager.setItems(items.getCollection());
         }
      },
      
      /**
       * Проверяет состояние контрола постраничной навигации
       * @private
       */
      _checkPagerState: function(pager) {
         if (pager && !pager.hasMore()) {
            pager.getContainer().hide();
         }
      },
      
      //endregion View

      //region Behavior
      
      /**
       * Вызывает действие по умолчанию для выбранного элемента
       * @private
       */
      _callItemAction: function(item, at) {
         this._notify(
            'onItemAction',
            item,
            at
         );
      },

      /**
       * Вызывается просле загрузки данных через источник
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} [mode=SBIS3.CONTROLS.Data.Collection.ISourceLoadable.MODE_REPLACE] Режим загрузки
       * @param {Object} items Коллекция, полученная из источника
       * @private
       */
      _dataLoadedCallback: function () {
      },

      /**
       * Обрабатывает событие о нажатии клавиши
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Number} code Код нажатой клавиши
       */
      _onKeyPressed: function (event, code) {
         throw new Error('Method must be implemented');
      }
      
      //endregion Behavior

      //endregion Protected methods
   };

   /**
    * Обрабатывает событие об изменении позиции текущего элемента коллекции
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} newCurrent Новый текущий элемент
    * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem} oldCurrent Старый текущий элемент
    * @param {Number} newPosition Новая позиция
    * @param {Number} oldPosition Старая позиция
    * @private
    */
   var onCurrentChange = function (event, newCurrent, oldCurrent, newPosition, oldPosition) {
      this._view.selectItem(
         newCurrent
      );
   },

   /**
    * Обрабатывает событие об изменении позиции текущего элемента коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem[]} newItems Новые элементы коллеции.
    * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Collection.ICollectionItem[]} oldItems Удаленные элементы коллекции.
    * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      var i;

      switch (action) {
         case IBindCollection.ACTION_ADD:
         case IBindCollection.ACTION_REMOVE:
            for (i = 0; i < oldItems.length; i++) {
               this._view.removeItem(
                  oldItems[i]
               );
            }
            for (i = 0; i < newItems.length; i++) {
               this._view.addItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            this._view.checkEmpty();
            this._checkPagerState(this._pager);
            this.reviveComponents();
            break;

         case IBindCollection.ACTION_MOVE:
            for (i = 0; i < newItems.length; i++) {
               this._view.moveItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            this.reviveComponents();
            break;

         case IBindCollection.ACTION_REPLACE:
         case IBindCollection.ACTION_UPDATE:
            for (i = 0; i < newItems.length; i++) {
               this._view.updateItem(
                  newItems[i]
               );
            }
            this._view.selectItem(
               this._itemsProjection.getCurrent(),
               this._itemsProjection.getCurrentPosition()
            );
            this.reviveComponents();
            break;

         case IBindCollection.ACTION_RESET:
            this.redraw();
            break;
      }
   },
   
   /**
    * Обработчик перед загрузкой элементов
    * @private
    */
   onBeforeItemsLoad = function (event, mode, target) {
      if (this._view) {
         this._view.showLoadingIndicator(target);
      }
   },

   /**
    * Обработчик после загрузки элементов
    * @private
    */
   onAfterItemsLoad = function (event, mode, dataSet, target) {
      if (this._view) {
         this._view.hideLoadingIndicator(target);
      }
   };

   return CollectionControlMixin;
});
