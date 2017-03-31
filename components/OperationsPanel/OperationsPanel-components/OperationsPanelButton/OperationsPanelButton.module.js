/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanelButton', [
   'js!SBIS3.CORE.Control',
   'js!SBIS3.CONTROLS.Clickable',
   'js!SBIS3.CONTROLS.Checkable',
   'html!SBIS3.CONTROLS.OperationsPanelButton',
   'Core/core-instance',
   'css!SBIS3.CONTROLS.OperationsPanelButton'
], function(Control, Clickable, Checkable, dotTplFn, cInstance) {

   /**
    * Кнопка управления панелью массовых операций.
    *
    * SBIS3.CONTROLS.OperationsPanelButton
    * @class SBIS3.CONTROLS.OperationsPanelButton
    * @extends $ws.proto.Control
    * @author Сухоручкин Андрей Сергеевич
    *
    * @control
    * @public
    * @category Actions
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsPanelButton'>
    *
    * </component>
    */
   var OperationsPanelButton = Control.Control.extend([Clickable, Checkable], /** @lends SBIS3.CONTROLS.OperationsPanelButton.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {js!SBIS3.CONTROLS.OperationPanel} Связанная панель массовых операций
             * @example
             * <pre>
             *     <option name="linkedPanel">MyOperationPanel</option>
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
      _clickHandler: function() {
         var linkedPanel = this._options.linkedPanel;
         if (linkedPanel) {
            this._notify('onBeforeLinkedPanelToggle', linkedPanel.isVisible());

            //Проверка для совместимости со тарой панелью операций, у которой метод toggle влияет на видимость
            linkedPanel[cInstance.instanceOfModule(linkedPanel, 'SBIS3.CONTROLS.OperationsPanel') ? 'toggle' : 'togglePanel']();
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
      /**
       * Метод установки или замены связанной панели массовых операций, установленной в опции {@link linkedPanel}.
       * @param linkedPanel
       * @see linkedPanel
       */
      setLinkedPanel: function(linkedPanel) {
         if (linkedPanel && (cInstance.instanceOfModule(linkedPanel, 'SBIS3.CORE.OperationsPanel') || cInstance.instanceOfModule(linkedPanel, 'SBIS3.CONTROLS.OperationsPanel'))) {
            this._reassignPanel(linkedPanel);
            this.setChecked(linkedPanel.isVisible());
         }
      },
      /**
       * Метод возвращает текущую связанную панель массовых операций {@link linkedPanel}.
       * @returns (SBIS3.CONTROLS.OperationPanel|SBIS3.CORE.OperationsPanel) linkedPanel
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
      }
   });

   return OperationsPanelButton;

});