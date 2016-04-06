/**
 * Created by as.avramenko on 29.01.2016.
 */

define('js!SBIS3.CONTROLS.ItemsToolbar',
    [
       'js!SBIS3.CONTROLS.CompoundControl',
       'js!SBIS3.CONTROLS.IconButton',
       'js!SBIS3.CONTROLS.ItemActionsGroup',
       'html!SBIS3.CONTROLS.ItemsToolbar',
       'html!SBIS3.CONTROLS.ItemsToolbar/editActions',
       'js!SBIS3.CORE.MarkupTransformer'
    ],
    function(CompoundControl, IconButton, ItemActionsGroup, dotTplFn, editActionsTpl, MarkupTransformer) {

       'use strict';

       var ItemsToolbar = CompoundControl.extend( /** @lends SBIS3.CONTROLS.ItemsToolbar.prototype */ {
          $protected: {
             _dotTplFn: dotTplFn,
             _options: {
                /**
                 * @cfg {Boolean} Отображать тулбар для touсh устройств
                 */
                touchMode: false,
                /**
                 * @cfg {Boolean} Отображать кнопки для редактирования (Сохранить, Отменить)
                 */
                showEditActions: false,
                /**
                 * @cfg {Array} Набор действий над элементами, отображающийся в виде иконок
                 */
                itemsActions: []
             },
             _itemsActions: null,      // Инстанс опций записей
             _editActions: null,       // todo: Заменить на компонент "Toolbar" (когда тот будет)
             _target: null,            // Элемент - кандидат на отображение тулбара
             _currentTarget: null,     // Элемент, относительно которого сейчас отображается тулбар
             _lockingToolbar: false,    // Состояние заблокированности тулбара
             _isVisible: false
          },
          $constructor: function() {
             this._publish('onShowItemActionsMenu', 'onItemActionActivated');
          },
          /**
           * Создает или возвращает уже созданные кнопки редактирования
           * @returns {null|SBIS3.CONTROLS.ItemsToolbar.$protected._editActions|*|SBIS3.CONTROLS.ItemsToolbar._editActions}
           * @private
           */
          _getEditActions: function() {
             var toolbarContent;
             if (!this._editActions) {
                (toolbarContent = this._getToolbarContent()).append(MarkupTransformer(editActionsTpl()));
                this.reviveComponents();
                this._editActions = toolbarContent.find('.controls-ItemsToolbar__editActions');
             }
             return this._editActions;
          },
          /**
           * Отображает кнопки редактирования
           */
          showEditActions: function() {
             this._getEditActions().removeClass('ws-hidden');
          },
          /**
           * Скрывает кнопки редактирования
           */
          hideEditActions: function() {
             if (this._editActions) {
                this._editActions.addClass('ws-hidden');
             }
          },
          /**
           * Проверяет, отображаются ли сейчас кнопки редактирования
           * @returns {boolean|*}
           * @private
           */
          _isEditActionsHidden: function() {
             return !this._editActions || this._editActions.hasClass('ws-hidden');
          },
          /**
           * Инициализирует опции записи
           * @private
           */
          _initItemsActions: function() {
             var self = this;
             this._itemsActions = new ItemActionsGroup({
                items: this._options.itemsActions,
                element: $('<div class="controls-ListView__itemActions-container"></div>').prependTo(this._getToolbarContent()),
                keyField: 'name',
                parent: this,
                linkedControl: this.getParent(),
                touchMode: this._options.touchMode,
                handlers : {
                   onActionActivated: function(e, key) {
                      self._notify('onItemActionActivated', key);
                   },
                   onShowMenu: function() {
                      this.getContainer().addClass('ws-invisible');
                      self.lockToolbar();
                      self._notify('onShowItemActionsMenu');
                   },
                   onHideMenu: function() {
                      this.getContainer().removeClass('ws-invisible');
                      if (self._isEditActionsHidden()) {
                         self.unlockToolbar();
                      }
                      self._target ? self.show(self._target) : self.hide();
                   }
                }
             });
          },
          /**
           * Метод получения компонента операций над записью.
           * @returns {Object} Компонент "операции над записью".
           */
          getItemsActions: function() {
             return this.getItemsActionsGroup();
          },
          /**
           * Создает или возвращает уже созданные опции записи
           * @returns {null|SBIS3.CONTROLS.ItemsToolbar.$protected._itemsActions|ItemActionsGroup|SBIS3.CONTROLS.ItemsToolbar._itemsActions}
           */
          getItemsActionsGroup: function() {
             if (!this._itemsActions && this._options.itemsActions.length) {
                this._initItemsActions();
             }
             return this._itemsActions;
          },
          /**
           * Задаёт новые операции над записью
           * Как в меню, так и на строке
           * @param items Массив новых items
           */
          setItemsActions: function(itemsActions) {
             this._options.itemsActions = itemsActions;

             if(this._itemsActions) {
                this._itemsActions.setItems(this._options.itemsActions);
             }
          },
          /**
           * Отображает операции над записью
           * @param target
           */
          showItemsActions: function(target) {
             var itemsActions = this.getItemsActionsGroup();
             itemsActions.applyItemActions();
             itemsActions.show(target);
          },
          /**
           * Скрывает операции над записью
           */
          hideItemsActions: function() {
             if (this._itemsActions) {
                this._itemsActions.hide();
             }
          },
          /**
           * Проверяет, отображаются ли сейчас опции записи
           * @returns {boolean}
           * @private
           */
          _isItemsActionsHidden: function() {
             return !this._options.itemsActions.length || (this._itemsActions && !this._itemsActions.hasVisibleActions());
          },
          /**
           * Блокирует тулбар и включает слежение за currentTarget
           */
          lockToolbar: function() {
             this._lockingToolbar = true;
             this.getContainer().addClass('controls-ItemsToolbar__locked');
             this._trackingTarget();
          },
          /**
           * Разблокирует тулбар и отключает слежение за currentTarget
           */
          unlockToolbar: function() {
             this._lockingToolbar = false;
             this.getContainer().removeClass('controls-ItemsToolbar__locked');
             this._untrackingTarget();
          },
          /**
           * Включает слежение за позицей currentTarget
           * @private
           */
          _trackingTarget: function() {
             $ws.helpers.trackElement(this._currentTarget.container, true).subscribe('onMove', this._recalculatePosition, this);
          },
          /**
           * Отключает слежение за позицей currentTarget
           * @private
           */
          _untrackingTarget: function() {
             if(this._currentTarget) {
                $ws.helpers.trackElement(this._currentTarget.container, false);
             }
          },
          /**
           * Пересчитывает позицию тулбара при изменении позиции currentTarget
           * @private
           */
          _recalculatePosition: function() {
             var parentContainer = this.getParent().getContainer()[0],
                 targetContainer = this._currentTarget.container[0],
                 parentCords = parentContainer.getBoundingClientRect(),
                 targetCords = targetContainer.getBoundingClientRect();
             this._currentTarget.position =  {
                top: targetCords.top - parentCords.top + parentContainer.scrollTop,
                left: targetCords.left - parentCords.left
             };
             this._currentTarget.size = {
                height: targetContainer.offsetHeight,
                width: targetContainer.offsetWidth
             };
             this._setPosition(this._getPosition(this._currentTarget));
          },
          /**
           * Устанавливает позицию тулбара
           * @param position
           * @private
           */
          _setPosition: function(position) {
             var container = this.getContainer()[0];
             for(var key in position) {
                if(position.hasOwnProperty(key)) {
                   container.style[key] = position[key] + (typeof position[key] === 'number' ? 'px' : '');
                }
             }
          },
          /**
           * Возвращает координаты для отображения тулбара
           * @param target
           * @returns {{}}
           * @private
           */
          _getPosition: function (target) {
             var position = target.position,
                 size = target.size,
                 parentContainer = this.getParent().getContainer()[0],
                 isVertical = target.container.hasClass('js-controls-CompositeView__verticalItemActions'),
                 rightPosition = parentContainer.offsetWidth - (position.left + size.width),
                 topPosition = 'auto',
                 bottomPosition = parentContainer.offsetHeight - (position.top + size.height);

             if(rightPosition < 0 && !isVertical) {
                rightPosition = 0;
             }

             if(isVertical) {
                topPosition = position.top;
                bottomPosition = 'auto';
             }

             this.getContainer()[isVertical ? 'addClass' : 'removeClass']('controls-ItemsToolbar__vertical');
             return {
                right : rightPosition,
                top : topPosition,
                bottom : bottomPosition
             };
          },
          /**
           * Показать тулбар, если он не зафиксирован у какого-нибудь элемента
           * @param {Object} target
           * @param {Boolean} animate
           */
          show: function(target, animate) {
             var container = this.getContainer()[0],
                 isActionsHidden = this._isItemsActionsHidden() && this._isEditActionsHidden(),
                 hasItemsActions = this._options.itemsActions.length,
                 itemsActions, position, toolbarContent;

             this._target = target;
             //Если тулбар зафиксирован или отсутствуют опции записи и кнопки редактирования по месту, то ничего не делаем
             if (this._lockingToolbar || isActionsHidden) {

                /* Если операций нет, то сроем тулбар */
                if(isActionsHidden) {
                   this.hide();
                } else if(hasItemsActions) {
                   itemsActions = this.getItemsActions();

                   /* Если показаны операции над записью и открыто меню, то надо обновить видимость */
                   if(itemsActions.isItemActionsMenuVisible()) {
                      this.getItemsActions().applyItemActions();
                   }
                }
                return;
             }
             this._currentTarget = target;                  // Запоминаем таргет в качестве текущего
             if (hasItemsActions) {       // Если имеются опции записи, то создаем их и отображаем
                this.showItemsActions(target);
             }
             // Рассчитываем и устанавливаем позицию тулбара
             position = this._getPosition(target);
             this._setPosition(position);
             this.getContainer().removeClass('ws-hidden');
             this._isVisible = true;
             //Если режим touch, то отображаем тулбар с анимацией.
             if (this._options.touchMode) {
                this._trackingTarget();
                if (animate) {
                   toolbarContent = this._getToolbarContent();
                   toolbarContent[0].style.right = -container.offsetWidth + 'px';
                   container.style.height = target.size.height + 'px';
                   toolbarContent.animate({right: 0}, 350);
                }
             }
          },
          /**
           * Возвращает контейнер тулбара
           * @returns {*|jQuery|HTMLElement}
           * @private
           */
          _getToolbarContent: function() {
             return $('.controls-ItemsToolbar__container', this._container[0]);
          },
          /**
           * Скрывает тубар, если он не зафиксирован
           * @param {boolean} animate Анимировать ли скрытие
           */
          hide: function(animate) {
             var self = this,
                 container, toolbarContent;

             this._target = null;
             if (!this._lockingToolbar && this._isVisible) {
                this._isVisible = false;
                container = this.getContainer();

                if (this._options.touchMode || animate) {
                   this._untrackingTarget();
                }

                if (this._options.touchMode && animate) {
                   toolbarContent = this._getToolbarContent();
                   toolbarContent.animate({right: -container.width()}, {
                      duration: 350,
                      complete: function() {
                         container.addClass('ws-hidden');
                         self.hideItemsActions();
                      }
                   });
                } else {
                   container.addClass('ws-hidden');
                   this.hideItemsActions();
                }
                this._currentTarget = null;
             }
          },
          /**
           * todo Костыль, ссылка на задание, по которому будет выпилен:
           * Задача в разработку от 26.01.2016 №1172557048
           * Необходимо сделать правки в AreaAbstract, которые позволят избавиться от костыля в ItemActionsGro...
           * https://inside.tensor.ru/opendoc.html?guid=612d3c83-2ea1-4f21-8e63-1947a30c12f4
           * @param event
           * @private
           */
          _onClickHandler: function(event) {
             event.stopPropagation();
             event.stopImmediatePropagation();
          },
          canAcceptFocus: function() {
             return false;
          }
       });
       return ItemsToolbar;
    });
