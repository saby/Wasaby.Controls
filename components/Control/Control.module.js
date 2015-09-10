/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('js!SBIS3.CONTROLS.Control', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS.Control
    * @extends $ws.proto.Control
    * @author Крайнов Дмитрий Олегович
    */

   return Control.Control.extend( /** @lends SBIS3.CONTROLS.Control.prototype */{

   });

});
