define('js!SBIS3.CONTROLS.Link', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Link' ], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки. Используется только в онлайне.
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.Link
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    */

   var Link = ButtonBase.extend( /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            href: '',
            inNewTab: false
         }
      },

      $constructor: function() {
      }

   });

   return Link;

});