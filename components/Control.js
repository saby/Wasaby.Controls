/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('SBIS3.CONTROLS/Control', ['Lib/Control/Control'], function(Control) {

   'use strict';

   /**
    * Базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS/Control
    * @extends Lib/Control/Control
    * @author Крайнов Д.О.
    */

   return Control.Control.extend( /** @lends SBIS3.CONTROLS/Control.prototype */{

   });

});
