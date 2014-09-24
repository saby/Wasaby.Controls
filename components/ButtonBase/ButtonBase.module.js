/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.Control','js!SBIS3.CONTROLS._FormWidgetMixin'], function(Control, FormWidgetMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса. Отображение и вёрстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends SBIS3.CORE.Control
    */

   var ButtonBase = Control.Control.extend([FormWidgetMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
             * @see setCaption
             * @see getCaption
             */
            caption: '',
            /**
             * @cfg {String}  Путь до иконки
             * Путь задаётся относительно корня сайта либо через sprite.
             * @see setIcon
             * @see getIcon
             */
            icon: '',
            /**
             * @cfg {Boolean} Кнопка по умолчанию
             * Кнопка будет срабатывать при нажатии клавиши Enter.
             * На странице может быть только одна кнопка по умолчанию.
             * Возможные значения:
             * <ul>
             *    <li>true - кнопка является кнопкой по умолчанию;</li>
             *    <li>false - обычная кнопка.</li>
             * </ul>
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
       * Установить текст на кнопке.
       * Метод установки либо замены текста на кнопке, заданного опцией {@link caption}.
       * @param {String} captionTxt Текст на кнопке.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName(("myButton");
       *        btn.setCaption("Применить");
       * </pre>
       * @see caption
       * @see getCaption
       */
      setCaption: function(captionTxt) {
         this._options.caption = captionTxt || '';
      },
      /**
       * Получить текст на кнопке.
       * Метод получения текста, заданного либо опцией {@link caption}, либо методом {@link setCaption}.
       * @returns {String} Возвращает текст, указанный на кнопке.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.getCaption();
       * </pre>
       * @see caption
       * @see setCaption
       */
      getCaption: function() {
         return this._options.caption;
      },

      /**
       * Установить изображение на кнопке.
       * Метод установки или замены изображения, заданного опцией {@link icon}.
       * @param {String} iconTxt Путь к изображению.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.setIcon("sprite:icon-16 icon-Successful icon-primary")
       * </pre>
       * @see icon
       * @see getIcon
       */
      setIcon: function(iconTxt) {

      },

      /**
       * Получить изображение на кнопке.
       * Метод получения изображения, заданного опцией {@link icon}, либо методом {@link setIcon}.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *     if (/icon-Alert/g.test(btn.getIcon())){
       *        btn.setIcon("sprite:icon16 icon-Alert icon-done");
       *     }
       * </pre>
       * @see icon
       * @see setIcon
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