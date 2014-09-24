/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.Control','js!SBIS3.CONTROLS._FormWidgetMixin'], function(Control, FormWidgetMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы - кнопки должны наследоваться от этого класса. Отображение и верстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends SBIS3.CORE.Control
    */

   var ButtonBase = Control.Control.extend([FormWidgetMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             */
            caption: '',
            /**
             * @cfg {String}  Строка, обозначающая иконку
             * @noShow
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
         this._container.mousedown(function(){
            return false;
         });
      },

      _clickHandler : function() {

      },

      /**
       * Меняет текст на кнопке
       * @param {String} captionTxt подпись на кнопке
       */
      setCaption: function(captionTxt) {
         this._options.caption = captionTxt || '';
      },

      /**
       * Возвращает текст на кнопке
       */
      getCaption: function() {
         return this._options.caption;
      },

      /**
       * Установить изображение на кнопке
       * @param {String} iconTxt путь к изображению
       */
      setIcon: function(iconTxt) {

      },
      /**
       * Установить значение primary
       * @param {Boolean} flag значение primary
       */
      setPrimary: function(flag){
         this._options.primary = !!flag;
      },

      /**
       * Является ли кнопка primary
       * @returns {boolean}
       */

      isPrimary: function(){
         return this._options.primary;
      },

      /**
       * Получить изображение на кнопке
       */
      getIcon: function() {

      },

      setValue: function(value){
         this.setCaption(value);
      },

      getValue: function(){
         return this.getCaption();
      }
   });

   return ButtonBase;

});