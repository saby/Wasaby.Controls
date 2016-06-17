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

      var VERTICAL_OFFSET = -13;
      var HORIZONTAL_OFFSET = 4;

      var ItemActionsGroup = ButtonGroupBaseDS.extend( /** @lends SBIS3.CONTROLS.ItemActionsGroup.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _itemActionsButtons: {},
            _itemActionsMenu: undefined,
            _itemActionsMenuButton: undefined,
            _itemActionsHiddenButton: [],
            _activeItem: undefined,
            _activeCls: 'controls-ItemActions__activeItem',
            _options: {
               touchMode: false,
               linkedControl: undefined
            }
         },

         $constructor: function() {
            this._publish('onShowMenu', 'onHideMenu', 'onActionActivated');
            $ws.single.CommandDispatcher.declareCommand(this, 'showMenu', this.showItemActionsMenu);

            this.once('onInit', function() {
               this._itemActionsMenuButton = this._container.find('.controls-ItemActions__menu-button');
            }.bind(this));

            if(this._options.items.length && this._options.items[0].title) {
               $ws.single.ioc.resolve('ILogger').log('title', 'C 3.7.3.140 свойство операции над записью title перестанет работать. Используйте свойство caption');
            }
         },
         /**
          * Изменяет операции над строкой до нужного состояния - скрывает / показывает кнопки
          */
         applyItemActions: function() {
            var onlyMain = true,
                itemsInstances = this.getItemsInstances(),
                action, isActionVisible, isMain;

            function toggleActionByState(action, enabled, name) {
               action[enabled ? 'show' : 'hide']();
               this._itemActionsButtons[name]['disabledHidden'] = !enabled;
            }

            for(var i in itemsInstances) {
               if(itemsInstances.hasOwnProperty(i)) {
                  isMain = this._itemActionsButtons[i]['isMainAction'];
                  action = itemsInstances[i];
                  isActionVisible = action.isVisible();

                  /* Выключенные (disabled) операции не должны отображаться,
                     поэтому скроем их, и выставим флаг, что скрыты они были нами, а не извне,
                     это надо, так как, после включения (enabled), операции надо показать, но только те,
                     которые мы же сами и скрывали */
                  if(action.isEnabled()) {
                     if(this._itemActionsButtons[i]['disabledHidden'] && !isActionVisible) {
                        toggleActionByState.call(this, action, true, i);
                        isActionVisible = true;
                     }
                  } else if(isActionVisible) {
                     toggleActionByState.call(this, action, false, i);
                     isActionVisible = false;
                  }

                  /* Проверка, надо ли показывать иконку меню */
                  if (onlyMain && isActionVisible && !isMain) {
                     onlyMain = false;
                  }
                  /* Скрываем на строке все неглавные опции */
                  if(!isMain && isActionVisible) {
                     action.getContainer().addClass('ws-hidden');
                  }
               }
            }
            /* Если открыто меню, то не меняем состояние кнопки меню */
            if(this.isItemActionsMenuVisible()) return;

            this._itemActionsMenuButton[onlyMain ? 'addClass' : 'removeClass']('ws-hidden');
         },


         setEnabled: function () {
            /* Чтобы после изменения состояния, применилась видимость к операциям */
            ItemActionsGroup.superclass.setEnabled.apply(this, arguments);
            this.applyItemActions();
         },
         /**
          * Создаёт меню для операций над записью
          * @private
          */
         _createItemActionMenu: function() {
            var self = this,
                verticalAlign = {
                  side: 'top',
                  offset: VERTICAL_OFFSET
               },
               horizontalAlign = {
                  side: 'right',
                  offset: HORIZONTAL_OFFSET
               },
               target = this._itemActionsMenuButton;

            if (this._options.touchMode) {
               verticalAlign.offset = 0;
               horizontalAlign.offset = 0;
               target = this._container;
            }

            this._itemActionsMenu = new ContextMenu({
               element: $('> .controls-ItemActions__menu-container', this._getItemsContainer()[0]).show(),
               items: this.getItems(),
               keyField: this._options.keyField,
               displayField: 'caption',
               hierField: 'parent',
               parent: this,
               opener: this,
               target:  target,
               corner: 'tr',
               closeButton: true,
               verticalAlign: verticalAlign,
               horizontalAlign: horizontalAlign,
               closeByExternalClick: true,
               handlers: {
                  onClose: function() {
                     self._activeItem.container.removeClass('controls-ItemActions__activeItem');
                     self._notify('onHideMenu');
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
            this._activeItem.container.addClass(this._activeCls);
            this._itemActionsMenu.recalcPosition(true);
            /*TODO фикс теста, для операций над записью должна быть особая иконка*/
            $('.controls-PopupMixin__closeButton', this._itemActionsMenu.getContainer()).addClass('icon-16 icon-size icon-ExpandUp icon-primary action-hover');
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

            this._notify('onShowMenu');
         },

         hasVisibleActions: function() {
            return $ws.helpers.find(this.getItemsInstances(), function(instance) {
               return instance.isVisible();
            });
         },
         /**
          * Показывает операции над записью
          */
         show: function(hoveredItem) {
            var activeItemContainer = this._activeItem && this._activeItem.container;
            this._activeItem = hoveredItem;

            if(this._options.touchMode) {
               if(activeItemContainer) {
                  activeItemContainer.removeClass(this._activeCls);
               }
               hoveredItem.container.addClass(this._activeCls);
            }
            ItemActionsGroup.superclass.show.call(this);
         },

         /**
          * Скрывает операции над записью
          */
         hide: function() {
            if(this._activeItem.container && this._options.touchMode) {
               this._activeItem.container.removeClass(this._activeCls);
            }

            ItemActionsGroup.superclass.hide.call(this);
         },
         /**
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
          * Возвращает признак того, открыто ли сейчас меню операций над записью
          * @returns {boolean|*}
          */
         isItemActionsMenuVisible: function() {
            return this._itemActionsMenu && this._itemActionsMenu.isVisible();
         },
         /**
          * Обработчик нажатия на кнопку операций над записью
          * @param item
          * @private
          */
         _itemActivatedHandler: function(item) {
            this._itemActionsButtons[item]['handler'].call(this._options.linkedControl,
                this._activeItem.container,
                this._activeItem.key,
                this._activeItem.record);

            /* В обработчике могут вызвать destroy */
            if(!this.isDestroyed()) {
               this._notify('onActionActivated', this._activeItem.key);
            }
         },

         _getItemsContainer: function(){
            return $('.controls-ItemActions__itemsContainer', this._container[0]);
         },

         canAcceptFocus: function() {
            return false;
         },

         _getItemTemplate : function(item) {
            var action = {
               isMainAction : item.get('isMainAction'),
               isVisible: true
                },
                onActivated = item.get('onActivated');

            // При сериализации элементов ItemActions в проекции функции клонируется в строку,
            // поэтому требуется вернуть её в исходное состояние
            if(typeof onActivated === "string") {
               if( onActivated.beginsWith('wsFuncDecl::')) {
                  action.handler = $ws.helpers.getFuncFromDeclaration(onActivated.replace('wsFuncDecl::', ''));
               }
            }else{
               action.handler = onActivated;
            }

            this._itemActionsButtons[item.get('name')] = action;
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