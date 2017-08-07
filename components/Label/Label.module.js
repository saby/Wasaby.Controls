define('js!SBIS3.CONTROLS.Label',
   [
      'Core/Control',
      'js!SBIS3.CONTROLS.Clickable',
      'Core/Sanitize',
      'tmpl!SBIS3.CONTROLS.Label',
      'js!SBIS3.CONTROLS.Label.compatibility',
      'css!SBIS3.CONTROLS.Label'
   ],
   function(LightControl, Clickable, Sanitize, template, Compatibility) {

      'use strict';

      /**
       * Компонент метка. Работает как тег label. Должен использоваться совместно с {@link SBIS3.CONTROLS.TextBox}.
       * @class SBIS3.CONTROLS.Label
       * @extends WSControls/Control/Base
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
      var Label = LightControl.extend([Clickable, Compatibility], /** @lends SBIS3.CONTROLS.Label.prototype */{
         _controlName: 'SBIS3.CONTROLS.Label',

         _template: template,

         _applyOptions: function() {
            this.caption = this._options.caption || '';
            this.tooltip = this._options.tooltip || '';
            this.visible = this._options.visible !== false;
         },

         _clickCaptionHandler: function() {
            var owner = this.getOwner();
            if (this.isEnabled() && owner) {
               owner.setActive(true);
            }
         }
      });

      return Label;
   }
);