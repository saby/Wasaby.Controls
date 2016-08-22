/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('js!SBIS3.CONTROLS.CommonHandlers',
   function() {
      /**
       * Миксин, добавляющий функционал манипуляций с записями.
       * @mixin SBIS3.CONTROLS.CommonHandlers
       * @public
       * @author Герасимов Александр Максимович
       */
      var CommonHandlers = /** @lends SBIS3.CONTROLS.CommonHandlers.prototype */{
         editItems: function(tr, id) {
            this.sendCommand('activateItem', id);
         }
      };

      return CommonHandlers;
   });
