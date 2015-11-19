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
             *
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
      /**
       * Открыть панель массовых операций.
       */
      open: function() {
         this._toggle(true);
      },
      /**
       * Закрыть панель массовых операций.
       */
      close: function() {
         this._toggle(false);
      },
      /**
       * Получить состояние панели.
       * @returns {Boolean} Состояние панели массовых операций.
       * Возможные значения:
       * <ol>
       *    <li>true - панель открыта,</li>
       *    <li>false - панель закрыта.</li>
       * </ol>
       */
      isOpen: function() {
         return !this._container.hasClass('ws-hidden');
      },
      _toggle: function(toggle) {
         if (this.isOpen() !== toggle) {
            this.togglePanel();
         }
      },
      /**
       * Поменять состояние панели на противоположное.
       */
      togglePanel: function() {
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
      /**
       * Установить видимость блока с операциями отметки.
       * @param visible
       */
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
       * Получить инстансы всех элементов панели массовых операций.
       * @returns {Array}
       */
      getItemInstance: function() {
         if (!this._itemsDrawn) {
            this._drawItems();
         }
         return OperationsPanel.superclass.getItemInstance.apply(this, arguments);
      },
       /**
        * Получить режим работы панели.
        * Режим работы панели информирует о том над какими записями
        * связанного представления данных будут выполняться операции.
        * @returns {Boolean} Режим работы панели массовых операций.
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
         this._currentMode = isSelection = !!isSelection;
         this._blocks.wrapper.toggleClass('controls-operationsPanel__massMode', !isSelection).toggleClass('controls-operationsPanel__selectionMode',  isSelection);
      },
      destroy: function() {
         OperationsPanel.superclass.destroy.apply(this);
      }
   });
   return OperationsPanel;
});