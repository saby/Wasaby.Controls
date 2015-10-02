/**
 * Created by am.gerasimov on 26.03.2015.
 */

define('js!SBIS3.CONTROLS.ItemActionsGroup',
   [
      'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.ContextMenu',
      'html!SBIS3.CONTROLS.ItemActionsGroup',
      'html!SBIS3.CONTROLS.ItemActionsGroup/ItemTpl'
   ],
   function(ButtonGroupBaseDS, IconButton, Link, ContextMenu, dotTplFn, dotTplFnForItem) {

      'use strict';

      var ItemActionsGroup = ButtonGroupBaseDS.extend( /** @lends SBIS3.CONTROLS.ItemActionsGroup.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _itemActionsButtons: {},
            _itemActionsMenu: undefined,
            _itemActionsMenuButton: undefined,
            _itemActionsMenuVisible: false,
            _itemActionsHiddenButton: [],
            _activeItem: undefined,
            _options: {

            }
         },

         $constructor: function() {
            this._createItemActionMenu();
         },

         /**
          * Изменяет операции над строкой до нужного состояния - скрывает / показывает кнопки
          */
         applyItemActions: function() {
            var onlyMain = true,
               itemsInstances = this.getItemsInstances(),
               show = false;

            for(var i in itemsInstances) {
               if(itemsInstances.hasOwnProperty(i)) {
                  show = this._itemActionsButtons[i]['isMainAction'] && itemsInstances[i].isVisible();
                  if (onlyMain && itemsInstances[i].isVisible() && !this._itemActionsButtons[i]['isMainAction']) {
                     onlyMain = false;
                  }
                  //Если видимость кнопки не изменилась, то делать ничего не будем
                  if(this._itemActionsButtons[i]['isVisible'] !== show) {
                     itemsInstances[i].getContainer()[0].style.display = show ? 'inline-block' : 'none';
                     this._itemActionsButtons[i]['isVisible'] = show;
                  }
               }
            }
            this._itemActionsMenuButton[0].style.display = (!onlyMain ? 'inline-block' : 'none');
         },
         /**
          * Создаёт меню для операций над записью
          * @private
          */
         _createItemActionMenu: function() {
            var self = this;

            this._itemActionsMenuButton = this._container
               .find('.controls-ItemActions__menu-button')
               .click(function() {
                  self.showItemActionsMenu();
               });

            this._itemActionsMenu = new ContextMenu({
               element: $('> .controls-ItemActions__menu-container', this._container[0]),
               items: this._options.items,
               parent: this,
               target:  this._itemActionsMenuButton,
               corner: 'br',
               closeButton: true,
               verticalAlign: {
                  side: 'top',
                  offset: -18
               },
               horizontalAlign: {
                  side: 'right',
                  offset: 5
               },
               closeByExternalClick: true,
               handlers: {
                  onClose: function() {
                     var hoveredItem = self.getParent().getHoveredItem().container;
                     self._itemActionsMenuVisible = false;
                     self._activeItem.removeClass('controls-ItemActions__activeItem');
                     self[hoveredItem ? 'showItemActions' : 'hideItemActions'](hoveredItem);
                  },
                  onMenuItemActivate: function(e, id) {
                     self._itemActivatedHandler(id);
                  }
               }
            });
         },
         /**
          * Показывает меню для операций над записью
          */
         showItemActionsMenu: function() {
            this._onBeforeMenuShowHandler();
            this._itemActionsMenu.show();
            this._activeItem.addClass('controls-ItemActions__activeItem');
            this._itemActionsMenuVisible = true;
            this._itemActionsMenu.recalcPosition(true);
         },
         /**
          * Срабатывает перед открытием меню
          * Скрывает записи, которые нужно скрыть
          * @private
          */
         _onBeforeMenuShowHandler: function() {
            var menuInstances = this._itemActionsMenu.getItemsInstances(),
                itemActionsInstances = this.getItemsInstances();

            for(var i in menuInstances) {
               if(menuInstances.hasOwnProperty(i)) {
                  menuInstances[i].getContainer()[itemActionsInstances.hasOwnProperty(i) && itemActionsInstances[i].isVisible() ? 'show' : 'hide']();
               }
            }
         },
         /**
          * Показывает операции над записью
          */
         showItemActions: function(hoveredItem, position) {
            this._activeItem = hoveredItem.container;
            this._container[0].style.top = position.top + 'px';
            this._container[0].style.right = position.right + 'px';
            this._container[0].style.display = 'block';
         },
         /**
          * Задаёт новые операции над записью
          * Как в меню, так и на строке
          * @param items Массив новых items
          */
         setItems: function(items) {
            this._itemActionsButtons ={};
            this._itemActionsMenu.setItems(items);
            ItemActionsGroup.superclass.setItems.apply(this, arguments);
         },
         /**
          * Скрывает операции над записью
          * @private
          */
         hideItemActions: function() {
            this._container[0].style.display = 'none';
         },
         /**
          * Возвращает признак того, открыто ли сейчас меню операций над записью
          * @returns {boolean|*}
          */
         isItemActionsMenuVisible: function() {
            return this._itemActionsMenuVisible;
         },
         /**
          * Обработчик нажатия на кнопку операций над записью
          * @param item
          * @private
          */
         _itemActivatedHandler: function(item) {
            this.hideItemActions();
            this._itemActionsButtons[item]['handler'].apply(this.getParent(), [this._activeItem, this._activeItem.data('id')]);
         },

         canAcceptFocus: function() {
            return false;
         },

         _getItemTemplate : function(item) {
            this._itemActionsButtons[item.get('name')] = {
               isMainAction : item.get('isMainAction'),
               handler: item.get('onActivated'),
               isVisible: true
            };

            return dotTplFnForItem;
         },

         destroy: function() {
            this._itemActionsButtons = {};
            this._activeItem = undefined;
            this._itemActionsMenuButton = undefined;
            ItemActionsGroup.superclass.destroy.apply(this, arguments);
         }
      });

      return ItemActionsGroup;

   });
