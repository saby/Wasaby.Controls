/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('SBIS3.CONTROLS/ListView/resources/CommonHandlers',
   function() {
      /**
       * Миксин, добавляющий функционал манипуляций с записями.
       * @mixin SBIS3.CONTROLS/ListView/resources/CommonHandlers
       * @public
       * @author Герасимов А.М.
       */
      var CommonHandlers = /** @lends SBIS3.CONTROLS/ListView/resources/CommonHandlers.prototype */{
         editItems: function(tr, id) {
            this.sendCommand('activateItem', id);
         }
      };

      return CommonHandlers;
   });
