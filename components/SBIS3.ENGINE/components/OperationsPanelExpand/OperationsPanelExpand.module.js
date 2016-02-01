define('js!SBIS3.Engine.OperationsPanelExpand', [
   'js!SBIS3.CONTROLS.ButtonGroupBaseDS',
   'html!SBIS3.Engine.OperationsPanelExpand',
   'css!SBIS3.Engine.OperationsPanelExpand',
   'js!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.IconButton'
], function (ButtonGroupBaseDS, dotTplFn) {
   'use strict';
   /**
    * SBIS3.Engine.OperationsPanelExpand
    * @class SBIS3.Engine.OperationsPanelExpand
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    */
   var OperationsPanelExpand = ButtonGroupBaseDS.extend(/** @lends SBIS3.Engine.OperationsPanelExpand.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} развернута ли панель с массовыми операциями
             * Возможные значения:
             * <ul>
             *    <li>true - панель развернута;</li>
             *    <li>false - панель свернута.</li>
             * </ul>
             * @see setExpand
             */
            isExpanded: false,
            /**
             * @typedef {Object} Type
             * @property {Boolean} mass Массовые операции.
             * @property {Boolean} mark Операции отметки.
             * @property {Boolean} [selection=true] Операции над выбранными записями.
             */
            /**
             * @typedef {Object} Items
             * @property {String} name Имя кнопки панели массовых операций.
             * @property {String} componentType Тип компонента, определяющий формат. Например, SBIS3.CONTROLS.Link для кнопки в виде ссылки
             * @property {Type} type Тип операций.
             * @property {Object} options Настройки компонента, переданного в componentType. Например, если был указан SBIS3.CONTROLS.Link, то указываем его опции
             *
             */
            /**
             * @cfg {Items[]} опции для панели массовых операций {@link SBIS3.CONTROLS.OperationsPanel}
             * @see getOperationsPanel
             */
            operationsPanelConfig: null
         },
         _operationsPanel: null,
         _expandButton: null
      },
      $constructor: function () {
      },

      init: function () {
         OperationsPanelExpand.superclass.init.call(this);

         var self = this;
         this._operationsPanel = this.getChildControlByName('operationsPanelExpand__massOperation');
         //TODO вроде как предполагается переименовать метод open на show
         this._operationsPanel.open();
         this._expandButton = this.getChildControlByName('operationsPanelExpand__IconButton');
         this._expandButton.subscribe('onActivated', function() {
            self.setExpand(!self._options.isExpanded);
         });
         self.setExpand(self._options.isExpanded);
      },

      /**
       * Разворачивает/Сворачивает панель массовых операций
       * @param {Boolean} isExpand
       * <ul>
       *    <li>true -  развернуть панель;</li>
       *    <li>false - свернуть панель.</li>
       * </ul>
       * @example
       * <pre>
       *     this.getChildControlByName('OperationsPanelExpand').setExpand(true);
       * </pre>
       * @see isExpanded
       */
      setExpand: function(isExpand) {
         this._options.isExpanded = isExpand;
         this._container.toggleClass('engine-OperationsPanelExpand__expanded', isExpand);
         if (isExpand) {
            this._expandButton.setIcon('sprite:icon-16 icon-Next icon-primary');
         } else {
            this._expandButton.setIcon('sprite:icon-16 icon-Back icon-primary');
         }
      },

      /**
       * Возвращает панель массовых операций (SBIS3.CONTROLS.OperationsPanel)
       * @see operationsPanelConfig
       */
      getOperationsPanel: function() {
         return this._operationsPanel;
      },

      _getItemTemplate : function(item) {
         var caption = item.get(this._options.displayField),
             icon = item.get('icon') ? '<option name="icon">' + item.get('icon') + '</option>' : '';
         return '<component data-component="SBIS3.CONTROLS.Link">' +
            '<option name="caption">' + caption + '</option>' +
            icon +
            '</component>';
      },

      /**
       * Переопределяем получение контейнера для элементов
       */
      _getItemsContainer: function () {
         return this._container.find('.engine-OperationsPanelExpand__content');
      }
   });
   return OperationsPanelExpand;
});