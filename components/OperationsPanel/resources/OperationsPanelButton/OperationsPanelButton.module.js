/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsPanelButton', [
   'js!SBIS3.CORE.Control',
   'js!SBIS3.CONTROLS.Clickable',
   'js!SBIS3.CONTROLS.Checkable',
   'html!SBIS3.CONTROLS.OperationsPanelButton'
], function(Control, Clickable, Checkable, dotTplFn) {

   /**
    * Кнопка управления панелью массовых операций.
    *
    * SBIS3.CONTROLS.OperationsPanelButton
    * @class SBIS3.CONTROLS.OperationsPanelButton
    * @extends $ws.proto.Control
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @initial
    * <component data-component='SBIS3.CONTROLS.OperationsPanelButton'>
    *
    * </component>
    */
   var OperationsPanelButton = Control.Control.extend([Clickable, Checkable], {
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
            linkedPanel: undefined
         },
         _internalHandlers: undefined
      },

      $constructor: function() {
         this._initHandlers();
         this.setLinkedPanel(this._options.linkedPanel);
      },
      _initHandlers: function() {
         this._internalHandlers = {
            onTogglePanel: this._onTogglePanel.bind(this),
            onChangeEnabled: this._onChangeEnabled.bind(this)
         }
      },
      _clickHandler: function() {
         this._options.linkedPanel && this._options.linkedPanel.toggle();
      },
      /**
       * Метод установки или замены связанной панели массовых операций, установленной в опции {@link linkedPanel}.
       * @param linkedPanel
       * @see linkedPanel
       */
      setLinkedPanel: function(linkedPanel) {
         if (linkedPanel && ($ws.helpers.instanceOfModule(linkedPanel, 'SBIS3.CORE.OperationsPanel') || $ws.helpers.instanceOfModule(linkedPanel, 'SBIS3.CONTROLS.OperationsPanel'))) {
            this._reassignPanel(linkedPanel);
            this._onChangeEnabled();
            this.setChecked(linkedPanel.isOpen());
         }
      },
      _reassignPanel: function(linkedPanel) {
         if (this._options.linkedPanel) {
            this._options.linkedPanel.unsubscribe('onToggle', this._internalHandlers.onTogglePanel);
            this._options.linkedPanel.unsubscribe('onChangeEnabled', this._internalHandlers.onChangeEnabled);
         }
         this._options.linkedPanel = linkedPanel;
         this._options.linkedPanel.subscribe('onToggle', this._internalHandlers.onTogglePanel);
         this._options.linkedPanel.subscribe('onChangeEnabled', this._internalHandlers.onChangeEnabled);
      },
      _onTogglePanel: function() {
         this.setChecked(this._options.linkedPanel.isOpen());
      },
      _onChangeEnabled: function() {
         this.setEnabled(this._options.linkedPanel.isEnabled());
      }
   });

   return OperationsPanelButton;

});