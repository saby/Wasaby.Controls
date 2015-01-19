/**
 * Created by cheremushkin iv on 19.01.2015.
 */
define('js!SBIS3.CONTROLS.IconMixin', ['html!SBIS3.CONTROLS.IconMixin/IconTemplate'], function(IconTemplate) {

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS.ClickMixin
    */

   var IconMixin = /**@lends SBIS3.CONTROLS.IconMixin.prototype  */{
      $protected: {
         _options: {
            iconWrapper: IconTemplate,
            /**
             * @cfg {String}  Путь до иконки
             * Путь задаётся относительно корня сайта либо через sprite.
             * @see setIcon
             * @see getIcon
             * @editor ImageEditor
             */
            icon: ''
         }
      },

      $constructor: function() {
      }
   };

   return IconMixin;

});