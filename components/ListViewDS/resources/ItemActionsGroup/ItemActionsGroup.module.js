/**
 * Created by am.gerasimov on 26.03.2015.
 */

define('js!SBIS3.CONTROLS.ItemActionsGroup',
   [
      'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.ContextMenu',
      'html!SBIS3.CONTROLS.ItemActionsGroup'
   ],
   function(ButtonGroupBaseDS, IconButton, Link, ContextMenu, dotTplFn) {

      'use strict';
      var
         ITEMS_ACTIONS_HEIGHT = 20;

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
               /**
                * Количество записей, которые можно показать не в меню
                */
               itemActionsOverflow: 3
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
                overFlow = false,
                show = false,
                count = 0;

            for(var i in itemsInstances) {
               if(itemsInstances.hasOwnProperty(i)) {
                  onlyMain &= this._itemActionsButtons[i]['isMainAction'];
                  if(itemsInstances[i].isVisible() && !overFlow) {
                     count++;
                     overFlow = count > this._options.itemActionsOverflow;
                  }
                  //Если кнопок больше чем itemActionsOverflow или кнопка не главная, то нужно их скрыть
                  //и показать в меню
                  show = !(overFlow || !this._itemActionsButtons[i]['isMainAction']);
                  //Если видимость кнопки не изменилась, то делать ничего не будем
                  if(this._itemActionsButtons[i]['isVisible'] !== show) {
                     itemsInstances[i].getContainer()[0].style.display = show ? 'inline-block' : 'none';
                     this._itemActionsButtons[i]['isVisible'] = show;
                  }
               }
            }
            this._itemActionsMenuButton[0].style.display = (!onlyMain || overFlow ? 'inline-block' : 'none');
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
          * Иммитирует ховер, когда мышку увели на операции над записью
          * @param show
          */
         hoverImitation: function(show) {
            this._activeItem[show ? 'addClass' : 'removeClass']('controls-ItemActions__activeItem');
         },
         /**
          * Задаёт количество записей, которые показываются на строке(не прячутся в меню)
          * @param {Number} amount
          */
         setItemsActionsOverFlow: function(amount) {
            if(typeof amount === 'number') {
               this._options.itemActionsOverflow = amount;
            }
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
         showItemActions: function(hoveredItem) {
            this._activeItem = hoveredItem.container;
            this._container[0].style.top = hoveredItem.position.top + ((hoveredItem.size.height > ITEMS_ACTIONS_HEIGHT) ? hoveredItem.size.height - ITEMS_ACTIONS_HEIGHT : 0 ) + 'px';
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
            this._itemActionsButtons[item]['handler'].call(this.getParent(), this._activeItem);
         },

         _getItemTemplate : function(item) {
            var linkText = item.get('linkText');

            this._itemActionsButtons[item.get('name')] = {
               isMainAction : item.get('isMainAction'),
               handler: item.get('onActivated'),
               isVisible: true
            };

            return linkText ?
            '<component data-component="SBIS3.CONTROLS.Link">' +
               '<option name="caption">' + linkText + '</option>' +
            '</component>' :
            '<component data-component="SBIS3.CONTROLS.IconButton">' +
               '<option name="icon">' + item.get('icon') + '</option>' +
            '</component>';
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
