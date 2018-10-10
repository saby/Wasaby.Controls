define('SBIS3.CONTROLS/FieldLink/Link', [
      'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
      'tmpl!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link',
      'css!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link'
   ],
   function(ButtonBase, dotTplFn) {
      
      'use strict';
      
      /**
       * Ссылка, которая может использоваться в качестве метки поля связи.
       * Клик по ссылке открывает окно выбора значений.
       *
       * Если компонент расположен внутри поля связи (внутри опции {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/TextBox/options/placeholder/ placeholder), опцию {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Label/options/owner/  owner} задавать не нужно, она заполняется автоматически;
       * Если компонент расположен вне поля связи (справа, слева и т.д.), то в опции owner следует указать имя поля ввода в формате '/имя поля ввода'. В таком случае клик по Link будет вызывать команду showSelector, открывающую selector у FieldLink.
       * @class SBIS3.CONTROLS/FieldLink/Link
       * @extends WSControls/Buttons/ButtonBase
       * @mixes SBIS3.CONTROLS/FieldLink/LinkDocs
       * @author Герасимов А.М.
       *
       * @cssModifier controls-FieldLink-Link__filterButton Стилизация ссылки для кнопки фильтров.
       *
       * @control
       * @public
       * @demo Examples/FieldLink/FieldLinkPlaceHolder/FieldLinkPlaceHolder
       *
       *
       */
      
      var FieldLink_Link = ButtonBase.extend({
         _dotTplFn: dotTplFn,
         $constructor: function() {

            /**
             * @command showSelector
             * @name SBIS3.CONTROLS/FieldLink/Link#showSelector
             * @type {string}
             */

            this._options.command = 'showSelector';
            // Если ссылка находится внутри поля связи (placeholder) фокус принимать она не должна.
            this._options.activableByClick = false;
            this.setTabindex(0);
         },
         setCaption: function() {
            FieldLink_Link.superclass.setCaption.apply(this, arguments);
            this.getContainer().html(this._options.caption);
         },
         _setEnabled: function(enabled) {
            FieldLink_Link.superclass._setEnabled.apply(this, arguments);
            this.getContainer()
               .toggleClass('controls-FieldLink__Link_enabled', enabled)
               .toggleClass('controls-FieldLink__Link_disabled', !enabled);
         }
      });
      
      return FieldLink_Link;
   });
