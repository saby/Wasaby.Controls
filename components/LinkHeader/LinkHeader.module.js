define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.ButtonBase',
      'tmpl!SBIS3.CONTROLS.LinkHeader'
   ],
   function(ButtonBase, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией перехода по ссылке
       * @class SBIS3.CONTROLS.LinkHeader
       * @extends SBIS3.CONTROLS.ButtonBase
       * @initial
       * <component data-component="SBIS3.CONTROLS.LinkHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="href">https://inside.tensor.ru</option>
       * </component>
       * cssModifier controls-LinkHeader__separator После текста появляется разделитель |
       * @author Крайнов Дмитрий Олегович
       * */
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

         init: function() {
            LinkHeader.superclass.init.call(this);

            this.getLinkedContext().setValue('caption', this._options.caption);
            this.getLinkedContext().setValue('href', this._options.caption);
         },

         /**
          * Вернёт текст заголовка
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myLinkHeader'),
          *       caption = linkHeader.gerCaption();
          * </pre>
          * @see caption
          * @see setCaption
          *
          */
         getCaptiot: function() {
            return this._options.caption;
         },

         /**
          * Изменит текст заголовка
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
            this.superclass.setCaption(caption).call(this);

            this.getLinkedContext().setValue('caption', caption);
         },

         /**
          * Вернёт ссылку
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
          * Изменит ссылку
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
            this._options.href = href;
            this.getLinkedContext().setValue('href', href);
         }
      });

      return LinkHeader;
   }
);