define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.ButtonBase',
      'tmpl!SBIS3.CONTROLS.LinkHeader'
   ],
   function(ButtonBase, dotTplFn){

      'use strict';
      /**
       * Контрол для отображения кликабельных заголовков с функцией перехода по ссылке
       * @class SBIS3.CONTROLS.LinkHeader
       * @demo SBIS3.CONTROLS.Demo.MyLinkHeader
       * @extends SBIS3.CONTROLS.ButtonBase
       * @public
       * @control
       * @initial
       * <component data-component="SBIS3.CONTROLS.LinkHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="href">https://inside.tensor.ru</option>
       * </component>
       * cssModifier controls-LinkHeader__separator После текста появляется разделитель |
       * @author Крайнов Дмитрий Олегович
       */
      var LinkHeader = ButtonBase.extend({
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {String} Ссылка.
                * @example
                * <pre class="brush: xml">
                *    <option name="href">https://inside.tensor.ru</option>
                * </pre>
                * @see getHref
                * @see setHref
                */
               href: ''
            }
         },

         /**
          * Получить текст заголовка
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myLinkHeader'),
          *       caption = linkHeader.gerCaption();
          * </pre>
          * @see caption
          * @see setCaption
          */
         getCaption: function() {
            return this._options.caption;
         },

         /**
          * Изменить текст заголовка
          * @param {String} caption ссылка
          * @example
          * <pre>
          *    var linkHeader = this.getChildControlByName('linkHeader');
          *    linkHeader.setCaption('Заголовок');
          * </pre>
          * @see caption
          * @see getCaption
          */
         setCaption: function(caption) {
            LinkHeader.superclass.setCaption.call(this, caption);

            this.getLinkedContext().setValueSelf('caption', this._options.caption);
         },

         /**
          * Получить ссылку
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myLinkHeader'),
          *       href = linkHeader.gerHref();
          * </pre>
          * @see href
          * @see setHref
          */
         getHref: function() {
            return this._options.href;
         },

         /**
          * Изменить ссылку
          * @param {String} href ссылка
          * @example
          * <pre>
          *    var linkHeader = this.getChildControlByName('linkHeader');
          *    linkHeader.setHref('https://inside.tensor.ru');
          * </pre>
          * @see href
          * @see getHref
          */
         setHref: function(href) {
            this._options.href = href = '' + href;
            this.getLinkedContext().setValueSelf('href', this._options.href);
         }
      });

      return LinkHeader;
   }
);