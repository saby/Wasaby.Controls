/* global define, $ws */
define('js!SBIS3.CONTROLS.ListControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CORE.CompoundActiveFixMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',
   'js!SBIS3.CONTROLS.SelectableNew',
   'js!SBIS3.CONTROLS.MultiSelectableNew',
   'js!SBIS3.CONTROLS.ListControl.ItemActions',
   'js!SBIS3.CONTROLS.ListControl.CommonHandlers',
   'js!SBIS3.CONTROLS.MoveHandlers'
], function(CompoundControl, CompoundActiveFixMixin, ListControlMixin, Selectable, MultiSelectable, ItemActions, CommonHandlers, MoveHandlers) {
   'use strict';

   /**
    * Контрол, отображающий внутри себя список элементов.
    * Умеет отображать каждый элемента списка по определенному шаблону.
    * @class SBIS3.CONTROLS.ListControl
    * @extends SBIS3.CORE.CompoundControl
    * @mixes SBIS3.CORE.CompoundActiveFixMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.SelectableNew
    * @mixes SBIS3.CONTROLS.MultiSelectableNew
    * @mixes SBIS3.CONTROLS.ListControl.ItemActions
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var ListControl = CompoundControl.extend([CompoundActiveFixMixin, ListControlMixin, Selectable, /*MultiSelectable,*/ ItemActions, CommonHandlers, MoveHandlers], /** @lends SBIS3.CONTROLS.ListControl.prototype */{
      /**
       * @event onChangeHoveredItem При переводе курсора мыши на другую запись
       * @remark
       * Событие срабатывает при смене записи под курсором мыши.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Object} hoveredItem Объект
       * @param {Number|String} hoveredItem.key ключ элемента представления данных
       * @param {jQuery|false} hoveredItem.container элемент представления данных
       * @param {Object} hoveredItem.position координаты контейнера элемента
       * @param {Number} hoveredItem.top отступ сверху
       * @param {Number} hoveredItem.left отступ слева
       * @param {Object} hoveredItem.size размеры контейнера элемента
       * @param {Number} hoveredItem.height высота
       * @param {Number} hoveredItem.width ширина
       * @example
       * <pre>
       *     dataGrid.subscribe('onChangeHoveredItem', function(hoveredItem) {
        *        var actions = DataGridView.getItemsActions(),
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
       * @see setItemsActions
       * @see getItemsActions
       */
      
      _moduleName: 'SBIS3.CONTROLS.ListControl',
      
      $protected: {
         _options: {
            /**
             * @cfg {Function} Обработчик клика на элемент
             * @example
             * <pre>
             *     <option name="elemClickHandler" type="function">js!MyApp.MyController:prototype.onSomeGridElemClick</option>
             * </pre>
             * @see setElemClickHandler
             */
            elemClickHandler: undefined
         },

         _itemHoveredData: {
            target: null,
            key: null,
            position: null,
            size: null
         },
         _isItemActionsVisible: false
      },
      
      $constructor: function() {
         this._publish('onChangeHoveredItem', 'onItemClick');

         if (this._options.elemClickHandler) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.ListControl', 'c 3.8.0 свойство elemClickHandler перестанет работать. Используйте событие onItemAction');
         }
         this._initView();
      },

      //region SBIS3.CONTROLS.ListControlMixin

      _onItemHovered: function (event, hash, isHover, item) {
         ListControl.superclass._onItemHovered.call(this, event, hash, isHover, item);
         this._setHoveredItem(this._hoveredItem, item);
         
         if (!isHover && !this._canChangeHoveredItem()) {
            //Если указатель ушел, и мы не сборосили текущий hovered,
            //то проверяем, перешел ли hovered на панель действий
            setTimeout(function() {
               if (this._hoveredItem &&
                  this._hoveredItem.getHash() === hash &&
                  !this._isItemsActionsHovered()
               ) {
                  //Hovered не перешел на панель действий - сбрасываем hovered
                  this._resetHoveredItem();
               }
            }.bind(this), 0);
         }
      },

      _itemAction: function(item) {
         ListControl.superclass._itemAction.call(this, item);

         if (this._options.elemClickHandler) {
            var contents = item.getContents();
            this._options.elemClickHandler.call(
               this,
               contents && $ws.helpers.instanceOfModule(contents, 'SBIS3.CONTROLS.Data.Model') ? contents.getId() : undefined,
               item
            );
         }
      },

      //endregion SBIS3.CONTROLS.ListControlMixin
      
      //region Hovered item
      
      /**
       * Возвращает текущий выделенный элемент
       * @returns {{key: null | number, container: (null | jQuery)}}
       * @example
       * <pre>
       *     editButton.bind('click', functions: (e) {
       *        var hoveredItem = this.getHoveredItem();
       *        if(hoveredItem.container) {
       *           myBigToolTip.showAt(hoveredItem.position);
       *        }
       *     })
       * </pre>
       * @see itemsActions
       * @see getItemActions
       */
      getHoveredItem: function () {
         return this._itemHoveredData;
      },
      
      /**
       * Сбрасывает текущий выделенный элемент
       * @private
       */
      _resetHoveredItem: function() {
         this._hoveredItem = undefined;
         this._view.hoverItem(this._hoveredItem);
         this._setHoveredItem(this._hoveredItem);
      },
      
      /**
       * Устанавливает текущий выделенный элемент
       * @private
       */
      _setHoveredItem: function(item, target) {
         var hash = item ? item.getHash() : null,
            isHoveredChande = this._itemHoveredData.key !== hash;
         
         if (!isHoveredChande) {
            return;
         }
         
         if (item) {
            var containerCords = this._container[0].getBoundingClientRect(),
                $target = $(target),
                targetCords = target.getBoundingClientRect();
            this._itemHoveredData = {
               key: hash,
               container: $target,
               position: {
                  top: targetCords.top - containerCords.top,
                  left: targetCords.left - containerCords.left
               },
               size: {
                  height: target.offsetHeight,
                  width: target.offsetWidth
               }
            };
         } else {
            this._itemHoveredData = {
               container: null,
               key: null,
               position: null,
               size: null
            };
         }
         
         this._notify('onChangeHoveredItem', this._itemHoveredData);
         this._onChangeItemHoveredData(this._itemHoveredData);
      },
      
      _canChangeHoveredItem: function (hash, isHover) {
         return isHover || !this._isItemActionsVisible;
      },
      
      /**
       * Обработчик на смену выделенного элемента представления
       * @private
       */
      _onChangeItemHoveredData: function (target) {
         if (this._options.itemsActions.length) {
            target.container ? this._showItemActions(target) : this._hideItemActions();
         }
      }
      
      //endregion Hovered item
   });

   return ListControl;
});
