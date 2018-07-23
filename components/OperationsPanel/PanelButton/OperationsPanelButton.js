/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton', [
   'Lib/Control/Control',
   'SBIS3.CONTROLS/Mixins/Clickable',
   'SBIS3.CONTROLS/Mixins/Checkable',
   'tmpl!SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton',
   'Core/core-instance',
   'css!SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton'
], function(Control, Clickable, Checkable, dotTplFn, cInstance) {

   /**
    * Кнопка управления панелью массовых операций.
    *
    * SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton
    * @class SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton
    * @extends Lib/Control/Control
    * @author Сухоручкин А.С.
    *
    * @mixes SBIS3.CONTROLS/Mixins/Clickable
    * @mixes SBIS3.CONTROLS/Mixins/Checkable
    *
    * @cssModifier controls-OperationsPanelButton__showSeparator Отображает разделитель слева от кнопки.
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component='SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton'>
    *
    * </component>
    */
   var OperationsPanelButton = Control.Control.extend([Clickable, Checkable], /** @lends SBIS3.CONTROLS/OperationsPanel/PanelButton/OperationsPanelButton.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS/OperationsPanel} Связанная панель массовых операций,  отображением которой можно управлять с помощью данной кнопки.
             * В качестве значения опции следует передать экземпляр класса такой панели. Значение панели можно изменить с помощью метода setLinkedPanel().
             * @remark Через вёрстку аналогичную связку выполнить нельзя.
             * @example
             * В функции init компонента связать кнопку и панель массовых операций можно так:
             * <pre>
             *     // Экземпляр класса кнопки ПМО.
             *     var panelsButton = this.getChildControlByName('myOpenButton'),
             *
             *     // Экземпляр класса ПМО.
             *     operationsPanel = this.getChildControlByName('myOperationsPanel');
             *
             *     // Связываем кнопку и ПМО.
             *     panelsButton.setLinkedPanel(operationsPanel);
             * </pre>
             * @see getLinkedPanel
             */
            linkedPanel: undefined,
            //Панель должна открываться даже если ресстр enabled = false, т.к. могут присутствовать операции требующую только чтения (печать, выгрузка, суммирование ...)
            allowChangeEnable: false
         },
         _internalHandlers: undefined
      },

      $constructor: function() {
         this._publish('onBeforeLinkedPanelToggle');
         this._initHandlers();
         this.setLinkedPanel(this._options.linkedPanel);
      },
      _initHandlers: function() {
         this._internalHandlers = {
            onTogglePanel: this._onTogglePanel.bind(this)
         };
      },
      _setOnHover: function() {
         var
            panel = this.getLinkedPanel(),
            container = this.getContainer();
         //Для одной и той же кнопки могут сделать setLinkedPanel несколько раз, так что нужно отписываться, иначе будет утечка памяти
         container.off('mouseenter');
         container.one('mouseenter', function() {
            panel.requireButtons();
         });
      },
      _clickHandler: function() {
         var linkedPanel = this._options.linkedPanel;
         if (linkedPanel) {
            this._notify('onBeforeLinkedPanelToggle', linkedPanel.isVisible());

            //Проверка для совместимости со тарой панелью операций, у которой метод toggle влияет на видимость
            linkedPanel[cInstance.instanceOfModule(linkedPanel, 'SBIS3.CONTROLS/OperationsPanel') ? 'toggle' : 'togglePanel']();
         }
         OperationsPanelButton.superclass._clickHandler.apply(this);
      },
      _changeCheckedByClick: function() {
         // check-аем кнопку сразу при нажатии
         // uncheck-аем когда панель анимирует своё закрыти, по событию от панели (см. метод _onTogglePanel)
         //Валера убрал анимацию. В operationsPanel в методе _setVisibility есть todo, по которому анимация должна вернуться. как вернется, нужно заюзать этот метод
         //Выписал задачу https://inside.tensor.ru/opendoc.html?guid=cc3fc92b-c244-470b-8ccf-8d6651344e82&des=
//         if (!this.isChecked()) {
//            this.setChecked(true);
//         }
      },
       setChecked: function(checked) {
           OperationsPanelButton.superclass.setChecked.apply(this, arguments);
           this._container.removeClass('icon-MarkExpandBold icon-MarkCollapseBold')
               .addClass(checked ? 'icon-MarkCollapseBold': 'icon-MarkExpandBold');
       },
      /**
       * Метод установки или замены связанной панели массовых операций, установленной в опции {@link linkedPanel}.
       * @param linkedPanel
       * @see linkedPanel
       */
      setLinkedPanel: function(linkedPanel) {
         if (linkedPanel && (cInstance.instanceOfModule(linkedPanel, 'Deprecated/Controls/OperationsPanel/OperationsPanel') || cInstance.instanceOfModule(linkedPanel, 'SBIS3.CONTROLS/OperationsPanel'))) {
            this._reassignPanel(linkedPanel);
            this.setChecked(linkedPanel.isVisible());
            this._setOnHover();
         }
      },
      /**
       * Метод возвращает текущую связанную панель массовых операций {@link linkedPanel}.
       * @returns (SBIS3.CONTROLS.OperationPanel|Deprecated/Controls/OperationsPanel/OperationsPanel) linkedPanel
       * @see linkedPanel
       */
      getLinkedPanel: function() {
         return this._options.linkedPanel;
      },
      _reassignPanel: function(linkedPanel) {
         if (this._options.linkedPanel) {
            this._options.linkedPanel.unsubscribe('onToggle', this._internalHandlers.onTogglePanel);
         }
         this._options.linkedPanel = linkedPanel;
         this._options.linkedPanel.subscribe('onToggle', this._internalHandlers.onTogglePanel);
      },
      _onTogglePanel: function() {
         this.setChecked(this._options.linkedPanel.isVisible());
      },
      _setEnabled: function(enabled) {
         OperationsPanelButton.superclass._setEnabled.apply(this, arguments);
         this._container.toggleClass('controls-OperationsPanelButton_state_disabled', !enabled);
      }
   });

   return OperationsPanelButton;

});