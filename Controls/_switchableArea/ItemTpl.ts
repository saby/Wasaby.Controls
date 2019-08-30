import Control = require('Core/Control');
import template = require('wml!Controls/_switchableArea/ItemTpl');

var SwitchableAreaItem = Control.extend({
   _template: template,

   _beforeMount(): void {
      this._keyHooksStorage = [];
   },

   _afterMount: function() {
      // if we select current item, then activate it, for focusing child controls
      this.activate();
   },

   _afterUpdate: function(oldOptions) {
      // if we select current item, then activate it, for focusing child controls
      if (this._options.selectedKey !== oldOptions.selectedKey && this._options.selectedKey === this._options.key) {
         this.activate();
         this._executeKeyHooks('register');
      } else {
         this._executeKeyHooks('unregister');
      }
   },
   _registerKeyHook(event: Event, keyHook: Control): void {
      this._keyHooksStorage.push(keyHook);
   },
   _unregisterKeyHook(event: Event, keyHook: Control): void {
      const index = this._keyHooksStorage.indexOf(keyHook);
      if (index > -1) {
         this._keyHooksStorage.splice(index, 1);
      }
   },
   _executeKeyHooks(action: string): void {
      for (let i = 0; i < this._keyHooksStorage.length; i++) {
         if (this._keyHooksStorage[i][action]) {
            this._keyHooksStorage[i][action]();
         }
      }
   }
});

export default SwitchableAreaItem;
