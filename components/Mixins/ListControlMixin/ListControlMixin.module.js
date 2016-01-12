/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControlMixin', [
   'js!SBIS3.CONTROLS.ListControl.View',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableList',
   'html!SBIS3.CONTROLS.ListControl.View',
   'js!SBIS3.CONTROLS.PagerMore',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Projection.Collection'
], function (ListView, IBindCollection, ObservableList, LoadableList, ListViewTemplate, PagerMore, Projection) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с нетипизированным списком
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.ListControlMixin
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */
   var ListControlMixin = /**@lends SBIS3.CONTROLS.ListControlMixin.prototype  */{
      /**
       * @event onItemAction Уведомляет о необходимости выполнить действие по умолчанию для выбранного элемента
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} item Выбранный элемент
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} collectionItem Обертка выбранного элемента
       */

      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.ListControl.IListItems|Array} Список, отображаемый контролом
             * @name SBIS3.CONTROLS.ListControlMixin#items
             */

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
             * @cfg {DataSource|SBIS3.CONTROLS.Data.Source.ISource|Function} Источник данных. Если указан, то опция {@link items} не действует.
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
             * @cfg {Number} Количество записей на одну страницу, запрашиваемое с источника данных
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
             * @cfg {SBIS3.CONTROLS.PagerMore#PagerType} Вид контроллера постраничной навигации. По умолчанию - scroll
             */
            pagerType: 'scroll',

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
          * @var {Boolean} Инициализация контрола завершена
          */
         _isInitialized: false,

         /**
          * @var {SBIS3.CONTROLS.Data.Collection.IList} Список, отображаемый контролом
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Collection} Проекция списка
          */
         _itemsProjection: undefined,

         /**
          * @var {Function} Конструктор представления коллекции
          */
         _viewConstructor: ListView,

         /**
          * @var {SBIS3.CONTROLS.ListControl.View} Представление списка
          */
         _view: undefined,

         /**
          * @var {SBIS3.CONTROLS.Collection.IListItem} Элемент, над которым находится указатель
          */
         _hoveredItem: undefined,

         /**
          * @var {Object} Контрол постраничной навигации
          */
         _pager: undefined,

         /**
          * @var {Object} Дочерние визуальные компоненты
          */
         _childInstances: undefined,

         /**
          * @var {Boolean} Выполнять действие по умолчанию по одинарному клику
          */
         _oneClickAction: true,

         /**
          * @var {Boolean} Изменять позицию при нажатии клавиш со стрелками
          */
         _moveCurrentByKeyPress: true,

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
          * @var {Function} Обработчик события изменения элемента коллекции
          */
         _onCollectionItemChange: undefined,

         /**
          * @var {Function} Обработчик события изменения текущего элемента коллекции
          */
         _onCurrentChange: undefined
      },

      $constructor: function (cfg) {
         this._publish('onItemAction');

         this._bindHandlers();
         this._normalizeConfig(cfg);
      },

      //region After- injections

      after: {
         init: function() {
            this._isInitialized = true;
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
         this.setItems(
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
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       */
      getItems: function () {
         return this._items;
      },

      /**
       * Устанавливает список, отображаемый контролом
       * @param {Array|SBIS3.CONTROLS.Data.Collection.IEnumerable} items
       */
      setItems: function(items) {
         this._setItems(items);
         this.redraw();
      },

      /**
       * Возвращает проекцию списка, отображаемого контролом
       * @returns {SBIS3.CONTROLS.Data.Projection.Collection}
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
            var collection = $ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Projection') ?
               items.getCollection() :
               items;
            if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
               collection.hasMore()
            ) {
               //TODO: перенести в шаблон в новом шаблонизаторе
               this._pager = new PagerMore({
                  element: this._view.getPagerContainer(collection),
                  parent: this,
                  items: collection,
                  pageSize: this._options.pageSize,
                  pagerType: this._options.pagerType,
                  visibleParentSelector: this._view.getPagerContainerSelector()
               });
            }
         }

         if (this._isInitialized) {
            this.reviveComponents();
         }
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

      /**
       * Настраивает контекст обработчиков
       * @private
       */
      _bindHandlers: function () {
         this._onBeforeItemsLoad = onBeforeItemsLoad.bind(this);
         this._onAfterItemsLoad = onAfterItemsLoad.bind(this);
         this._dataLoadedCallback = this._dataLoadedCallback.bind(this);
         this._onCollectionChange = onCollectionChange.bind(this);
         this._onCollectionItemChange = onCollectionItemChange.bind(this);
         this._onCurrentChange = onCurrentChange.bind(this);
      },

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
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       * @private
       */
      _convertDataSourceToItems: function (source) {
         return new LoadableList({
            source: source
         });
      },

      /**
       * Конвертирует список, отображаемый контролом, во внутреннее представление
       * @param {Object} items
       * @returns {SBIS3.CONTROLS.Data.Collection.IList}
       * @private
       */
      _convertItems: function (items) {
         items = items || [];
         if (items instanceof Array) {
            items = new ObservableList({
               items: items
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Items should implement SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         return items;
      },

      /**
       * Устанавливает список, отображаемый контролом
       * @param {Object} items
       * @private
       */
      _setItems: function (items) {
         this._unsetItemsEventHandlers();

         if ($ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Projection')) {
            this._itemsProjection = items;
            this._items = this._convertItems(this._itemsProjection.getCollection());
         } else  {
            this._items = this._convertItems(items);
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
         this.subscribeTo(this._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
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
         this.unsubscribeFrom(this._itemsProjection, 'onCollectionItemChange', this._onCollectionItemChange);
         this.unsubscribeFrom(this._itemsProjection, 'onCurrentChange', this._onCurrentChange);

         if (this._items && $ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable')) {
            this._items.unsubscribe('onBeforeCollectionLoad', this._onBeforeItemsLoad);
            this._items.unsubscribe('onAfterCollectionLoad', this._onAfterItemsLoad);
            this._items.unsubscribe('onAfterLoadedApply', this._dataLoadedCallback);
         }
      },

      //endregion Collection

      //region View

      /**
       * Инициализирует представление
       * @private
       */
      _initView: function() {
         var view = this._getView();
         if (!$ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.ListControl.IView')) {
            throw new Error('View should implement SBIS3.CONTROLS.ListControl.IView');
         }

         this.subscribeTo(view, 'onItemHovered', this._onItemHovered.bind(this));
         this.subscribeTo(view, 'onItemClicked', this._onItemClicked.bind(this));
         this.subscribeTo(view, 'onItemDblClicked', this._onItemDblClicked.bind(this));

         this.redraw();

         if ($ws.helpers.instanceOfMixin(this._items, 'SBIS3.CONTROLS.Data.Collection.ISourceLoadable') &&
            (!this._items.isLoaded() || this._items.isQueryChanged())
         ) {
            this._items.load();
         }
      },

      /**
       * Возвращает представление
       * @returns {SBIS3.CONTROLS.ListControl.View}
       * @private
       */
      _getView: function () {
         return this._view || (this._view = this._createView());
      },

      /**
       * Создает инстанс представления
       * @returns {SBIS3.CONTROLS.ListControl.View}
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
            pagerType: this._options.pagerType,
            emptyHTML: this._options.emptyHTML
         };

         return options;
      },

      /**
       * Возвращает DOM элемент, в котором размещается представление. По умолчанию - контейнер контрола.
       * @returns {jQuery}
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
         return ListViewTemplate;
      },

      /**
       * Возвращает коллекцию для отрисовки в представлении
       * @returns {*}
       * @private
       */
      _getItemsForRedraw: function () {
         return this._itemsProjection;
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
       * @param {SBIS3.CONTROLS.Data.Projection.Collection} items
       * @private
       */
      _setPagerItems: function(items) {
         if (this._pager) {
            this._pager.setItems(items.getCollection());
         }
      },

      //endregion View

      //region Behavior

      _keyboardHover: function (e) {
         switch (e.which) {
            case $ws._const.key.enter:
               if (this._itemsProjection.getCurrent()) {
                  this._itemAction(this._itemsProjection.getCurrent());
               }
               break;
            case $ws._const.key.space:
               if (this._moveCurrentByKeyPress) {
                  this._itemsProjection.moveToNext();
               }
               break;
            case $ws._const.key.left:
               if (this._moveCurrentByKeyPress && this._view.isHorizontal()) {
                  this._itemsProjection.moveToPrevious();
               }
               break;
            case $ws._const.key.right:
               if (this._moveCurrentByKeyPress && this._view.isHorizontal()) {
                  this._itemsProjection.moveToNext();
               }
               break;
            case $ws._const.key.up:
               if (this._moveCurrentByKeyPress && !this._view.isHorizontal()) {
                  this._itemsProjection.moveToPrevious();
               }
               break;
            case $ws._const.key.down:
               if (this._moveCurrentByKeyPress && !this._view.isHorizontal()) {
                  this._itemsProjection.moveToNext();
               }
               break;
         }

         return false;
      },

      /**
       * Обрабатывает событие о нахождении указателя над элементом коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на который произошло наведение указателя
       * @param {Boolean} isHover Указатель наведен или ушел за пределы конейнера элемента
       * @param {Element} item DOM элемент
       * @private
       */
      _onItemHovered: function (event, hash, isHover, item) {
         if (this._canChangeHoveredItem(hash, isHover, item)) {
            this._hoveredItem = isHover ? this._itemsProjection.getByHash(hash) : undefined;
            this._view.hoverItem(this._hoveredItem);
         }
      },

      /**
       * Обрабатывает событие о клике по элементу коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на котором произошел клик
       * @private
       */
      _onItemClicked: function (event, hash) {
         var item = this._itemsProjection.getByHash(hash);
         this._itemsProjection.setCurrent(item);
         if(this._oneClickAction) {
            this._itemAction(item);
         }
      },

      /**
       * Обрабатывает событие о двойном клике по элементу коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на котором произошел двойной клик
       * @private
       */
      _onItemDblClicked: function () {
         if (!this._oneClickAction) {
            this._itemAction(this._itemsProjection.getCurrent());
         }
      },

      /**
       * Возвращает признак, что можно изменить текущий hovered элемент
       * @param {String} hash Хэш элемента, на который произошло наведение указателя
       * @param {Boolean} isHover Указатель наведен или ушел за пределы конейнера элемента
       * @private
       */
      _canChangeHoveredItem: function () {
         return true;
      },

      /**
       * Устанавливает выбранный элемент
       * @param {String} hash Хэш элемента
       * @private
       */
      _setItemSelected: function (hash) {
         this._itemsProjection.setCurrent(
            this._itemsProjection.getByHash(hash)
         );
      },

      /**
       * Производит действие по умолчанию для выбранного элемента
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} item Выбранный элемент
       * @private
       */
      _itemAction: function(item) {
         this._callItemAction(
            item
         );
      },

      /**
       * Вызывает действие по умолчанию для выбранного элемента
       * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} item Выбранный элемент
       * @private
       */
      _callItemAction: function(item) {
         this._notify(
            'onItemAction',
            item.getContents(),
            item
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
      }

      //endregion Behavior

      //endregion Protected methods
   };

   /**
    * Обрабатывает событие об изменении позиции текущего элемента коллекции
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} newCurrent Новый текущий элемент
    * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} oldCurrent Старый текущий элемент
    * @param {Number} newPosition Новая позиция
    * @param {Number} oldPosition Старая позиция
    * @private
    */
   var onCurrentChange = function (event, newCurrent) {
         if (this._view) {
            this._view.selectItem(
               newCurrent
            );
         }
      },

   /**
    * Обрабатывает событие об изменении коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {String} action Действие, приведшее к изменению.
    * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem[]} newItems Новые элементы коллеции.
    * @param {Integer} newItemsIndex Индекс, в котором появились новые элементы.
    * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem[]} oldItems Удаленные элементы коллекции.
    * @param {Integer} oldItemsIndex Индекс, в котором удалены элементы.
    * @private
    */
   onCollectionChange = function (event, action, newItems, newItemsIndex, oldItems) {
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
    * Обрабатывает событие об изменении элемента коллекции
    * @param {$ws.proto.EventObject} event Дескриптор события.
    * @param {SBIS3.CONTROLS.Data.Projection.ICollectionItem} item Измененный элемент коллеции.
    * @param {Integer} index Индекс измененного элемента.
    * @param {String} [property] Измененное свойство элемента
    * @private
    */
   onCollectionItemChange = function (event, item, index, property) {
      switch (property) {
         case 'contents':
            this._view.updateItem(
               item
            );
            this._view.selectItem(
               this._itemsProjection.getCurrent(),
               this._itemsProjection.getCurrentPosition()
            );
            this.reviveComponents();
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

   return ListControlMixin;
});
