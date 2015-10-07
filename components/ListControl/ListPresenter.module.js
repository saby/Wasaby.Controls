/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControl.ListPresenter', [
   'js!SBIS3.CONTROLS.CollectionControl.CollectionPresenter',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection'
], function (CollectionPresenter, IBindCollection) {
   'use strict';

   /**
    * Презентер списка элементов - реализует ее поведеческий аспект.
    * @class SBIS3.CONTROLS.ListControl.ListPresenter
    * @extends SBIS3.CONTROLS.CollectionControl.CollectionPresenter
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ListPresenter = CollectionPresenter.extend(/** @lends SBIS3.CONTROLS.ListControl.ListPresenter.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ListControl.ListPresenter',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.ListControl.IListView} Управляемое представление
             * @name SBIS3.CONTROLS.ListControl.ListPresenter#view
             */
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Projection.Collection} Проекция списка
          */
         _list: undefined
      },

      $constructor: function () {
         if (!$ws.helpers.instanceOfMixin(this._options.view, 'SBIS3.CONTROLS.ListControl.IListView')) {
            throw new Error('View should implement SBIS3.CONTROLS.ListControl.IListView');
         }

         this.subscribeTo(this._options.view, 'onItemHovered', this._onItemHovered.bind(this));
         this.subscribeTo(this._options.view, 'onItemClicked', this._onItemClicked.bind(this));
         this.subscribeTo(this._options.view, 'onItemDblClicked', this._onItemDblClicked.bind(this));

         this._onItemsChange = onItemsChange.bind(this);
         this._onCurrentChange = onCurrentChange.bind(this);
      },

      destroy: function () {
         ListPresenter.superclass.destroy.call(this);

         this._onItemsChange = undefined;
         this._onCurrentChange = undefined;
      },

      //region Public methods

      /**
       * Возвращает управляемое представление
       * @returns {SBIS3.CONTROLS.ListControl.IListView}
       */
      getView: function () {
         return this._options.view;
      },

      //region Collection

      /**
       * Возвращает проекцию
       * @returns {SBIS3.CONTROLS.Data.Projection.Collection}
       */
      getItems: function () {
         return this._list;
      },

      /**
       * Устанавливает проекцию
       * @param {SBIS3.CONTROLS.Data.Projection.Collection} items
       */
      setItems: function (items) {
         if (!items) {
            throw new Error('Items is not defined');
         }
         if (!$ws.helpers.instanceOfModule(items, 'SBIS3.CONTROLS.Data.Projection.Collection')) {
            throw new Error('Items should implement SBIS3.CONTROLS.Data.Projection.Collection');
         }

         if (this._list) {
            this.unsubscribeFrom(this._list, 'onCollectionChange', this._onItemsChange);
            this.unsubscribeFrom(this._list, 'onCurrentChange', this._onCurrentChange);
         }

         this._list = items;

         this.subscribeTo(this._list, 'onCollectionChange', this._onItemsChange);
         this.subscribeTo(this._list, 'onCurrentChange', this._onCurrentChange);
      },

      //endregion Collection

      //region Behavior

      /**
       * Обрабатывает событие о смене выбранного элемента
       * @param {SBIS3.CONTROLS.Data.Collection.CollectionItem} item Выбранный элемент
       */
      itemSelected: function (item) {
         this._list.setCurrent(item);
      },

      //endregion Behavior

      //endregion Public methods

      //region Protected methods

      //region Behavior

      /**
       * Обрабатывает событие о нахождении указателя над элементом коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на который произошло наведение указателя
       */
      _onItemHovered: function (event, hash) {
         this._options.view.hoverItem(
            this._list.getCollection().getByHash(hash)
         );
      },

      /**
       * Обрабатывает событие о клике по элементу коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на котором произошел клик
       */
      _onItemClicked: function (event, hash) {
         var item = this._list.getCollection().getByHash(hash);
         this.itemSelected(item);
         if(this._itemAction && this._options.oneClickAction){
            this._itemAction(item);
         }
      },

      /**
       * Обрабатывает событие о двойном клике по элементу коллекции
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {String} hash Хэш элемента, на котором произошел двойной клик
       */
      _onItemDblClicked: function (event, hash) {
         if (this._itemAction && !this._options.oneClickAction) {
            this._itemAction(this._list.getCurrent());
         }
      },

      _onKeyPressed: function (event, code) {
         if (this._options.moveCurrentByKeyPress) {
            if (this._options.view.isHorizontal()) {
               if (code === $ws._const.key.left) {
                  this._list.moveToPrevious();
               } else if (code === $ws._const.key.right) {
                  this._list.moveToNext();
               }
            } else {
               if (code === $ws._const.key.up) {
                  this._list.moveToPrevious();
               } else if (code === $ws._const.key.down) {
                  this._list.moveToNext();
               }
            }
         }
      },

      //endregion Behavior

      _getItemsForRedraw: function () {
         return this._list;
      }

      //endregion Protected methods
   });

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
      this._options.view.selectItem(
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
   onItemsChange = function (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
      newItems = newItems || [];
      newItemsIndex = newItemsIndex || 0;
      oldItems = oldItems || [];
      oldItemsIndex = oldItemsIndex || 0;

      var i,
         view = this._options.view;

      switch (action) {
         case IBindCollection.ACTION_ADD:
         case IBindCollection.ACTION_REMOVE:
            for (i = 0; i < oldItems.length; i++) {
               view.removeItem(
                  oldItems[i]
               );
            }
            for (i = 0; i < newItems.length; i++) {
               view.addItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            view.checkEmpty();
            this._revive();
            break;

         case IBindCollection.ACTION_MOVE:
            for (i = 0; i < newItems.length; i++) {
               view.moveItem(
                  newItems[i],
                  newItemsIndex + i
               );
            }
            this._revive();
            break;

         case IBindCollection.ACTION_REPLACE:
         case IBindCollection.ACTION_UPDATE:
            for (i = 0; i < newItems.length; i++) {
               view.updateItem(
                  newItems[i]
               );
            }
            view.selectItem(
               this.getItems().getCurrent(),
               this.getItems().getCurrentPosition()
            );
            this._revive();
            break;

         case IBindCollection.ACTION_RESET:
            this._redraw();
            break;
      }
   };

   return ListPresenter;
});
