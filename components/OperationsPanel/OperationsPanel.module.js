/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanel', [
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.ItemsControlMixin',
   'Core/helpers/collection-helpers',
   "Core/helpers/functional-helpers",
   'Core/helpers/markup-helpers',
   'Core/core-instance',
   'js!SBIS3.StickyHeaderManager',
   'tmpl!SBIS3.CONTROLS.OperationsPanel/resources/ItemTemplate',
   'Core/moduleStubs',
   'css!SBIS3.CONTROLS.OperationsPanel'
], function(Control, dotTplFn, ItemsControlMixin, colHelpers, fHelpers, mkpHelpers, cInstance, StickyHeaderManager, ItemTemplate, moduleStubs) {

   var ITEMS_MENU_WIDTH = 28;

   var
      buildTplArgs = function(cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.getItemType = getItemType;
         return tplOptions;
      },
      getItemType = function (type) {
         var result = 'selection';
         if (type) {
            if (type.mark) {
               result = 'mark';
            } else if (type.mass && type.selection) {
               result = 'all';
            } else if (type.mass) {
               result = 'mass';
            }
         }

         return result;
      };

   /**
    * Компонент "Панель действий" используют совместно с представлениями данных ({@link SBIS3.CONTROLS.ListView} или любой его контрол-наследник),
    * с записями которых требуется производить манипуляции. Он состоит из всплывающей панели, скрытой по умолчанию, и
    * кнопки управления её отображением - {@link SBIS3.CONTROLS.OperationsPanelButton}.
    *
    * <ul>
    *    <li>Связывание панели и представления данных производится при помощи {@link SBIS3.CONTROLS.ComponentBinder}.</li>
    *    <li>Кнопка управления должна быть связана с всплывающей панелью методом {@link SBIS3.CONTROLS.OperationsPanelButton#setLinkedPanel}. Одной кнопкой можно управлять несколькими панелями.</li>
    *    <li>Набор действий, отображаемых на панели, настраивают в опции {@link items}.</li>
    * </ul>
    *
    * Существуют следующие категории действий:
    * <ol>
    *    <li>Действия над отмеченными записями: Распечатать, Выгрузить, Переместить и Удалить.</li>
    *    <li>Действия над всем реестром. Они сгруппированы в кнопке-меню "Отметить", рядом с которой отображается
    *    счетчик выделенных записей. В меню доступны следующие действия: <br/>
    *       <ul>
    *          <li><i>Всю страницу</i>. Выделяет все записи в связанном представлении данных, которые отображены на данной
    *          веб-странице.</li>
    *          <li><i>Снять</i>. Сбрасывает выделенные записи.</li>
    *          <li><i>Инвертировать</i>. Сбрасывает выделенные записи, и выделяет те, что не были выделены ранее.</li>
    *       </ul>
    *    </li>
    * </ol>
    *
    * Также допустимо создание новых действий, для которых настраивается иконка и поведение при клике.
    * @class SBIS3.CONTROLS.OperationsPanel
    * @extends SBIS3.CORE.CompoundControl
    *
    * @demo SBIS3.CONTROLS.Demo.MyOperationsPanel Пример 1. Типовые массовые операции над записями.
    *
    * @author Крайнов Дмитрий Олегович
    * @ignoreOptions contextRestriction independentContext
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsPanel' style="height: 30px;">
    * </component>
    */
   var OperationsPanel = Control.extend([ItemsControlMixin],/** @lends SBIS3.CONTROLS.OperationsPanel.prototype */{
      /**
       * @event onToggle Происходит при изменении видимости панели действий: появление или скрытие.
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            _buildTplArgs: buildTplArgs,
            _defaultItemTemplate: ItemTemplate,
            _serverRender: true,
            /**
             * @typedef {Object} Type
             * @property {Boolean} mass Массовые операции.
             * @property {Boolean} mark Операции отметки.
             * @property {Boolean} selection Операции над выбранными записями.
             */
            /**
             * @typedef {Object} Items
             * @property {String} name Имя кнопки панели массовых операций.
             * @property {String} componentType Тип компонента, определяющий формат.
             * @property {Type} type Тип операций.
             * @property {Object} options Настройки компонента, переданного в componentType.
             */
            /**
             * @cfg {Items[]} Набор исходных данных, по которому строится отображение
             */
            items: [
               {
                   name: 'delete',
                   componentType: 'js!SBIS3.CONTROLS.OperationDelete',
                   type: {
                       mass: true,
                       selection: true
                   },
                   options: {}
               },
               {
                   name: 'operationsMark',
                   componentType: 'js!SBIS3.CONTROLS.OperationsMark',
                   type: {
                       'mark': true
                   },
                   options: {}
               }
            ],
             /**
              * @noShow
              */
             idProperty: 'name',
            /**
             * @cfg {Boolean} Флаг наличия блока с операциями отметки
             */
            hasMarkBlock: true,
            visible: false,
            /**
             * @cfg {Boolean} Показывать ли кнопку с операциями, если операции не помещаются
             */
            hasItemsMenu: false
         },
         _itemsDrawn: false
      },
      $constructor: function() {
         this._publish('onToggle');
      },
      init: function() {
         OperationsPanel.superclass.init.call(this);
         if (this.isVisible()) {
            this.redraw();
         }
      },

      //Суперкласс у панели операций в методе getItems возвращает this._items. Но возможнно в items которые были переданы в
      //опции были указаны бинды. В таком случае при инициализации контрол попытается установить свойства из контекста в контрол.
      //Для установки значения необходимо получить опцию items, она получается с помощью метода getItems, который вернёт _items,
      //но в _items у нас лежит recordSet и при иницализации он ещё не создался, или как в панели, может быть отложенная инициализация
      //элементов. Тогда метод getItems вернёт null, и значение из контекста в контрол не попадёт. Для решения данной пробелмы,
      //если элементов ещё нет, то вернём опции, и при синхронизации, значение из контекста попадёт прямо в опции.
      getItems: function() {
         var items = OperationsPanel.superclass.getItems.call(this);
         return items ? items : this._options.items;
      },

      _updateActionsMenuButtonItems: function(){
         var self = this;
         var buttonItems = [];

         //TODO ГОВНОКОДИЩЕ!!! Собираем мета описание операций через инстансы. При первой же возможности выпилить.
         var addItems = function(items, parentKey, instance){
            items.each(function(item){
               if(parentKey || getItemType(item.get('type')) !== 'mark'){
                  var obj = {
                     parent: parentKey || null
                  };
                  if(parentKey){
                     obj.id = item.get('id') || item.get('title');
                     obj.icon = item.get('icon');
                     obj.caption = item.get('title');
                     obj.instance = instance;
                  }
                  else {
                     var name = item.get('name');
                     instance = self.getItemInstance(name);
                     obj.id = name;
                     obj.icon = instance.getIcon();
                     obj.caption = instance.getCaption();
                     obj.instance = instance;
                     obj.className = 'controls-operationsPanel__actionType-' + getItemType(item.get('type'));

                     if(typeof instance.getItems === 'function'){
                        var childItems = instance.getItems();
                        if(childItems.getCount() > 1){
                           addItems(childItems, name, instance);
                        }
                     }
                  }

                  buttonItems.push(obj);
               }
            });
         };

         addItems(this.getItems());
         this._itemsMenu.setItems(buttonItems);
      },

      _setVisibility: function(show) {
         if (!this._itemsDrawn && show) {
            this.redraw();
         }
         if (this.isVisible() !== show) {
            this._isVisible = show;
            // убрал анимацию т.к. в Engine браузере панель находится в фиксированном заголовке и при анимации перекрывает контент
            // TODO вернуть анимацию, так чтобы контент в Engine браузере также был анимирован
            // на страницах с внутренними скролами панель операций может находиться не в фиксированном заголовке и для этого случая можно вернуть старый алгоритм анимации
            this._container.toggleClass('ws-hidden', !show);
            // Если контрол находится в фиксированном заголовке, то обновляем размеры заголовков
            if (this._isSticky()) {
               StickyHeaderManager.checkStickyHeaderSize();
            }
            this._notify('onToggle');
         }
      },

      _isSticky: fHelpers.memoize(function () {
         return !!this.getContainer().closest('.ws-sticky-header__block').length;
      }, '_isSticky'),

      onSelectedItemsChange: function(idArray) {
         this._container.toggleClass('controls-operationsPanel__massMode', !idArray.length)
                             .toggleClass('controls-operationsPanel__selectionMode', !!idArray.length);

         if (this._itemsDrawn) {
            this._onSelectedItemsChange(idArray);
         } else {
            this.once('onDrawItems', function() {
               this._onSelectedItemsChange(idArray);
            }.bind(this));
         }

         if(this._options.hasItemsMenu){
            var pickerContainer = $('.controls-operationsPanel__itemsMenu_picker');
            pickerContainer.toggleClass('controls-operationsPanel__massMode', !idArray.length);
            pickerContainer.toggleClass('controls-operationsPanel__selectionMode', !!idArray.length);

            this._checkCapacity();
         }
      },
      _onSelectedItemsChange: function(idArray) {
         //Прокидываем сигнал onSelectedItemsChange из браузера в кнопки
         colHelpers.forEach(this.getItemsInstances(), function(instance) {
            if (typeof instance.onSelectedItemsChange === 'function') {
               instance.onSelectedItemsChange(idArray);
            }
         });
      },
      _onResizeHandler: function(){
         if(this._options.hasItemsMenu && this._itemsDrawn){
            this._checkCapacity();
         }
      },

      /*
       * Метод проверяет все ли операции умещаются, если нет, то показывает кнопку с меню
       * */
      _checkCapacity: function(){
         var container = this.getContainer();

         /* Доступная под операции ширина = Ширина контейнера - ширина кнопки с меню*/
         var allowedWidth = container.width() - ITEMS_MENU_WIDTH;

         var operations = this._getItemsContainer().find('.js-controls-operationsPanel__action:visible');

         var width = 0;
         var isMenuNecessary = false;
         this._getItemsContainer().css('width', '');

         for(var i = 0, l = operations.length; i < l; i++){
            var elemWidth = $(operations[i]).outerWidth(true);

            /* Если текущая ширина привышает доступную, то ограничеваем ее, таким образом, кнопка с меню прижмется справа */
            if(width + elemWidth > allowedWidth){
               isMenuNecessary = true;
               this._getItemsContainer().css('width', width);
               break;
            }
            else {
               width += elemWidth;
            }
         }

         if (isMenuNecessary) {
            this._createItemsMenu();
         }

         if (this._itemsMenu) {
            this.getChildControlByName('itemsMenu').getContainer().toggleClass('ws-hidden', !isMenuNecessary);
         }
      },

      redraw: function() {
         var self = this;
         this.requireButtons().addCallback(function() {
            OperationsPanel.superclass.redraw.call(self);
            self._itemsDrawn = true;
         });
      },

      requireButtons: function() {
         if (!this._itemsLoadDeferred) {
            var types = [];
            this.getItems().each(function(item) {
               types.push(item.get('componentType'));
            });
            this._itemsLoadDeferred = moduleStubs.require(types);
         }
         return this._itemsLoadDeferred;
      },

      _createItemsMenu: function() {
         var self = this;
         if (this._itemsMenuLoaded) {
            return;
         }
         self._itemsMenuLoaded = true;
         moduleStubs.require(['js!SBIS3.CONTROLS.MenuIcon']).addCallback(function (MenuIcon) {
            var menuIcon = new MenuIcon[0]({
               element: $('<span>').insertAfter(self._getItemsContainer()),
               name: 'itemsMenu',
               className: 'controls-Menu__hide-menu-header controls-operationsPanel__itemsMenu',
               idProperty: 'id',
               parentProperty: 'parent',
               displayProperty: 'caption',
               icon: 'sprite:icon-24 icon-ExpandDown icon-primary action-hover',
               pickerConfig: {
                  closeButton: true,
                  className: 'controls-operationsPanel__itemsMenu_picker controls-operationsPanel__massMode',
                  horizontalAlign: {
                     side: 'right',
                     offset: 48
                  }
               }
            });
            self.registerChildControl(menuIcon);
            self._itemsMenu = menuIcon;
            menuIcon.getContainer().toggleClass('ws-hidden', false);
            self._itemsMenu._setPickerContent = function() {
               $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-24 icon-size icon-ExpandUp icon-primary action-hover');
            };
            self.subscribeTo(self._itemsMenu, 'onMenuItemActivate', function(e, id){
               var item = this.getItems().getRecordById(id);
               if (item) {
                  var instance = item.get('instance');
                  if(cInstance.instanceOfModule(instance, 'SBIS3.CONTROLS.MenuLink') && instance.getItems().getCount() > 1){
                     instance._notify('onMenuItemActivate', id);
                  }
                  else {
                     instance._clickHandler();
                  }
                  return false;
               }
            });
            self._updateActionsMenuButtonItems();
            self.getChildControlByName('itemsMenu').getContainer().toggleClass('ws-hidden', false);
         });
      },

      _getItemsContainer: function() {
         if (!this._actions) {
            this._actions = this.getContainer().find('.controls-operationsPanel__actions');
         }
         return this._actions;
      }
   });
   return OperationsPanel;
});