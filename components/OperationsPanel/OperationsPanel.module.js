/**
 * Created by as.suhoruchkin on 12.03.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanel', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.CollectionMixin',
   /*TODO это должна подключать не панель а прекладники, потом убрать*/
   'js!SBIS3.CONTROLS.OperationDelete',
   'js!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.OperationMove'
], function(Control, dotTplFn, CollectionMixin) {
   /**
    * Панель действий – это контрол веб-фреймворка WS, предназначенный для осуществления массовых действий над записями
    * связанного представления данных.
    *
    * Связывание панели и представления данных производится при помощи контроллера {@link SBIS3.CONTROLS.ComponentBinder}.
    * В качестве представления данных допускается выбирать компонент {@link SBIS3.CONTROLS.ListView} и любой его контрол-наследник.
    *
    * Список возможных действий над записями таков:
    * <ol>
    *    <li>Действия над отмеченными записями<br/>
    *       <ul>
    *          <li>Распечатать</li>
    *          <li>Выгрузить</li>
    *          <li>Переместить</li>
    *          <li>Удалить</li>
    *       </ul>
    *    </li>
    *    <li>Массовые действия над всем реестром. Они расположены в кнопке с выпадающим меню - "Отметить".
    *    Рядом с данной кнопкой дополнительно отображается счетчик - число выделенных записей.
    *    В меню доступны следующие действия:
    *       <ul>
    *          <li><i>Всю страницу</i>. Выделяет все записи в связанном представлении данных, которые отображены на данной
    *          веб-странице.</li>
    *          <li><i>Снять</i>. Сбрасывает выделенные записи.</li>
    *          <li><i>Инвертировать</i>. Сбрасывает выделенные записи, и выделяет те, что не были выделены ранее.</li>
    *       </ul>
    *    </li>
    * </ol>
    *
    * Кроме базовых действий, доступных для выбора по умолчанию, возможно создание новых действий, для которых
    * конфигурируется иконка на панели действий, её положение и поведение при клике.
    *
    * Набор доступных действий настраивается в опции {@link items}.
    *
    * Все действия панели применяются только к выделенным записям связанного представления данных.
    * Выделение записи производится либо установкой напротив неё чекбокса, либо при помощи меню “Отметить” на панели действий.
    *
    * По умолчанию панель действий скрыта и в интерфейсе отображается в виде кнопки со стрелкой, направленной вниз.
    * При нажатии на кнопку происходит сдвиг контента веб-страницы вниз на 30px (высоту панели действий), и появление
    * самой панели действий, внутри которой отображены доступные действия над записями. Скрытие панели производится
    * повторным нажатие на ту же кнопку. При этом контент веб-страницы поднимается вверх на 30px.
    * @class SBIS3.CONTROLS.OperationsPanel
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @ignoreOptions contextRestriction independentContext
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsPanel' style="height: 30px;">
    *
    * </component>
    */
   var OperationsPanel = Control.extend([CollectionMixin],/** @lends SBIS3.CONTROLS.OperationsPanel.prototype */{
      _dotTplFn: dotTplFn,
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
        *
        */
       /**
        * @cfg {Items[]} Набор исходных данных, по которому строится отображение
        * @name SBIS3.CONTROLS.OperationsPanel#items
        * @example
        * <pre>
        *
        * </pre>
        */
      $protected: {
         _options: {
             /**
              * @cfg  Набор элементов панели массовых операций
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
            keyField: 'name'
         },
         _blocks: undefined
      },

      $constructor: function() {
         this._publish('onToggle', 'onChangeEnabled');
         this._container.removeClass('ws-area');
         this._blocks = {
            markOperations: this._container.find('.controls-operationsPanel__actionMark'),
            allOperations: this._container.find('.controls-operationsPanel__actions'),
            wrapper: this._container.find('.controls-operationsPanel__wrapper')
         };
         this.setVisibleMarkBlock(true);
      },
      _drawItemsCallback: function() {
         this._itemsDrawn = true;
      },
      open: function() {
         this._toggle(true);
      },
      close: function() {
         this._toggle(false);
      },
      isOpen: function() {
         return !this._container.hasClass('ws-hidden');
      },
      _toggle: function(toggle) {
         if (this.isOpen() !== toggle) {
            this.toggle();
         }
      },
      toggle: function() {
         var self = this,
            isOpen = this.isOpen();
         if (!this._itemsDrawn) {
            this._drawItems();
         }
         this._container.removeClass('ws-hidden');
         this._blocks.wrapper.animate({'margin-top': isOpen ? '-30px' : 0},
            {
               duration: 150,
               easing: 'linear',
               complete: function(){
                  self._container.toggleClass('ws-hidden', isOpen);
                  self._notify('onToggle');
               }
            });
      },
      setVisibleMarkBlock: function(visible) {
         this._blocks.markOperations.toggleClass('ws-hidden', !visible);
      },
      _getTargetContainer: function(item) {
         return this._blocks[item.type.mark ? 'markOperations' : 'allOperations'];
      },
      _getItemTemplate: function() {
         return function (cfg) {
            var type = this._getItemType(cfg.type);
            cfg.options = cfg.options || {};
            cfg.options.className = 'controls-operationsPanel__actionType-' + type;
            /*TODO костыль, чтобы в контроллере прокинуть linkedView*/
            if (this._addItemOptions){
               this._addItemOptions(cfg.options);
            }
            return {
               componentType: cfg.componentType,
               config: cfg.options
            };
         }
      },
      _getItemType: function (type) {
         return type.mark ? 'mark' : type.mass && type.selection ? 'all' : type.mass ? 'mass' : 'selection';
      },
       /**
        * Установить возможность взаимодействия с панелью массовых операций.
        * @param enabled
        */
      setEnabled: function(enabled) {
         if (!enabled) {
            this.close();
         }
         OperationsPanel.superclass.setEnabled.apply(this, arguments);
         this._notify('onChangeEnabled');
      },
       /**
        *
        * @returns {*}
        */
      getItemInstance: function() {
         if (!this._itemsDrawn) {
            this._drawItems();
         }
         return OperationsPanel.superclass.getItemInstance.apply(this, arguments);
      },
       /**
        * Получить состояние панели.
        * Состояние панели информирует о режиме работы с записями связанного представления данных.
        * @returns {Boolean} Состояние панели массовых операций.
        * Возможные значения:
        * <ol>
        *    <li>true - управление отмеченными записями,</li>
        *    <li>false - управление всеми записями.</li>
        * </ol>
        */
      getPanelState: function() {
         return this._currentMode;
      },
      /**
       * Установить состояние панели.
       * Состояние панели информирует о режиме работы с записями связанного представления данных.
       * @param {Boolean} Состояние панели массовых операций.
       * Возможные значения:
       * <ol>
       *    <li>true - управление отмеченными записями,</li>
       *    <li>false - управление всеми записями.</li>
       * </ol>
       */
      setPanelState: function(isSelection) {
         this._currentMode = isSelection;
         this._blocks.wrapper.toggleClass('controls-operationsPanel__massMode', !isSelection).toggleClass('controls-operationsPanel__selectionMode',  isSelection);
      },
      destroy: function() {
         OperationsPanel.superclass.destroy.apply(this);
      }
   });
   return OperationsPanel;
});