/**
 * Created by am.gerasimov on 26.08.2016.
 */
/* global define */
define('js!SBIS3.CONTROLS.Demo.DemoChooserAction', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CONTROLS.Action.SelectorAction",
   "html!SBIS3.CONTROLS.Demo.DemoChooserAction",
   "Core/helpers/fast-control-helpers",
   "js!SBIS3.CONTROLS.Demo.DemoPanelComponent",
   "js!SBIS3.CONTROLS.FieldLink",
   "js!SBIS3.CONTROLS.Button"
], function ( CommandDispatcher,CompoundControl, SelectorAction, dotTplFn, fcHelpers) {

   var DemoSelectorAction = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _action: null
      },
      $constructor: function() {
         CommandDispatcher.declareCommand(this, 'showPanel', this.showPanel);
         CommandDispatcher.declareCommand(this, 'showPanelWithDefaultTemplate', this.showPanelWithDefaultTemplate);
      },

      init: function() {
         DemoSelectorAction.superclass.init.apply(this, arguments);
         this._action = this.getChildControlByName('SelectorAction');
      },

      showPanel: function() {
         this._action.execute({template: 'js!SBIS3.CONTROLS.Demo.DemoPanelComponent'});
         this._action.once('onExecuted', function(event, meta) {
            fcHelpers.alert('Выбрано ' + (meta && meta.selectedItems) ? meta.selectedItems.getCount() : 0 + ' записей');
         });
      },

      showPanelWithDefaultTemplate: function() {
         this._action.execute({componentsOptions: {
            content: 'Привет я контент',
            topContent: 'Привет я контент в шапке'
         }});
      }
   });


   return DemoSelectorAction;
});
