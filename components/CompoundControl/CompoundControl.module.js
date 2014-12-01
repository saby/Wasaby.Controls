/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('js!SBIS3.CONTROLS.CompoundControl', ['js!SBIS3.CORE.CompoundControl'], function(Control) {

   'use strict';

   /**
    * базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS.Control
    * @extends SBIS3.CORE.Control
    */

   return Control.extend( /** @lends SBIS3.CONTROLS.Control.prototype */{
      $constructor : function(){
         this._container.removeClass('ws-area');
      }
   });

});
