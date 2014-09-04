/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы - кнопки должны наследоваться от этого класса. Отображение и верстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends SBIS3.CORE.Control
    */

   var ButtonBase = Control.Control.extend( /** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             */
            caption: '',
            /**
             * @cfg {String}  Строка, обозначающая иконку
             */
            icon: '',
            /**
             * @cfg {Boolean} Кнопка по умолчанию (срабатывает ли нажатие на кнопку при нажатии на Enter)
             */
            primary: false
         }
      },

      $constructor: function() {
         this._publish('onActivated');
         var self = this;
         /*TODO пока подписываемся на mouseup, потому что CONTROL херит событие клика*/
         this._container.mouseup(function(){
            self._clickHandler();
            self._notify('onActivated');
         });
      },

      _clickHandler : function() {
      },
      /**
       * Меняет текст на кнопке
       * @param {String} captionTxt подпись на кнопке
       */

      setCaption: function(captionTxt) {

      },

      /**
       * Возвращает текст на кнопке
       */

      getCaption: function() {

      },

      /**
       * Установить изображение на кнопке
       * @param {String} iconTxt путь к изображению
       */

      setIcon: function(iconTxt) {

      },

      /**
       * Получить изображение на кнопке
       */

      getIcon: function() {

      }
   });

   return ButtonBase;

});