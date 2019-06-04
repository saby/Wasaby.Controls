import Control = require('Core/Control');
import {constants} from 'Env/Env';
import template = require('wml!Controls/_form/PrimaryAction/PrimaryAction');

/**
 * @class Controls/_form/PrimaryAction
 * Primary action controller. Catches ctrl+enter (cmd+enter) press and fires 'triggered' event.
 */

const PrimaryAction = Control.extend({
   _template: template,

   keyDownHandler: function(e) {
      if (!(e.nativeEvent.altKey || e.nativeEvent.shiftKey) && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) && e.nativeEvent.keyCode === constants.key.enter) { // Ctrl+Enter, Cmd+Enter, Win+Enter
         // If "primary action" processed event, then event must be stopped.
         // Otherwise, parental controls (including other primary action) can react to pressing ctrl+enter and call one more handler
         e.stopPropagation();
         this._notify('triggered');
      }
   }
});

export default PrimaryAction;
