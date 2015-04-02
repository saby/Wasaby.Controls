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

            }
         },

         $constructor: function() {
            this._createItemActionMenu();
         },

         /**
          * Изменяет операции над строкой до нужного состояния - скрывает / показывает кнопки
          */
         applyItemActions: function(filter, item) {
            var onlyMain = true,
               itemsInstances = this.getItemsInstances();

            this._activeItem = item;
            this._itemActionsHiddenButton = Array.isArray(filter) ? filter : [];
            for(var i in this._itemActionsButtons) {
               if(this._itemActionsButtons.hasOwnProperty(i)) {
                  //Если все опции главные, то меню не надо показывать вообще
                  onlyMain &= this._itemActionsButtons[i]['isMainAction'];
                  itemsInstances[i].getContainer()[0].style.display =
                     //Если пользователь ничего скрывать не хочет, тогда не будем лишних проверок делать
                     (this._itemActionsHiddenButton.length ? Array.indexOf(this._itemActionsHiddenButton, i) === -1 : true)
                     && this._itemActionsButtons[i]['isMainAction'] ?
                        'inline-block' : 'none';
               }
            }
            this._itemActionsMenuButton[0].style.display = (!onlyMain ? 'inline-block' : 'none');
         },
         /**
          * Расщитывает позицию для операций на записью
          * @param item
          * @returns {{top: number, right: number}}
          * @private
          */
         _getItemActionPositionForItem: function(item) {
            var position = item[0].offsetTop,
                itemHeight = item[0].offsetHeight;

            return {
               'top': position + ((itemHeight > ITEMS_ACTIONS_HEIGHT) ? itemHeight - ITEMS_ACTIONS_HEIGHT : 0),
               //TODO Для плитки надо будет считать где именно, подумать как сделать получше
               'right': 1
            }
         },
         /**
          * Создаёт меню для операций над записью
          * @private
          */
         _createItemActionMenu: function() {
            var items = [],
                self = this;

            for(var i = 0, len = this._options.items.length; i < len; i++) {
               items.push({
                  id: this._options.items[i].name,
                  icon: this._options.items[i].icon,
                  title: this._options.items[i].title
               });
            }

            this._itemActionsMenuButton = this._container
               .find('.controls-ItemActions__menu-button')
               .click(function() {
                  self.showItemActionsMenu();
               });

            this._itemActionsMenu = new ContextMenu({
               element: $('> .controls-ItemActions__menu-container', this._container[0]),
               items: items,
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
                     self._itemActionsMenuVisible = false;
                     self._activeItem.removeClass('controls-ItemActions__hoverImitation');
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
            this._activeItem[show ? 'addClass' : 'removeClass']('controls-ItemActions__hoverImitation');
         },
         /**
          * Показывает меню для операций над записью
          */
         showItemActionsMenu: function() {
            this._onBeforeMenuShowHandler();
            this._itemActionsMenu.show();
            this._activeItem.addClass('controls-ItemActions__hoverImitation');
            this._itemActionsMenuVisible = true;
         },
         /**
          * Срабатывает перед открытием меню
          * Скрывает записи, которые нужно скрыть
          * @private
          */
         _onBeforeMenuShowHandler: function() {
            var instances = this._itemActionsMenu.getItemsInstances();

            for(var i in instances) {
               if(instances.hasOwnProperty(i)) {
                  instances[i].getContainer()[Array.indexOf(this._itemActionsHiddenButton, i) === -1 ? 'show' : 'hide']();
               }
            }
         },
         /**
          * Показывает операции над записью
          * @param item
          */
         showItemActions: function(item) {
            var position = this._getItemActionPositionForItem(item);

            this._container[0].style.top = position.top + 'px';
            this._container[0].style.right = position.right + 'px';
            this._container[0].style.display = 'block';
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
            var linkText = item.get('linkText'),
                name = item.get('name');

            this._itemActionsButtons[name] ={};
            this._itemActionsButtons[name]['isMainAction'] = item.get('isMainAction');
            this._itemActionsButtons[name]['handler'] = item.get('onActivated');

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
