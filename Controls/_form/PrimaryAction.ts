import Control = require('Core/Control');
import {constants} from 'Env/Env';
import template = require('wml!Controls/_form/PrimaryAction/PrimaryAction');

/**
 * Контроллер, который обрабатывает нажатие комбинации клавиш ctrl+enter (cmd+enter) и запускает событие 'triggered'.
 * @class Controls/_form/PrimaryAction
 * @extends Core/Control
 * @public
 * @author Красильников А.С.
 */

/*
 * Primary action controller. Catches ctrl+enter (cmd+enter) press and fires 'triggered' event.
 * @class Controls/_form/PrimaryAction
 * @extends Core/Control
 * @public
 * @author Красильников А.С.
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

/**
 * @event Controls/_form/PrimaryAction#triggered Происходит при нажатии комбинации клавиш Ctrl + Enter и Сmd + Enter.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 */

export default PrimaryAction;
