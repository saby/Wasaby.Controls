/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.FormWidgetMixin', 'js!SBIS3.CONTROLS.DataBindMixin', 'js!SBIS3.CONTROLS.IconMixin'], function(Control, Clickable, FormWidgetMixin, DataBindMixin, IconMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса. Отображение и вёрстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @public
    * @extends $ws.proto.CompoundControl
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.IconMixin
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    */

   var ButtonBase = Control.Control.extend([Clickable, FormWidgetMixin, DataBindMixin, IconMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {

      $protected: {
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
             * @example
             * <pre>
             *     <option name="caption">Сохранить</option>
             * </pre>
             * @see setCaption
             * @see getCaption
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
       * Переопределённый метод из базового Control
       * Нужен, чтобы быстро работало скртие контрола,
       * Не запускались расчёты авторазмеров
       */
      _setVisibility: function(show) {
         this._container.toggleClass('ws-hidden', !show);
         this._isVisible = show;
      }
   });

   return ButtonBase;

});