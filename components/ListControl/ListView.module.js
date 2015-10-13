/* global define, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ListControl.ListView', [
   'js!SBIS3.CONTROLS.ListControl.IListView',
   'js!SBIS3.CORE.MarkupTransformer',
   'html!SBIS3.CONTROLS.ListControl.ListView/resources/ListItem'
], function (IListView, markupTransformer, ListItemContainerTemplate) {
   'use strict';

   /**
    * Представление списка - реализует его визуальный аспект.
    * @class SBIS3.CONTROLS.ListControl.ListView
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.ListControl.IListView
    * @author Крайнов Дмитрий Олегович
    */
   return $ws.proto.Abstract.extend([IListView], /** @lends SBIS3.CONTROLS.ListControl.ListView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl.ListView',
      $protected: {
         /**
          * @var {String} CSS-префикс всех классов
          */
         _сssPrefix: 'controls-ListView__',

         /**
          * @var {String} CSS-класс узла c контролом
          */
         _rootNodeСssClass: 'controls-ListView',

         /**
          * @var {String} CSS-класс узла, содержащего элементы коллекции
          */
         _itemsNodeCssClass: 'itemsContainer',

         /**
          * @var {Function} Шаблон контейнера элемента
          */
         _itemContainerTemplate: ListItemContainerTemplate,

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
         _loadingNodeCssClass: 'loading',

         /**
          * @var {Boolean} Индикатор загрузки отображется
          */
         _isLoadingVisible: false,

         /**
          * @var {Boolean} Задержка появления индикатора загрузки
          */
         _loadingIndicatorShowDelay: 750,

         /**
          * @var {String} CSS-класс узла, содержащего компонент пейджинга
          */
         _pagerClass: 'pager'
      },

      $constructor: function () {
         this._publish('onItemHovered', 'onItemClicked', 'onItemDblClicked');

         if (this._rootNodeСssClass) {
            this._options.rootNode.addClass(this._rootNodeСssClass);
         }

         this._attachEventHandlers();
      },

      //region SBIS3.CONTROLS.ListControl.IListView

      render: function (items) {
         this.clear();
         this.getRootNode().append(
            this._execTemplate(
               this._options.template,
               this._getRenderData(items)
            )
         );
      },

      clear: function () {
         this._removeСomponents(this.getRootNode());
         this.getRootNode().empty();
      },

      addItem: function (item, at) {
         var target = this._getTargetNode(item),
            nextSibling = at > -1 ? this._getItemContainerByIndex(target, at) : null,
            template = this._getItemTemplate(item);
         if (nextSibling && nextSibling.length) {
            this._buildItemContainer(item, template).insertBefore(nextSibling);
         } else {
            this._buildItemContainer(item, template).appendTo(target);
         }
      },

      updateItem: function (item) {
         var container = this._getItemContainer(this._getTargetNode(item), item),
            template = this._getItemTemplate(item);
         if (container.length) {
            this._removeСomponents(container);
            container.replaceWith(
               this._buildItemContainer(item, template)
            );
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.ListControl.ListView::updateItem()', 'Item at this position is not found');
         }
      },

      removeItem: function (item) {
         var container = this._getItemContainer(this._getTargetNode(item), item);
         if (container.length) {
            this._removeСomponents(container);
            container.remove();
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.ListControl.ListView::removeItem()', 'Item at this position is not found');
         }
      },

      moveItem: function (item, to) {
         var targetNode = this._getTargetNode(item),
            fromContainer = this._getItemContainer(targetNode, item),
            toContainer = this._getItemContainerByIndex(targetNode, to);
         if (fromContainer.length && toContainer.length) {
            fromContainer.insertBefore(toContainer);
         } else {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.ListControl.ListView::removeItem()', 'Positions are not found');
         }
      },

      selectItem: function (item) {
         this.getRootNode().find('.' + this._сssPrefix + this._itemContainerSelectedCssClass).removeClass(this._сssPrefix + this._itemContainerSelectedCssClass);
         if (item) {
            this._getItemContainer(this._getTargetNode(item), item).addClass(this._сssPrefix + this._itemContainerSelectedCssClass);
         }
      },

      hoverItem: function (item) {
         this.getRootNode()
            .find('.' + this._сssPrefix + this._itemContainerHoverCssClass)
            .removeClass(this._сssPrefix + this._itemContainerHoverCssClass);
         if (item) {
            this._getItemContainer(this._getTargetNode(item), item)
               .addClass(this._сssPrefix + this._itemContainerHoverCssClass);
         }
      },

      scrollToItem: function (item, at) {
         throw new Error('Method scrollToItem is under construction');
      },

      isHorizontal: function () {
         return false;
      },

      checkEmpty: function (parent) {
         if (!parent) {
            parent = this._getItemsNode();
         }

         parent.find('> .' + this._сssPrefix + this._itemsEmptyCssClass).toggleClass(
            'ws-hidden',
            this._getItemsContainers(parent).length > 0
         );
      },

      showLoadingIndicator: function (target) {
         if (this._isLoadingVisible) {
            return;
         }
         this._isLoadingVisible = true;
         setTimeout((function() {
            if (this._isLoadingVisible) {
               this._getLoadingNode(target).show();
            }
         }).bind(this), this._loadingIndicatorShowDelay);
      },

      /**
       * Скрывает индикатор загрузки
       */
      hideLoadingIndicator: function (target) {
         if (!this._isLoadingVisible) {
            return;
         }
         this._isLoadingVisible = false;
         this._getLoadingNode(target).hide();
      },

      getPagerContainer: function () {
         var container = this.getRootNode().find('.' + this._сssPrefix + this._pagerClass);
         if (container.length === 0) {
            container = $('<div/>')
               .addClass(this._сssPrefix + this._pagerClass)
               .insertAfter(this.getRootNode());
         }
         return container;
      },

      //endregion SBIS3.CONTROLS.ListControl.IListView

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
       * @param {jQuery} node Объект внутри которого находятся элементы, по умолчанию rootNode
       * @private
       */
      _attachEventHandlers: function (node) {
         node = node || this.getRootNode();

         var itemsSelector = '.' + this._сssPrefix + this._itemsNodeCssClass + ' .' + this._сssPrefix + this._itemContainerCssClass;
         node.on(
            'mouseenter mouseleave',
            itemsSelector,
            this._onItemMouseEnterOrLeave.bind(this)
         )
         .on(
            'mouseup',
            itemsSelector,
            this._onItemClick.bind(this)
         )
         .on(
            'dblclick',
            itemsSelector,
            this._onItemDblClick.bind(this)
         );
      },

      /**
       * Обрабатывает событие о наведении указателя мыши на контейнер элемента
       * @param {jQuery.Event} event Объект события
       * @private
       */
      _onItemMouseEnterOrLeave: function (event) {
         this._notify(
            'onItemHovered',
            $(event.currentTarget).data('hash'),
            event.type === 'mouseenter' ? true : false,
            event.currentTarget
         );
      },

      /**
       * Обрабатывает событие о клике по контейнеру элемента
       * @param {jQuery.Event} event Объект события
       * @private
       */
      _onItemClick: function (event) {
         if (event.which === 1) {
            event.stopPropagation();
            this._notify(
               'onItemClicked',
               $(event.currentTarget).data('hash'),
               event.currentTarget
            );
         }
      },

      /**
       * Обрабатывает событие о двойном клике по контейнеру элемента
       * @param {jQuery.Event} event Объект события
       * @private
       */
      _onItemDblClick: function (event) {
         event.stopPropagation();
         this._notify(
            'onItemDblClicked',
            $(event.currentTarget).data('hash'),
            event.currentTarget
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
            'class': this._сssPrefix + this._itemsNodeCssClass,
            emptyClass: this._сssPrefix + this._itemsEmptyCssClass,
            emptyHTML: this._options.emptyHTML,
            pagerClass: this._сssPrefix + this._pagerClass
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
         items.each(function(item) {
            data.push(this._getItemRenderData(item));
         }, this, false);

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
            owner: item,
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
            case 'string':
               if (template.indexOf('html!') === 0) {
                  return require(template);
               }
               break;
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
      _getTargetNode: function () {
         return this._getItemsNode();
      },

      /**
       * Строит узел контейнера элемента
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @param {String|Function} template Шаблон
       * @returns {jQuery}
       * @private
       */
      _buildItemContainer: function(item) {
         if (!this._itemContainerTemplate) {
            throw new Error('Item container template is undefined');
         }
         return $(this._itemContainerTemplate(
            {item: this._getItemRenderData(item)}
         ));
      },

      /**
       * Возвращает контейнер со списком элементов
       * @returns {jQuery}
       * @private
       */
      _getItemsNode: function() {
         return this.getRootNode().find('.' + this._сssPrefix + this._itemsNodeCssClass);
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
      _getLoadingNode: function() {
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
               .appendTo(parent);

            if (this._options.pagerType === 'scroll' || this._options.pagerType === 'more') {
               node.addClass(this._сssPrefix + this._loadingNodeCssClass + '-more');
            }
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
      },

      /**
       * Возвращает узел контейнера элемента среди siblings по его позиции
       * @param {jQuery} parent Родительский узел
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Элемент
       * @returns {jQuery}
       * @private
       */
      _getItemContainer: function(parent, item) {
         return parent.find('>[data-hash="' + item.getHash() + '"]');
      },

      /**
       * Возвращает узел контейнера элемента по его индексу в родителе
       * @param {jQuery} parent Родительский узел
       * @param {Number} at Позиция
       * @returns {jQuery}
       * @private
       */
      _getItemContainerByIndex: function(parent, at) {
         return parent.find('> .' + this._сssPrefix + this._itemContainerCssClass + ':eq(' + at + ')');
      }

      //endregion DOM

      //endregion Protected methods

   });
});
