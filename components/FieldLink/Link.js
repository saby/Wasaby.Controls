define('SBIS3.CONTROLS/FieldLink/Link', [
      'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
      'tmpl!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link',
      'css!SBIS3.CONTROLS/FieldLink/Link/FieldLink_Link'
   ],
   function(ButtonBase, dotTplFn) {
      
      'use strict';
      
      /**
       * Класс компонента "Ссылка для поля связи". Может быть использован в качестве метки поля связи.
       * Клик по ссылке открывает окно выбора значений.
       *
       * Если компонент расположен внутри {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/field-link/index/ поля связи}, опцию {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Label/options/owner/  owner} задавать не нужно, она заполняется автоматически.
       * Если компонент расположен вне поля связи (справа, слева и т.д.), то в опции owner следует указать имя поля связи в формате '/имя поля связи'. В таком случае клик по Link будет вызывать команду {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/FieldLink/methods/showSelector/ showSelector}, открывающую {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/ окно выбора}.
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

      /**
       * @cfg {String} Устанавливает имя поля связи, к которому будет привязана метка.
       * @name SBIS3.CONTROLS/FieldLink/Link#owner
       */