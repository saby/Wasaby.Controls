/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.Engine.LinkButtonOnline', ['js!SBIS3.CONTROLS.ButtonBase'], function(ButtonBase) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки. Используется только в онлайне.
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.Engine.LinkButtonOnline
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    */

   var LinkButtonOnline = ButtonBase.extend( /** @lends SBIS3.Engine.LinkButtonOnline.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return LinkButtonOnline;

});