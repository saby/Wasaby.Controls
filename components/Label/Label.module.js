define('js!SBIS3.CONTROLS.Label',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Clickable',
      'Core/Sanitize',
      'tmpl!SBIS3.CONTROLS.Label',
      'css!SBIS3.CONTROLS.Label'
   ],
   function(CompoundControl, Clickable, Sanitize, template) {

      'use strict';

      /**
       * Компонент метка. Работает как тег label. Должен использоваться совместно с {@link SBIS3.CONTROLS.TextBox}.
       * @class SBIS3.CONTROLS.Label
       * @extends SBIS3.CONTROLS.CompoundControl
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelStandart Пример работы Label с TextBox.
       * Для взаимодействия метки и поля ввода(при клике на метку фокус переходит в поле ввода) нужно задать имя полю ввода
       * через опцию name и установить такое же значение в опцию owner у метки.
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelRequeredField Пример обязательной метки.
       * Чтобы иметь обязательную метку нужно повесить класс controls-Label_requeredField задав опцию
       * className="... controls-Label_requeredField".
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelDisabled Пример недоступной метки и TextBox.
       * Чтобы метка и TextBox стали недоступными нужно установить родителю опцию enabled="{{false}}" или установить
       * метке и TextBox ту же опцию с тем же значением.
       *
       * @demo SBIS3.CONTROLS.Demo.MyFlexLabelContainer Пример как можно спозиционировать метку слева от контента
       * с помощью классов controls-LabelContainer controls-LabelContainer__label controls-LabelContainer__content.
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabel Пример всевозможных меток по стандарту
       * http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html
       *
       * @mixes SBIS3.CONTROLS.Clickable
       * @author Крайнов Дмитрий Олегович
       *
       * @cssModifier controls-Label_requeredField Устанавливет отображение метки как обязательной.
       *
       * @control
       * @public
       *
       */
      var Label = CompoundControl.extend([Clickable], /** @lends SBIS3.CONTROLS.Label.prototype */{
         _dotTplFn: template,

         $protected: {
            _options: {
               /**
                * @cfg {String} Текст метки
                *
                * @example
                * <pre>
                *    <ws:caption>
                *       <ws:String>Метка</ws:String>
                *    </ws:caption>
                * </pre>
                */
               caption: null
            },
            _caption: null
         },

         init: function() {
            Label.superclass.init.call(this);

            this._caption = this.getContainer().find('.js-controls-Label__text');
         },

         /**
          * Вернуть текст метки
          * @returns {String}
          */
         getCaption: function() {
            return this._getOption('caption');
         },

         /**
          * Изменить текст метки
          * @param caption новый текст метки
          */
         setCaption: function(caption) {
            this._setOption('caption', caption);
            this._caption.html(Sanitize(caption));
         },

         _onClickHandler: function(event) {
            var owner;
            Label.superclass._onClickHandler.call(this, event);

            if (this.isEnabled() && /js-controls-Label__text/.test(event.target.className) && (owner = this.getOwner())) {
               owner.setActive(true);
            }
         }
      });

      return Label;
   }
);