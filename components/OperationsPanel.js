/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/OperationsPanel/OperationsPanel',
   'SBIS3.CONTROLS/Mixins/ItemsControlMixin',
   'Core/core-instance',
   'tmpl!SBIS3.CONTROLS/OperationsPanel/resources/ItemTemplate',
   'Core/moduleStubs',
   'css!SBIS3.CONTROLS/OperationsPanel/OperationsPanel'
], function(Control, dotTplFn, ItemsControlMixin, cInstance, ItemTemplate, moduleStubs) {

   var ITEMS_MENU_WIDTH = 36;

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
    * Компонент "Панель действий" используют совместно с представлениями данных ({@link SBIS3.CONTROLS/ListView} или любой его контрол-наследник),
    * с записями которых требуется производить манипуляции. Он состоит из всплывающей панели, скрытой по умолчанию, и
    * кнопки управления её отображением - {@link SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton}.
    *
    * <ul>
    *    <li>Связывание панели и представления данных производится при помощи {@link SBIS3.CONTROLS/ComponentBinder}.</li>
    *    <li>Кнопка управления должна быть связана с всплывающей панелью методом {@link SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton#setLinkedPanel}. Одной кнопкой можно управлять несколькими панелями.</li>
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
    * @class SBIS3.CONTROLS/OperationsPanel
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
    *
    * @demo Examples/OperationsPanel/MyOperationsPanel/MyOperationsPanel Пример 1. Типовые массовые операции над записями.
    *
    * @author Сухоручкин А.С.
    * @ignoreOptions contextRestriction independentContext
    *
    * @ignoreEvents onAfterLoad onChange onStateChange
    * @ignoreEvents onDragStop onDragIn onDragOut onDragStart
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component='SBIS3.CONTROLS/OperationsPanel' style="height: 30px;">
    * </component>
    */
   var OperationsPanel = Control.extend([ItemsControlMixin],/** @lends SBIS3.CONTROLS/OperationsPanel.prototype */{
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
             * Элемент пмо, который показывается, когда в связном представлении данных не выделено ни одной записи.
             * По умолчанию: false
             * @property {Boolean} mark Операции отметки.
             * Элемент, служащий для выделения записей. Такие элементы рисуются в самом начале пмо.
             * По умолчанию: false
             * @property {Boolean} selection Операции над выбранными записями.
             * Элемент пмо, который показывается, когда в связном представлении данных есть выделенные записи.
             * По умолчанию: true
             * Для того чтобы кнопки были показаны всегда, независимо от количества отмеченных записей в регистре, нужно указать  selection: true, mass: true
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
                   componentType: 'SBIS3.CONTROLS/OperationsPanel/Delete',
                   type: {
                       mass: true,
                       selection: true
                   },
                   options: {}
               },
               {
                   name: 'operationsMark',
                   componentType: 'SBIS3.CONTROLS/OperationsPanel/Mark',
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
         _isMassMode: true
      },
      $constructor: function() {
         this._publish('onToggle');
      },
      init: function() {
         OperationsPanel.superclass.init.call(this);
         var self = this;

         if (this.isVisible()) {
            this.redraw();
         }

         this.subscribe('onDrawItems', function(){
            //После перерисовки надо обновить содержимое itemsMenu
            if(self._itemsMenu){
               self._updateActionsMenuButtonItems();
               this._updatePickerClassName();
            }

            if(self._options.hasItemsMenu){
               //Следим за кнопками, извне могут менять их видимость и тогда потребудется проверить вместимость,
               //и изменить видимость элементов в меню.
               self.getItems().each(function(item){
                  var inst = self.getItemInstance(item.get('name'));
                  if(inst){
                     self.subscribeTo(inst, 'onPropertyChanged', function(e, propName){
                        if(propName === 'visible'){
                           self._checkCapacity();
                           if (self._itemsMenu) {
                              self._updateActionsMenuButtonItems();
                           }
                        }
                     });
                  }
               });
            }
         });

         //TODO При активации скрытых за область операций может произойти скроллирование к ним. Нужно его отменить.
         this._getItemsContainer().on('scroll', function(e){
            $(this).scrollLeft(0);
         })
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

      //После setItems нужно подгрузить недостающие кнопки, иначе вместо них отобразится текст. Для этого затирается Deferred,
      //который возвращается requireButtons, чтобы requireButtons при следующей отрисовке ещё раз подгрузил кнопки.
      setItems: function() {
         this._itemsLoadDeferred = null;
         OperationsPanel.superclass.setItems.apply(this, arguments);
      },

      _updateActionsMenuButtonItems: function(){
         var self = this;
         var buttonItems = [];

         //TODO ГОВНОКОДИЩЕ!!! Собираем мета описание операций через инстансы. При первой же возможности выпилить.
         var addItems = function(items, parentKey, instance){
            items.each(function(item){
               var operationType = getItemType(item.get('type'));

               if(parentKey || operationType !== 'mark'){
                  var obj = {
                     parent: parentKey || null
                  };
                  if(parentKey){
                     obj.id = item.get('id') || item.get('title');
                     obj.icon = item.get('icon');
                     obj.caption = item.get('title');
                     obj.instance = instance;
                     obj.visible = instance.isVisible();
                     obj.command = item.get('command');
                     obj.commandArgs = item.get('commandArgs');
                  }
                  else {
                     var name = item.get('name');
                     instance = self.getItemInstance(name);
                     obj.id = name;
                     obj.icon = instance.getIcon && instance.getIcon();
                     obj.caption = instance.getCaption && instance.getCaption();
                     obj.instance = instance;
                     obj.className = 'controls-operationsPanel__actionType-' + getItemType(item.get('type'));
                     obj.visible = instance.isVisible();

                     if(typeof instance.getItems === 'function'){
                        var childItems = instance.getItems();
                        if(childItems && childItems.getCount() > 1){
                           addItems(childItems, name, instance);
                        }
                     }
                  }

                  buttonItems.push(obj);
               }

               //После обновления операции выделения записей, проверим вместимость
               if(operationType === 'mark'){
                  var markInstance = self.getItemInstance(item.get('name'));
                  self.subscribeTo(markInstance, 'onMarkUpdated', function(){
                     self._checkCapacity();
                  });
               }
            });
         };

         addItems(this.getItems());
         this._itemsMenu.setItems(buttonItems);
      },

      _setVisibility: function(show) {
         if (this.isVisible() !== show) {
            this._isVisible = show;
            // убрал анимацию т.к. в Engine браузере панель находится в фиксированном заголовке и при анимации перекрывает контент
            // TODO вернуть анимацию, так чтобы контент в Engine браузере также был анимирован
            // на страницах с внутренними скролами панель операций может находиться не в фиксированном заголовке и для этого случая можно вернуть старый алгоритм анимации
            this._container.toggleClass('ws-hidden', !show);
            if (show) {
               this.redraw();
            }
            // При изменении видимости панели операций нкак минимум надо пересчитать размеры зафиксированных заголовков.
            // В большинстве случаев событие об изменеии размеро генерируется таблицей при открытии панели операций
            // но не всегда.
            this._notifyOnSizeChanged(true);
            this._notify('onToggle');
         }
      },

      onSelectedItemsChange: function(idArray) {
         this._isMassMode = !idArray.length;
         this._container.toggleClass('controls-operationsPanel__massMode', this._isMassMode)
                        .toggleClass('controls-operationsPanel__selectionMode', !this._isMassMode);

         if (this.isVisible()) {
            this._onSelectedItemsChange(idArray);
         } else {
            this.once('onDrawItems', function() {
               this._onSelectedItemsChange(idArray);
            }.bind(this));
         }

         if(this._options.hasItemsMenu){
            this._updatePickerClassName();
            this._checkCapacity();
         }
      },

      _updatePickerClassName: function() {
         var pickerContainer;

         if (this._itemsMenu && this._itemsMenu.getPicker()) {
            pickerContainer = this._itemsMenu.getPicker().getContainer();
            pickerContainer.toggleClass('controls-operationsPanel__massMode', this._isMassMode);
            pickerContainer.toggleClass('controls-operationsPanel__selectionMode', !this._isMassMode);
         }
      },

      _onSelectedItemsChange: function(idArray) {
         var
            instances = this.getItemsInstances(),
            instance;
         //Прокидываем сигнал onSelectedItemsChange из браузера в кнопки
         for (instance in instances) {
            if (instances.hasOwnProperty(instance)) {
               if (typeof instances[instance].onSelectedItemsChange === 'function') {
                  instances[instance].onSelectedItemsChange(idArray);
               }
            }
         }
      },
      _onResizeHandler: function(){
         if(this.isVisible()){
            this._checkCapacity();
         }
         OperationsPanel.superclass._onResizeHandler.apply(this, arguments);
      },

      /*
       * Метод проверяет все ли операции умещаются, если нет, то показывает кнопку с меню
       * */
      _checkCapacity: function(){
         var
            itemsWidth,
            containerWidth,
            container = this.getContainer();
         if (!this._options.hasItemsMenu) {

            /*
               TODO Очередное хреновое решение для ПМО.
               Если Не влезают операции, и нельзя заюзать механизм с меню,
               то будем скрывать caption на операциях с классом controls-operationsPanel__action-withoutCaption
             */

            //Перед расчетом ширини кнопок, сбросим режим withoutCaptionsMode, чтобы вычислить реальную ширину кнопок.
            container.toggleClass('controls-operationsPanel__mode-withoutCaptions', false);
            itemsWidth = this._getItemsContainer().width();
            containerWidth = container.width();
            container.toggleClass('controls-operationsPanel__mode-withoutCaptions', containerWidth <= itemsWidth);

            /*TODO Конец*/

            return;
         }

         /* Доступная под операции ширина = Ширина контейнера - ширина кнопки с меню*/
         var allowedWidth = container.width() - ITEMS_MENU_WIDTH;

         /* Проверяем на вместимость только видимые операции. Операции линейно лежат в контейнере, поэтому для оптимизации выборки проверим только детей первого уровня. */
         var operations = this._getItemsContainer().find('> .js-controls-operationsPanel__action:visible');

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
            this._itemsMenu.getContainer().toggleClass('ws-hidden', !isMenuNecessary);
         }
      },

      redraw: function() {
         var self = this;
         if (this.isVisible()) {
            this.requireButtons().addCallback(function() {
               self.once('onDrawItems', function() {
                  self._checkCapacity();
               });
               OperationsPanel.superclass.redraw.call(self);
            });
         }
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

         if(!this._itemsMenuCreated){
            this._itemsMenuCreated = true;
            moduleStubs.require(['SBIS3.CONTROLS/Menu/MenuIcon']).addCallback(function (MenuIcon) {

               var massMode = self._container.hasClass('controls-operationsPanel__massMode');
               var selectionMode = self._container.hasClass('controls-operationsPanel__selectionMode');

               self._itemsMenu = new MenuIcon[0]({
                  parent: self,
                  element: $('<span>').insertAfter(self._getItemsContainer()),
                  name: 'itemsMenu',
                  className: 'controls-Menu__hide-menu-header controls-operationsPanel__itemsMenu',
                  idProperty: 'id',
                  parentProperty: 'parent',
                  displayProperty: 'caption',
                  icon: 'sprite:icon-size icon-ExpandDown icon-primary action-hover',
                  pickerConfig: {
                     closeButton: true,
                     crossStyle: 'light',
                     className: 'controls-operationsPanel__itemsMenu_picker' +
                        (massMode ? ' controls-operationsPanel__massMode' : '') +
                        (selectionMode ? ' controls-operationsPanel__selectionMode' : ''),
                     horizontalAlign: {
                        side: 'right',
                        offset: 48
                     },
                     locationStrategy: 'bodyBounds'
                  }
               });

               self._itemsMenu._setPickerContent = function() {
                  $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-size icon-Close icon-primary action-hover');
               };

               self.subscribeTo(self._itemsMenu, 'onMenuItemActivate', function(e, id, event){
                  var item = this.getItems().getRecordById(id);
                  if (item) {
                     var instance = item.get('instance');
                     var menuItems;
                     if(cInstance.instanceOfModule(instance, 'SBIS3.CONTROLS/Menu/MenuLink') && (menuItems = instance.getItems()) && menuItems.getCount() > 1){
                        instance._notify('onMenuItemActivate', id);
                     }
                     else if(cInstance.instanceOfMixin(instance, 'SBIS3.CONTROLS/Mixins/Clickable')) {
                        instance._onClickHandler(event);
                     }
                     else {
                        instance._clickHandler();
                     }
                     return false;
                  }
               });

               self._updateActionsMenuButtonItems();
               self._itemsMenu.getContainer().toggleClass('ws-hidden', false);
            });
         }
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
