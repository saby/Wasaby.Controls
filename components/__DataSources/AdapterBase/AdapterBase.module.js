define('js!SBIS3.CONTROLS.AdapterBase', [], function(){
   'use strict';

   /**
    * Базовый адаптер данных
    * @class SBIS3.CONTROLS.AdapterBase
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.AdapterBase.prototype */{
      $constructor : function() {

      },
      iterate : function() {
         /*Method must be implemented*/
      },
      getValue : function() {
         /*Method must be implemented*/
      },
      addItem : function() {
         /*Method must be implemented*/
      }
   });
});