/* global define */
define('js!SBIS3.CONTROLS.ListControl.ItemActions', [
   'js!SBIS3.CONTROLS.ItemActionsGroup'
], function(ItemActionsGroup) {
   'use strict';

   var ITEMS_ACTIONS_HEIGHT = 20;

   /**
    * Миксин, отображающую операции над записью
    * @mixin SBIS3.CONTROLS.ListControl.ItemActions
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */
   var ItemActions = /**@lends SBIS3.CONTROLS.ListControl.ItemActions.prototype  */{
      $protected: {
         _options: {
            /**
             * @typedef {Array} ItemsActions
             * @property {String} name Имя кнопки.
             * @property {String} icon Путь до иконки.
             * @property {String} caption Текст на кнопке.
             * @property {String} tooltip Всплывающая подсказка.
             * @property {Boolean} isMainAction Отображать ли кнопку на строке или только выпадающем в меню.
             * На строке кнопки отображаются в том же порядке, в каком они перечислены.
             * На строке может быть только три кнопки, полный список будет в меню.
             * @property {Function} onActivated Действие кнопки.
             * @editor icon ImageEditor
             * @translatable caption
             */
            /**
             * @cfg {ItemsActions[]} Набор действий над элементами, отображающийся в виде иконок
             * @remark
             * Можно использовать для массовых операций.
             * @example
             * <pre>
             *     <options name="itemsActions" type="array">
             *        <options>
             *           <option name="name">btn1</option>
             *           <option name="icon">sprite:icon-16 icon-Delete icon-primary</option>
             *           <option name="isMainAction">false</option>
             *           <option name="tooltip">Удалить</option>
             *           <option name="onActivated" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myOnActivatedHandler</option>
             *        </options>
             *        <options>
             *            <option name="name">btn2</option>
             *            <option name="icon">sprite:icon-16 icon-Trade icon-primary</option>
             *            <option name="tooltip">Изменить</option>
             *            <option name="isMainAction">true</option>
             *            <option name="onActivated" type="function">js!SBIS3.CONTROLS.Demo.MyListView:prototype.myOnActivatedHandler</option>
             *         </options>
             *     </options>
             * </pre>
             * @see setItemsActions
             */
            itemsActions: [{
               name: 'delete',
               icon: 'sprite:icon-16 icon-Erase icon-error',
               tooltip: 'Удалить',
               title: 'Удалить',
               isMainAction: true,
               onActivated: function (item) {
                  this.deleteRecords(item.data('hash'));
               }
            },{
               name: 'move',
               icon: 'sprite:icon-16 icon-Move icon-primary action-hover',
               tooltip: 'Перенести',
               title: 'Перенести',
               isMainAction: false,
               onActivated: function (item) {
                  this.selectedMoveTo(item.data('hash'));
               }
            }]
         },
         _itemActionsGroup: null
      },

      /**
       * Метод получения операций над записью.
       * @returns {Array} Массив операций над записью.
       * @example
       * <pre>
       *     dataGrid.subscribe('onChangeHoveredItem', function(hoveredItem) {
       *        var actions = dataGrid.getItemsActions(),
       *        instances = actions.getItemsInstances();
       *
       *        for (var i in instances) {
       *           if (instances.hasOwnProperty(i)) {
       *              //Будем скрывать кнопку удаления для всех строк
       *              instances[i][i === 'delete' ? 'show' : 'hide']();
       *           }
       *        }
       *     });
       * </pre>
       * @see itemsActions
       * @see setItemActions
       */
      getItemsActions: function () {
         if (!this._itemActionsGroup && this._options.itemsActions.length) {
            this._initItemsActions();
         }
         return this._itemActionsGroup;
      },

      /**
       * Метод установки или замены кнопок операций над записью, заданных в опции {@link itemsActions}
       * @remark
       * В метод нужно передать массив обьектов.
       * @param {Array} items Объект формата {name: ..., icon: ..., caption: ..., onActivated: ..., isMainOption: ...}
       * @param {String} items.name Имя кнопки операции над записью.
       * @param {String} items.icon Иконка кнопки.
       * @param {String} items.caption Текст на кнопке.
       * @param {String} items.onActivated Обработчик клика по кнопке.
       * @param {String} items.tooltip Всплывающая подсказка.
       * @param {String} items.title Текст кнопки в выпадающем меню.
       * @param {String} items.isMainOption На строке ли кнопка (или в меню).
       * @example
       * <pre>
       *     dataGrid.setItemsActions([{
       *        name: 'delete',
       *        icon: 'sprite:icon-16 icon-Erase icon-error',
       *        title: 'Удалить',
       *        isMainAction: true,
       *        onActivated: function(item) {
       *           this.deleteRecords(item.data('hash'));
       *        }
       *     },
       *     {
       *        name: 'addRecord',
       *        icon: 'sprite:icon-16 icon-Add icon-error',
       *        title: 'Добавить',
       *        isMainAction: true,
       *        onActivated: function(item) {
       *           this.showRecordDialog();
       *        }
       *     }]
       * <pre>
       * @see itemsActions
       * @see getItemsActions
       * @see getHoveredItem
       */
      setItemsActions: function (items) {
         this._options.itemsActions = items;
         this._itemActionsGroup ? this._itemActionsGroup.setItems(items) : this._initItemsActions();
      },

      /**
       * Показывает оперцаии над записью для элемента
       * @private
       */
      _showItemActions: function () {
         this._isItemActionsVisible = true;

         //Создадим операции над записью, если их нет
         this.getItemsActions();

         //Если показывается меню, то не надо позиционировать операции над записью
         if (this._itemActionsGroup.isItemActionsMenuVisible()) {
            return;
         }
         this._itemActionsGroup.applyItemActions();
         this._itemActionsGroup.showItemActions(this._itemHoveredData, this._getItemActionsPosition(this._itemHoveredData));
      },

      /**
       * Скрывает оперцаии над записью для элемента
       * @private
       */
      _hideItemActions: function () {
         this._isItemActionsVisible = false;

         if (this._itemActionsGroup && !this._itemActionsGroup.isItemActionsMenuVisible()) {
            this._itemActionsGroup.hideItemActions();
         }
      },

      _getItemActionsPosition: function (item) {
         return {
            top: item.position.top + ((item.size.height > ITEMS_ACTIONS_HEIGHT) ? item.size.height - ITEMS_ACTIONS_HEIGHT : 0 ),
            right: this._container[0].offsetWidth - (item.position.left + item.size.width)
         };
      },

      /**
       * Инициализирует операции над записью
       * @private
       */
      _initItemsActions: function () {
         this._itemActionsGroup = this._drawItemActions();
      },

      _isItemsActionsHovered: function () {
         return this._itemActionsGroup && this._itemActionsGroup.getContainer().hasClass('controls-ListView__itemActions-hovered');
      },

      /**
       * Создаёт операции над записью
       * @private
       */
      _drawItemActions: function () {
         var actions = new ItemActionsGroup({
               items: this._options.itemsActions,
               element: this._getItemActionsContainer(),
               keyField: 'name',
               parent: this
            }),
            self = this;
         actions.getContainer().hover(function() {
            $(this).addClass('controls-ListView__itemActions-hovered');
         }, function() {
            $(this).removeClass('controls-ListView__itemActions-hovered');
            self._resetHoveredItem();
         });

         return actions;
      },

      /**
       * Возвращает контейнер для операций над записью
       * @returns {*}
       * @private
       */
      _getItemActionsContainer: function() {
         var actionsContainer = this._container.find('> .controls-ListView__itemActions-container');
         if (!actionsContainer.length) {
            actionsContainer = $('<div class="controls-ListView__itemActions-container"/>')
               .appendTo(this._container);
         }
         return actionsContainer;
      }
   };

   return ItemActions;
});
