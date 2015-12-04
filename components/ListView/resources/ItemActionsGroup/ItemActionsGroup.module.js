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

      var VERTICAL_OFFSET = -21;
      var HORIZONTAL_OFFSET = 6;

      var ItemActionsGroup = ButtonGroupBaseDS.extend( /** @lends SBIS3.CONTROLS.ItemActionsGroup.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _itemActionsButtons: {},
            _itemActionsMenu: undefined,
            _itemActionsMenuButton: undefined,
            _itemActionsMenuVisible: false,
            _itemActionsHiddenButton: [],
            _activeItem: undefined,
            _touchActions: false,
            _options: {

            }
         },

         $constructor: function() {
            var self = this;

            if(this._options.items.length && this._options.items[0].title) {
               $ws.single.ioc.resolve('ILogger').log('title', 'C 3.8.0 свойство операции над записью title перестанет работать. Используйте свойство caption');
            }

            this._itemActionsMenuButton = this._container
               .find('.controls-ItemActions__menu-button')
               .click(function() {
                  self.showItemActionsMenu();
               });

            this._touchActions = $ws._const.browser.isMobilePlatform;
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
                  //TODO ВРЕМЕННЫЙ КОСТЫЛЬ ВЫПИЛИТЬ В 3.7.3.20, ВИДИМОСТЬЮ УПРАВЛЯЮТ ПРИКЛАДНЫЕ РАЗРАБОТЧИКИ
                  itemsInstances[i].getContainer().toggleClass('ws-hidden', !show);
                  //Если видимость кнопки не изменилась, то делать ничего не будем
                  if(this._itemActionsButtons[i]['isVisible'] !== show) {
                     this._itemActionsButtons[i]['isVisible'] = show;
                  }
               }
            }
            this._itemActionsMenuButton.toggleClass('ws-hidden', onlyMain);
         },
         /**
          * Создаёт меню для операций над записью
          * @private
          */
         _createItemActionMenu: function() {
            var self = this;
            var menuCont = $('> .controls-ItemActions__menu-container', this._getItemsContainer()[0]);
            var verticalAlign = {
                  side: 'top',
                  offset: VERTICAL_OFFSET
               },
               horizontalAlign = {
                  side: 'right',
                  offset: HORIZONTAL_OFFSET
               },
               target = this._itemActionsMenuButton,
               corner = 'br';

            if (this._touchActions) {
               menuCont.addClass('controls-ItemsActions__touch-actions');
               verticalAlign.offset = 0;
               horizontalAlign.offset = 0;
               target = this._container;
               corner = 'tr';
            }

            this._itemActionsMenu = new ContextMenu({
               element: menuCont.show(),
               items: this._options.items,
               keyField: this._options.keyField,
               //FIXME для обратной совместимости
               displayField: this._options.items[0].title ? 'title' : 'caption',
               parent: this,
               opener: this,
               target:  target,
               corner: corner,
               closeButton: true,
               verticalAlign: verticalAlign,
               horizontalAlign: horizontalAlign,
               closeByExternalClick: true,
               handlers: {
                  onClose: function() {
                     var hoveredItem = self.getParent().getHoveredItem();
                     self._itemActionsMenuVisible = false;
                     self._activeItem.container.removeClass('controls-ItemActions__activeItem');

                     if (self._touchActions) {
                        self._container[0].style.visibility = 'visible';
                        self.hideItemActions();
                     } else {
                        self[hoveredItem.container ? 'showItemActions' : 'hideItemActions'](hoveredItem);
                     }
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
            /* Создадим меню операций над записью, если его ещё нет */
            if(!this._itemActionsMenu) {
               this._createItemActionMenu();
            }

            this._onBeforeMenuShowHandler();
            this._itemActionsMenu.show();
            this._activeItem.container.addClass('controls-ItemActions__activeItem');
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

            if (this._touchActions){
               //Нельзя сделать hide так как display:none ломает позиционирование меню
               this._container[0].style.visibility = 'hidden';
            }

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
            var cont = this._container[0];

            this._activeItem = hoveredItem;
            cont.style.right = position.right + 'px';
            cont.style.display = 'block';

            if (this._touchActions){
               var itemHeight = hoveredItem.size.height,
                   itemsContainer = this._getItemsContainer();

               itemsContainer[0].style.right = - cont.offsetWidth + 'px';
               cont.style.height = itemHeight + 'px';
               itemsContainer.animate({right : position.right}, 350);
            }

            cont.style.top = position.top + 'px';
         },
         /***
          * Задаёт новые операции над записью
          * Как в меню, так и на строке
          * @param items Массив новых items
          */
         setItems: function(items) {
            this._itemActionsButtons ={};
            this._itemActionsMenu && this._itemActionsMenu.setItems(items);
            ItemActionsGroup.superclass.setItems.apply(this, arguments);
         },
         /**
          * Скрывает операции над записью
          * @private
          */
         hideItemActions: function(animate) {
            if (this._touchActions && animate){
               var itemsContainer = this._getItemsContainer(),
                  contWidth = this._container.width(),
                  self = this;
               itemsContainer.animate({right: -contWidth}, {
                  duration: 350,
                  complete: function(){
                     self._container[0].style.display = 'none';
                  }
               });
            } else {
               this._container[0].style.display = 'none';
            }
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
            this._itemActionsButtons[item]['handler'].apply(this.getParent(), [this._activeItem.container, this._activeItem.key, this._activeItem.record]);
         },

         _getItemsContainer: function(){
            return $('.controls-ItemActions__itemsContainer', this._container[0]);
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
            this._itemActionsMenuButton.unbind('click');
            this._itemActionsMenuButton = undefined;
            ItemActionsGroup.superclass.destroy.apply(this, arguments);
         }
      });

      return ItemActionsGroup;

   });
