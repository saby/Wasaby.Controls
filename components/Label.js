define('SBIS3.CONTROLS/Label',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Mixins/Clickable',
      'tmpl!SBIS3.CONTROLS/Label/Label',
      'SBIS3.CONTROLS/Label/resources/Label.compatibility',
      'css!SBIS3.CONTROLS/Label/Label'
   ],
   function(LightControl, Clickable, template, Compatibility) {

      'use strict';

      /**
       * Класс контрола "Метка". Предназначен для использования совместно с {@link SBIS3.CONTROLS/TextBox} и другими полями ввода.
       *
       * <a href="http://axure.tensor.ru/standarts/v7/%D0%BF%D0%BE%D0%BB%D0%B5_%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_03_.html">Спецификация.</a>
       * <a href="/doc/platform/developmentapl/interface-development/components/textbox/infield/label/">Демонстрационные примеры.</a>
       *
       * @class SBIS3.CONTROLS/Label
       * @extends WSControls/Control/Base
       *
       * @mixes SBIS3.CONTROLS/Mixins/Clickable
       * @mixes SBIS3.CONTROLS/Label/resources/Label.compatibility
       *
       * @author Журавлев М.С.
       *
       * @cssModifier controls-Label_requeredField Модификатор устанавливает отображение символа "*" справа от метки.
       * Такие метки располагают рядом с полями, которые обязательны для заполнения.
       * Если все поля формы обязательны для заполнения, то не стоит их отмечать через "*".
       * @control
       * @public
       *
       */
      var Label = LightControl.extend([Clickable, Compatibility], /** @lends SBIS3.CONTROLS/Label.prototype */{
          /**
           * @name SBIS3.CONTROLS/Label#caption
           * @cfg {String} Устанавливает текст метки.
           * @see setCaption
           * @see getCaption
           */
          /**
           * @name SBIS3.CONTROLS/Label#tooltip
           * @cfg {String} Устанавливает текст всплывающей подсказки, которая отображается при наведении курсора мыши на метку.
           * @see setTooltip
           * @see getTooltip
           */
          /**
           * @name SBIS3.CONTROLS/Label#visible
           * @cfg {Boolean} Устанавливает видимость метки.
           * @see setVisible
           * @see getVisible
           */
          /**
           * @name SBIS3.CONTROLS/Label#owner
           * @cfg {String} Устанавливает имя контрола, к которому будет привязана метка.
           *
           */
         _controlName: 'SBIS3.CONTROLS/Label',

         _dotTplFn: template,

         _onClickHandler: function() {
            var owner = this.getOwner();
            if (this.isEnabled() && owner) {
               owner.setActive(true);
            }
         }
      });

      return Label;
   }
);