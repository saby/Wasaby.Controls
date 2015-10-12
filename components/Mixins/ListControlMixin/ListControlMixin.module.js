/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControlMixin', [
   'js!SBIS3.CONTROLS.ListControl.ListView',
   'js!SBIS3.CONTROLS.Data.Projection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableList',
   'html!SBIS3.CONTROLS.ListControl.ListView'
], function (ListView, Projection, ObservableList, LoadableList, ListViewTemplate) {
   'use strict';

   /**
    * Миксин, задающий любому контролу поведение работы с нетипизированным списком
    * *Это экспериментальный модуль, API будет меняться!*
    * @mixin SBIS3.CONTROLS.ListControlMixin
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var ListControlMixin = /**@lends SBIS3.CONTROLS.ListControlMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.ListControl.IListItems|Array} Список, отображаемый контролом
             * @name SBIS3.CONTROLS.ListControlMixin#items
             */
         },

         /**
          * @var {SBIS3.CONTROLS.Data.IList} Список, отображаемый контролом
          */
         _items: undefined,

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Collection} Проекция списка
          */
         _itemsProjection: undefined,

         _viewConstructor: ListView,

         /**
          * @var {SBIS3.CONTROLS.ListControl.ListView} Представление списка
          */
         _view: undefined,
         
         /**
          * @var {SBIS3.CONTROLS.Collection.IListItem} Элемент, надо которым находится указатель
          */
         _hoveredItem: undefined
      },
      
      after: {
         _initView: function() {
            if (!$ws.helpers.instanceOfMixin(this._view, 'SBIS3.CONTROLS.ListControl.IListView')) {
               throw new Error('View should implement SBIS3.CONTROLS.ListControl.IListView');
            }
            
            this.subscribeTo(this._view, 'onItemHovered', this._onItemHovered.bind(this));
            this.subscribeTo(this._view, 'onItemClicked', this._onItemClicked.bind(this));
            this.subscribeTo(this._view, 'onItemDblClicked', this._onItemDblClicked.bind(this));
         }
      },

      //region Public methods

      //endregion Public methods

      //region Protected methods

      //region Collection
      
      _convertDataSourceToItems: function (source) {
         return new LoadableList({
            source: source
         });
      },

      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_convertItems
       * @private
       */
      _convertItems: function (items) {
         if (items instanceof Array) {
            items = new ObservableList({
               items: items
            });
         }

         if (!$ws.helpers.instanceOfMixin(items, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            throw new Error('Items should be an instance of SBIS3.CONTROLS.Data.Collection.IEnumerable');
         }

         return items;
      },

      //endregion Collection

      //region View
      
      /**
       * @see SBIS3.CONTROLS.CollectionControlMixin#_getViewTemplate
       * @private
       */
      _getViewTemplate: function() {
         return ListViewTemplate;
      },

      //endregion View

      //region Behavior
      
      /**
       * Устанавливает выбранный элемента
       * @param {String} hash Хэш элемента
       * @private
       */
      _setItemSelected: function (hash) {
         this._itemsProjection.setCurrent(
            this._itemsProjection.getChildByHash(hash)
         );
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
            this._hoveredItem = isHover ? this._items.getByHash(hash) : undefined;
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
         var item = this._items.getByHash(hash);
         this._itemsProjection.setCurrent(item);
         if(this._itemAction && this._oneClickAction) {
            this._itemAction(item);
         }
      },

      /**
       * Обрабатывает событие о двойном клике по элементу коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на котором произошел двойной клик
       * @private
       */
      _onItemDblClicked: function (event, hash) {
         if (this._itemAction && !this._oneClickAction) {
            this._itemAction(this._itemsProjection.getCurrent());
         }
      },

      _onKeyPressed: function (event, code) {
         if (this._moveCurrentByKeyPress) {
            if (this._view.isHorizontal()) {
               if (code === $ws._const.key.left) {
                  this._itemsProjection.moveToPrevious();
               } else if (code === $ws._const.key.right) {
                  this._itemsProjection.moveToNext();
               }
            } else {
               if (code === $ws._const.key.up) {
                  this._itemsProjection.moveToPrevious();
               } else if (code === $ws._const.key.down) {
                  this._itemsProjection.moveToNext();
               }
            }
         }
      },

      /**
       * Возвращает признак, что можно изменить текущий hovered элемент
       * @param {String} hash Хэш элемента, на который произошло наведение указателя
       * @param {Boolean} isHover Указатель наведен или ушел за пределы конейнера элемента
       * @private
       */
      _canChangeHoveredItem: function (hash, isHover) {
         return true;
      }

      //endregion Behavior

      //endregion Protected methods
   };

   return ListControlMixin;
});

