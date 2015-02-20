/**
 * Модуль "Компонент Модальный диалог".
 *
 * @description
 */
define('js!SBIS3.CORE.Dialog', ['js!SBIS3.CORE.Window', 'js!SBIS3.CORE.ModalOverlay'], function( Window, ModalOverlay ) {

   'use strict';

   /**
    * Модальный диалог.
    * Активный модальный диалог может быть только один. Все остальное скрыто и недоступно для взаимодействия
    *
    * @class $ws.proto.Dialog
    * @extends $ws.proto.Window
    * @control
    */
   $ws.proto.Dialog = Window.extend({
      $protected : {
         _options: {
            modal: true
         }
      }
   });
   return $ws.proto.Dialog;
});