/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanel', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.DSMixin',
   'Core/helpers/collection-helpers',
   "Core/helpers/functional-helpers",
   'Core/helpers/markup-helpers',
   'Core/core-instance',
   'js!SBIS3.StickyHeaderManager',
   /*TODO это должна подключать не панель а прекладники, потом убрать*/
   'js!SBIS3.CONTROLS.OperationDelete',
   'js!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.OperationMove',
   'js!SBIS3.CONTROLS.MenuIcon',
   'css!SBIS3.CONTROLS.OperationsPanel'
], function(Control, dotTplFn, DSMixin, colHelpers, fHelpers, mkpHelpers, cInstance, StickyHeaderManager) {

   var ITEMS_MENU_WIDTH = 28;

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
    * @demo SBIS3.CONTROLS.Demo.SumAction Пример 2. Операция суммирования записей, которая реализована с использованием {@link SBIS3.CONTROLS.Action.List.Sum}.
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
   var OperationsPanel = Control.extend([DSMixin],/** @lends SBIS3.CONTROLS.OperationsPanel.prototype */{
      /**
       * @event onToggle Происходит при изменении видимости панели действий: появление или скрытие.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
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
         _blocks: undefined,
         _itemsDrawn: false
      },
      $constructor: function() {
         this._initBlocks();
         this._publish('onToggle');
         
      },
      init: function() {
         OperationsPanel.superclass.init.call(this);

         if(this._options.hasItemsMenu){
            this._itemsMenu = this.getChildControlByName('itemsMenu');
            this._checkCapacity();

            //TODO
            this._itemsMenu._setPickerContent = function() {
               $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-24 icon-size icon-ExpandUp icon-primary action-hover');
            };
            //TODO Конец

            this.subscribeTo(this._itemsMenu, 'onMenuItemActivate', function(e, id){
               this.getItems().each(function(item){
                  if(item.get('id') === id){
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
            });
         }

         //Отрисуем элементы если панель изначально показана
         if (this.isVisible()) {
            this.reload();
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

      _drawItemsCallback: function() {
         this._itemsDrawn = true;
         if(this._options.hasItemsMenu){
            this._updateActionsMenuButtonItems();
         }
      },

      _updateActionsMenuButtonItems: function(){
         var self = this;
         var buttonItems = [];

         //TODO ГОВНОКОДИЩЕ!!! Собираем мета описание операций через инстансы. При первой же возможности выпилить.
         var addItems = function(items, parentKey, instance){
            items.each(function(item){
               if(parentKey || self._getItemType(item.get('type')) !== 'mark'){
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
                     obj.className = 'controls-operationsPanel__actionType-' + self._getItemType(item.get('type'));

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
         var self = this;
         this._initBlocks();
         if (!this._itemsDrawn && show) {
            this.reload();
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

      _initBlocks: function() {
         if (!this._blocks) {
            this._blocks = {
               markOperations: this._container.find('.controls-operationsPanel__actionMark'),
               allOperations: this._container.find('.controls-operationsPanel__actions'),
               wrapper: this._container.find('.controls-operationsPanel__wrapper')
            };
         }
      },
      _getTargetContainer: function(item) {
         return this._blocks[item.get('type').mark ? 'markOperations' : 'allOperations'];
      },
      _getItemTemplate: function() {
         var self = this;
         return function (cfg) {
            var
                className,
                item = cfg.item,
                options = item.get('options') || {},
                type = self._getItemType(item.get('type'));
            className = 'js-controls-operationsPanel__action controls-operationsPanel__actionType-' + type;
            return '<component class="' + className + '" data-component="' + item.get('componentType').substr(3) + '" config="' + mkpHelpers.encodeCfgAttr(options) + '"></component>';
         };
      },
      _getItemType: function (type) {
         return type.mark ? 'mark' : type.mass && type.selection ? 'all' : type.mass ? 'mass' : 'selection';
      },
      onSelectedItemsChange: function(idArray) {
         this._blocks.wrapper.toggleClass('controls-operationsPanel__massMode', !idArray.length)
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
         /* Доступная под операции ширина = Ширина контейнера - ширина блока операции выделения - ширина кнопки с меню*/
         var allowedWidth = container.width() - this._blocks.markOperations.width() - ITEMS_MENU_WIDTH;

         var operations = this._blocks.allOperations.find('.js-controls-operationsPanel__action:visible');

         var width = 0;
         var isMenuNecessary = false;
         this._blocks.allOperations.css('width', '');

         for(var i = 0, l = operations.length; i < l; i++){
            var elemWidth = $(operations[i]).outerWidth(true);

            /* Если текущая ширина привышает доступную, то ограничеваем ее, таким образом, кнопка с меню прижмется справа */
            if(width + elemWidth > allowedWidth){
               isMenuNecessary = true;
               this._blocks.allOperations.css('width', width);
               break;
            }
            else {
               width += elemWidth;
            }
         }

         this.getChildControlByName('itemsMenu').getContainer().toggleClass('ws-hidden', !isMenuNecessary);
      },

      destroy: function() {
         this._blocks = null;
         OperationsPanel.superclass.destroy.apply(this);
      }
   });
   return OperationsPanel;
});