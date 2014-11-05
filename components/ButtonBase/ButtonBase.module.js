/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.Control','js!SBIS3.CONTROLS._FormWidgetMixin', 'js!SBIS3.CONTROLS._DataBindMixin'], function(Control, FormWidgetMixin, _DataBindMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса. Отображение и вёрстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends $ws.proto.Control
    */

   var ButtonBase = Control.Control.extend([FormWidgetMixin, _DataBindMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {
      /**
       * @event onActivated Происходит при активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject дескриптор события
       * @param {Boolean} pressed Нажата ли кнопки (при использовании опции press)
       * <pre>
       *    onButtonClick: function(event){
       *       var list = $ws.single.ControlStorage.getByName('listOfPersons');
       *       list.sendCommand('newItem');
       *    }
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
             * @see setCaption
             * @see getCaption
             * @see setValue
             * @see getValue
             */
            caption: '',
            /**
             * @cfg {String}  Путь до иконки
             * Путь задаётся относительно корня сайта либо через sprite.
             * @see setIcon
             * @see getIcon
             * @editor ImageEditor
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
         this._container.mouseup(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._clickHandler();
               self._notify('onActivated');
            }
         });
         this._container.mousedown(function () {
            return false;
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
       * @see setValue
       * @see getValue
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
       * @see setValue
       * @see getValue
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
      setIcon: function(iconPath) {
         this._options.icon = iconPath;
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
         return this._options.icon;
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
       * Изменить текущее значение текста на кнопке.
       * @param {String} value Вставляемое значение.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.setValue("Отказаться")
       * </pre>
       * @see caption
       * @see setCaption
       * @see getCaption
       * @see getValue
       */
     setValue: function(value){
        this.setCaption(value);
     },
      
      /**
       * Возвращает текущее значение текста на кнопке.
       * @returns {String}
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.getValue();
       * </pre>
       * @see caption
       * @see setCaption
       * @see getCaption
       * @see setValue
       */
      getValue: function(){
         return this.getCaption();
      }
   });

   return ButtonBase;

});