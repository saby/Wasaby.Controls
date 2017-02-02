/**
 * Created by am.gerasimov on 26.03.2015.
 */

define('js!SBIS3.CONTROLS.ItemActionsGroup',
   [
   "Core/CommandDispatcher",
   "Core/IoC",
   "Core/ConsoleLogger",
   "js!SBIS3.CONTROLS.ButtonGroupBaseDS",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.Link",
   "js!SBIS3.CONTROLS.ContextMenu",
   "html!SBIS3.CONTROLS.ItemActionsGroup",
   "html!SBIS3.CONTROLS.ItemActionsGroup/ItemTpl",
   "Core/helpers/collection-helpers",
   "Core/helpers/markup-helpers",
   'css!SBIS3.CONTROLS.ItemActionsGroup'
],
   function( CommandDispatcher, IoC, ConsoleLogger,ButtonGroupBaseDS, IconButton, Link, ContextMenu, dotTplFn, dotTplFnForItem, colHelpers, mkpHelpers) {

      'use strict';

      var TOUCH_ALIGN = {
         verticalAlign: {
            side: 'top',
            offset: 0
         },
         horizontalAlign: {
            side: 'right',
            offset: 0
         }
      };

      var STANDART_ALIGN = {
         verticalAlign: {
            side: 'top',
            offset: -13
         },
         horizontalAlign: {
            side: 'right',
            offset: 4
         }
      };
      /**
       * Класс для работы с операциями над записями, которые появляются при наведении курсора мыши.
       * @class SBIS3.CONTROLS.ItemActionsGroup
       * @extends SBIS3.CONTROLS.ButtonGroupBaseDS
       * @author Герасимов Александр Максимович
       * @public
       */
      var ItemActionsGroup = ButtonGroupBaseDS.extend( /** @lends SBIS3.CONTROLS.ItemActionsGroup.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _itemActionsButtons: {},
            _itemActionsMenu: undefined,
            _itemActionsMenuButton: undefined,
            _itemActionsHiddenButton: [],
            _activeItem: undefined,
            _activeCls: 'controls-ItemActions__activeItem',
            _menuAlign: 'standart',
            _options: {
               touchMode: false,
               linkedControl: undefined
            }
         },

         $constructor: function() {
            this._publish('onShowMenu', 'onHideMenu', 'onActionActivated');
            CommandDispatcher.declareCommand(this, 'showMenu', this.showItemActionsMenu);

            this.once('onInit', function() {
               this._itemActionsMenuButton = this._container.find('.controls-ItemActions__menu-button');
            }.bind(this));
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
          * Возвращает элемент для которого отображаются Операции над записью
          */
         getTarget: function () {
            return this._activeItem;
         },
         /**
          * Создаёт меню для операций над записью
          * @private
          */
         _createItemActionMenu: function() {
            var self = this,
                verticalAlign = {},
                horizontalAlign = {},
                target,
                menuClassName = '',
                parentContainer = this.getParent().getContainer();

            if(this._options.touchMode) {
               verticalAlign = TOUCH_ALIGN.verticalAlign;
               horizontalAlign = TOUCH_ALIGN.horizontalAlign;
               target = this._container;
               menuClassName += ' controls-ItemActions__menu-touchMode';
            } else {
               verticalAlign = STANDART_ALIGN.verticalAlign;
               horizontalAlign = STANDART_ALIGN.horizontalAlign;
               target = this._itemActionsMenuButton;
            }

            menuClassName += parentContainer.hasClass('controls-ItemsToolbar__small') ? ' controls-ItemsToolbar__small' : '';

            this._itemActionsMenu = new ContextMenu({
               element: $('> .controls-ItemActions__menu-container', this._getItemsContainer()[0]).show(),
               items: this.getItems(),
               idProperty: this._options.idProperty,
               allowChangeEnable: false,
               displayProperty: 'caption',
               parentProperty: 'parent',
               parent: this,
               opener: this,
               target:  target,
               className: menuClassName,
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
         showItemActionsMenu: function(align) {
            /* Создадим меню операций над записью, если его ещё нет */
            if(!this._itemActionsMenu) {
               this._createItemActionMenu();
            }
            // при открытии контекстного меню необходимо устанавливать координаты точки начала построения popup
            this._setContextMenuMode(align);
            this._onBeforeMenuShowHandler();
            this._itemActionsMenu.show();
            this._activeItem.container.addClass(this._activeCls);
            this._itemActionsMenu.recalcPosition(true);
            /*TODO фикс теста, для операций над записью должна быть особая иконка*/
            $('.controls-PopupMixin__closeButton', this._itemActionsMenu.getContainer()).addClass('icon-size icon-ExpandUp icon-primary');
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
                  menuInstances[i].setCaption(itemActionsInstances.hasOwnProperty(i) && itemActionsInstances[i].getCaption());
                  menuInstances[i].setTooltip(itemActionsInstances.hasOwnProperty(i) && itemActionsInstances[i].getTooltip());
                  menuInstances[i].setIcon(itemActionsInstances.hasOwnProperty(i) && itemActionsInstances[i].getIcon());
               }
            }

            this._notify('onShowMenu');
         },

         hasVisibleActions: function() {
            return colHelpers.find(this.getItemsInstances(), function(instance) {
               /* Вызвать этот метод могут раньше, чем скроются выключенные операции,
                  и он вернёт неверный результат, поэтому проверяем и на isEnabled */
               return instance.isVisible() && instance.isEnabled();
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
            if(this._activeItem && this._activeItem.container && this._options.touchMode) {
               this._activeItem.container.removeClass(this._activeCls);
            }
            this._itemActionsMenu && this.isItemActionsMenuVisible() && this._itemActionsMenu.hide();
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
            if(this.isVisible()) {
               this.applyItemActions();
            }
            if(this.isItemActionsMenuVisible()){
               this._onBeforeMenuShowHandler();
            }
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

         /**
          * Меняет режим отображения операций над записью
          * @param {Boolean} mode
          */
         setTouchMode: function(mode) {
            this._options.touchMode = mode;
            if(this._itemActionsMenu) {
               this._itemActionsMenu.getContainer().toggleClass('controls-ItemActions__menu-touchMode', Boolean(mode));
               if(mode) {
                  this.setMenuAlign(TOUCH_ALIGN, this._container);
               } else {
                  this.setMenuAlign(STANDART_ALIGN, this._itemActionsMenuButton);
               }
            }
         },

         _setContextMenuMode: function(align) {
            var mode = !!align;
            if(this._itemActionsMenu) {
               this._itemActionsMenu.getContainer().toggleClass('controls-ItemActions__contextMenu', Boolean(mode));
               if(mode && this._menuAlign != 'context') {
                  this.setMenuAlign(align, undefined);
                  this._menuAlign = 'context';
               } else if(this._menuAlign != 'standart') {
                  this.setMenuAlign(STANDART_ALIGN, this._itemActionsMenuButton);
                  this._menuAlign = 'standart';
               }
            }
         },

         setMenuAlign: function(align, target) {
            if(this._itemActionsMenu){
               this._itemActionsMenu.setTarget(target);

               this._itemActionsMenu.setVerticalAlign(align.verticalAlign);
               this._itemActionsMenu.setHorizontalAlign(align.horizontalAlign);
            }
         },

         _getItemTemplate : function(item) {
            var action = {
               isMainAction : item.get('isMainAction'),
               isContextAction : item.get('isContextAction'),
               isVisible: true
                },
                onActivated = item.get('onActivated');

            // При сериализации элементов ItemActions в проекции функции клонируется в строку,
            // поэтому требуется вернуть её в исходное состояние
            if(typeof onActivated === "string") {
               if( onActivated.beginsWith('wsFuncDecl::')) {
                  action.handler = mkpHelpers.getFuncFromDeclaration(onActivated.replace('wsFuncDecl::', ''));
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