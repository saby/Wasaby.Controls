/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.FormWidgetMixin', 'js!SBIS3.CONTROLS.DataBindMixin', 'js!SBIS3.CONTROLS.IconMixin'], function(Control, Clickable, FormWidgetMixin, DataBindMixin, IconMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса. Отображение и вёрстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @extends $ws.proto.CompoundControl
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.IconMixin
    */

   var ButtonBase = Control.extend([Clickable, FormWidgetMixin, DataBindMixin, IconMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {
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
            caption: ''
         }
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      init : function() {
         ButtonBase.superclass.init.call(this);
         /*TODO хак чтоб не срабатывал клик на кнопку при нажатии на дочерние компоненты*/
         $('[data-component]', this._container.get(0)).mousedown(function(e){
            e.stopPropagation();
         });
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
      }
   });

   return ButtonBase;

});