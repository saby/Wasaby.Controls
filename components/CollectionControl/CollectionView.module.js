/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.CollectionControl.CollectionView', [
   'js!SBIS3.CONTROLS.CollectionControl.ICollectionView',
   'js!SBIS3.CORE.MarkupTransformer'
], function (ICollectionView, markupTransformer) {
   'use strict';

   /**
    * Представление коллекции - реализует его визуальный аспект.
    * @class SBIS3.CONTROLS.CollectionControl.CollectionView
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.CollectionControl.ICollectionView
    * @author Крайнов Дмитрий Олегович
    */
   return $ws.proto.Abstract.extend([ICollectionView], /** @lends SBIS3.CONTROLS.CollectionControl.CollectionView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.CollectionControl.CollectionView',
      $protected: {
         /**
          * @var {String} CSS-префикс всех классов
          */
         _сssPrefix: 'controls-CollectionView__',

         /**
          * @var {String} CSS-класс узла c контролом
          */
         _rootNodeСssClass: '',

         /**
          * @var {jQuery} Узел, содержащий элементы коллекции
          */
         _itemsNode: undefined,

         /**
          * @var {String} CSS-класс узла, содержащего элементы коллекции
          */
         _itemsNodeCssClass: 'itemsContainer',

         /**
          * @var {Function} Шаблон контейнера элемента
          */
         _itemContainerTemplate: undefined,

         /**
          * @var {String} Тег узла, содержащего элемент коллекции
          */
         _itemContainerTag: 'div',

         /**
          * @var {String} CSS-класс узла, содержащего элемент коллекции
          */
         _itemContainerCssClass: 'item',

         /**
          * @var {String} CSS-класс выбранного узла
          */
         _itemContainerSelectedCssClass: 'item__selected',

         /**
          * @var {String} CSS-класс узла "под указателем"
          */
         _itemContainerHoverCssClass: 'item__hovered',

         /**
          * @var {String} CSS-класс узла, отображающего сообщении о пустой коллекции
          */
         _itemsEmptyCssClass: 'emptyData',

         /**
          * @var {String} CSS-класс узла, содержащего индикатор загрузки
          */
         _loadingNodeCssClass: 'loading'
      },

      $constructor: function () {
         this._publish('onKeyPressed');

         if (this._rootNodeСssClass) {
            this._options.rootNode.addClass(this._rootNodeСssClass);
         }

         this._attachEventHandlers();
      },

      //region SBIS3.CONTROLS.CollectionControl.ICollectionView

      clear: function () {
         this._removeСomponents(this.getRootNode());
         this.getRootNode().empty();
         this._itemsNode = undefined;
      },

      render: function (items) {
         this.clear();
         this.getRootNode().append(
            this._execTemplate(
               this._options.template,
               this._getRenderData(items)
            )
         );
      },

      checkEmpty: function (parent) {
         if (!parent) {
            parent = this.getRootNode().find('> .' + this._сssPrefix + this._itemsNodeCssClass);
         }

         parent.find('> .' + this._сssPrefix + this._itemsEmptyCssClass).toggleClass(
            'ws-hidden',
            this._getItemsContainers(parent).length > 0
         );
      },

      showLoadingIndicator: function (target) {
         this._getLoadingNode(target).show();
      },

      /**
       * Скрывает индикатор загрузки
       */
      hideLoadingIndicator: function (target) {
         this._getLoadingNode(target).hide();
      },

      //endregion SBIS3.CONTROLS.CollectionControl.ICollectionView

      //region Public methods

      /**
       * Возвращает узел контрола
       * @returns {jQuery}
       */
      getRootNode: function () {
         return this._options.rootNode;
      },

      /**
       * Возвращает шаблон контрола
       * @returns {String|Function}
       */
      getTemplate: function () {
         return this._options.template;
      },

      /**
       * Возвращает инстансы компонентов из указанного узла
       * @param {jQuery} [node] Узел DOM. Если не указан - берется корневой.
       * @returns {Array}
       */
      getComponents: function(node) {
         node = node || this.getRootNode();
         var components = [];
         node.find('[data-component]').each(function (i, item) {
            components.push($(item).wsControl());
         });
         return components;
      },

      /**
       * Возвращает шаблон разметки каждого элемента списка
       * @returns {String|Function}
       */
      getItemTemplate: function () {
         return this._options.itemTemplate;
      },

      /**
       * Устанавливает шаблон разметки каждого элемента списка
       * @param {String|Function} template
       */
      setItemTemplate: function (template) {
         this._options.itemTemplate = template;
      },

      /**
       * Возвращает селектор шаблона разметки для каждого элемента
       * @returns {Function}
       */
      getItemTemplateSelector: function () {
         return this._options.itemTemplateSelector;
      },

      /**
       * Устанавливает селектор шаблона разметки для каждого элемента
       * @param {Function} template
       */
      setItemTemplateSelector: function (selector) {
         this._options.itemTemplateSelector = selector;
      },

      //endregion Public methods

      //region Protected methods

      //region Events
      /**
       * Подключает обработчики событий
       *  @param {JQuery} node - Объект внутри которого находятся элементы, по умолчанию rootNode
       * @private
       */
      _attachEventHandlers: function (node) {
         node = node||this.getRootNode();
         node
            .on('mouseenter mouseleave', '.' + this._сssPrefix + this._itemContainerCssClass, this._onItemMouseEnterOrLeave.bind(this))
            .on('mouseup', '.' + this._сssPrefix + this._itemContainerCssClass, this._onItemClick.bind(this))
            .on('dblclick', '.' + this._сssPrefix + this._itemContainerCssClass, this._onItemDblClick.bind(this))
            .on('keyup', this._onKeyPress.bind(this));
      },

      /**
       * Обрабатывает событие о наведении указателя мыши на контейнер элемента
       * @private
       */
      _onItemMouseEnterOrLeave: function (event) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о клике по контейнеру элемента
       * @private
       */
      _onItemClick: function (event) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о двойном клике по контейнеру элемента
       * @private
       */
      _onItemDblClick: function (event) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обрабатывает событие о нажатии клавиши
       * @private
       */
      _onKeyPress: function (event) {
         this._notify(
            'onKeyPressed',
            event.which
         );
      },

      //endregion Events

      //region Rendering

      /**
       * Возвращает данные, необходимые для отображения
       * @param {SBIS3.CONTROLS.Data.Projection.Collection} items Элементы
       * @returns {Object}
       * @private
       */
      _getRenderData: function(items) {
         return {
            items: this._getItemsRenderData(items),
            class: this._сssPrefix + this._itemsNodeCssClass,
            emptyClass: this._сssPrefix + this._itemsEmptyCssClass,
            emptyHTML: this._options.emptyHTML
         };
      },

      /**
       * Возвращает данные, необходимые для отображения списка элементов
       * @param {SBIS3.CONTROLS.Data.Projection.Collection} items Элементы
       * @returns {Array}
       * @private
       */
      _getItemsRenderData: function(items) {
         var data = [];
         items.each(function(item, index) {
            data.push(this._getItemRenderData(item));
         }, this);

         return data;
      },

      /**
       * Возвращает данные, необходимые для отображения элемента
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @returns {Object}
       * @private
       */
      _getItemRenderData: function(item) {
         return {
            containerTag: this._itemContainerTag,
            containerClass: this._сssPrefix + this._itemContainerCssClass,
            item: item.getContents(),
            hash: item.getHash(),
            template: this._buildTemplate(
               this._getItemTemplate(item),
               item.getContents()
            )
         };
      },

      /**
       * Возвращает шаблон отображения элемента
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @returns {String|Function}
       * @private
       */
      _getItemTemplate: function(item) {
         return this._options.itemTemplateSelector ?
            this._options.itemTemplateSelector(item.getContents()) :
            this._options.itemTemplate;
      },

      /**
       * Выполняет шаблон по строке или функции
       * @param {String|Function} template Шаблон
       * @param {Object} data Данные, подставляемые в шаблон
       * @param {Boolean} wrap Обернуть результат в узел DOM
       * @returns {jQuery}
       * @private
       */
      _execTemplate: function(template, data, wrap) {
         var markup = markupTransformer(
            this._buildTemplate(
               template,
               data
            )(data)
         );
         return wrap ? $('<div/>').html(markup) : $(markup);
      },

      /**
       * Строит шаблон по строке или функции
       * @param {String|Function} template Шаблон
       * @param {Object} data Данные, подставляемые в шаблон
       * @returns {Function}
       * @private
       */
      _buildTemplate: function(template, data) {
         switch (typeof template) {
            case 'function':
               //пришел готовый xhtml шаблон
               return template;
            case 'object':
               throw new Error('Template should be a string');
         }

         if (!template) {
            template = typeof data === 'object' ? data.toString() : data;
         }

         return doT.template(template);
      },

      //endregion Rendering

      //region DOM

      /**
       * Возвращает узел, содержащий в котором размещается указанный элемент
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @returns {jQuery}
       * @private
       */
      _getTargetNode: function (item) {
         if (this._itemsNode === undefined) {
            this._itemsNode = this.getRootNode().find('.' + this._сssPrefix + this._itemsNodeCssClass);
         }

         return this._itemsNode;
      },

      /**
       * Строит узел контейнера элемента
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @param {String|Function} template Шаблон
       * @returns {jQuery}
       * @private
       */
      _buildItemContainer: function(item, template) {
         if (!this._itemContainerTemplate) {
            throw new Error('Item container template is undefined');
         }
         return $(this._itemContainerTemplate(
            {item: this._getItemRenderData(item)}
         ));
      },

      /**
       * Возвращает все контейнеры элементов для указанного родителя
       * @param {jQuery} parent Контейнер родителя
       * @returns {jQuery}
       * @private
       */
      _getItemsContainers: function(parent) {
         return parent.find('> .' + this._сssPrefix + this._itemContainerCssClass);
      },

      /**
       * Возвращает узел c индикатором загрузки
       * @param {Object} target Коллекция, которая загружается
       * @returns {jQuery}
       * @private
       */
      _getLoadingNode: function(target) {
         return this._buildLoadingNode(this.getRootNode());
      },

      /**
       * Создает узел c индикатором загрузки
       * @param {jQuery} parent Родительский узел
       * @returns {jQuery}
       * @private
       */
      _buildLoadingNode: function(parent) {
         var node = parent.find('.' + this._сssPrefix + this._loadingNodeCssClass);
         if (!node.length) {
            node = $('<div/>')
               .addClass(this._сssPrefix + this._loadingNodeCssClass)
               .text('Loading...')
               .appendTo(parent);
         }
         return node;
      },

      /**
       * Удаляет инстансы контролов из указанного узла
       * @param {jQuery} node Узел DOM
       * @private
       */
      _removeСomponents: function(node) {
         $ws.helpers.forEach(this.getComponents(node), function (item) {
            item.destroy();
         });
      }

      //endregion DOM

      //endregion Protected methods

   });
});
