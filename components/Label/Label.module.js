define('js!SBIS3.CONTROLS.Label',
   [
      'Core/Control',
      'js!SBIS3.CONTROLS.Clickable',
      'tmpl!SBIS3.CONTROLS.Label',
      'js!SBIS3.CONTROLS.Label.compatibility',
      'css!SBIS3.CONTROLS.Label'
   ],
   function(LightControl, Clickable, template, Compatibility) {

      'use strict';

      /**
       * Класс контрола "Метка". Предназначен для использования совместно с {@link SBIS3.CONTROLS.TextBox} и другими полями ввода.
       *
       * <a href="http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html">Спецификация</a>
       * @class SBIS3.CONTROLS.Label
       * @extends WSControls/Control/Base
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelStandart <b>Пример 1.</b> Чтобы связать метку с полем ввода, для метки в опции owner нужно установить имя (опция name) этого поля ввода.
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelRequeredField <b>Пример 2.</b> Метка с символом "*".
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabelDisabled <b>Пример 3.</b> Метка и поле ввода недоступны для взаимодействия. В конфигурации родительского компонента установлена опция enabled в значение false.
       *
       * @demo SBIS3.CONTROLS.Demo.MyFlexLabelContainer <b>Пример 4.</b> Позиционирование метки слева от контента с помощью классов <b>controls-LabelContainer controls-LabelContainer__label controls-LabelContainer__content</b>.
       *
       * @demo SBIS3.CONTROLS.Demo.MyLabel <b>Пример 5.</b> Оформление меток согласно <a href="http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html">стандарту</a>.
       *
       * @mixes SBIS3.CONTROLS.Clickable
       * @mixes SBIS3.CONTROLS.Label.compatibility
       *
       * @author Журавлев Максим Сергеевич
       *
       * @cssModifier controls-Label_requeredField Модификатор устанавливает отображение символа "*" справа от метки.
       * Такие метки располагают рядом с полями, которые обязательны для заполнения.
       * Если все поля формы обязательны для заполнения, то не стоит их отмечать через "*".
       * @control
       * @public
       *
       */
      var Label = LightControl.extend([Clickable, Compatibility], /** @lends SBIS3.CONTROLS.Label.prototype */{
          /**
           * @name SBIS3.CONTROLS.Label#caption
           * @cfg {String} Устанавливает текст метки.
           */
          /**
           * @name SBIS3.CONTROLS.Label#tooltip
           * @cfg {String} Устанавливает текст всплывающей подсказки, отображаемой при наведении курсора мыши на метку.
           */
          /**
           * @name SBIS3.CONTROLS.Label#visible
           * @cfg {Boolean} Устанавливает видимость метки.
           */
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