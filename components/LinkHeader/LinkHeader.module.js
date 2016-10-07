define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.ButtonBase',
      'html!SBIS3.CONTROLS.LinkHeader',
      'css!SBIS3.CONTROLS.LinkHeader'
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
                * @cfg {String} Устанавливает ссылку.
                * @example
                * <pre class="brush: xml">
                *    <option name="href">https://inside.tensor.ru</option>
                * </pre>
                * @see getHref
                * @see setHref
                * */
               href: ''
            }
         },

         init: function() {
            LinkHeader.superclass.init.call(this);

            this.getLinkedContext().setValue('href', this.getHref());
         },
         /**
          * Возвращает ссылку
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myLinkHeader'),
          *       caption = linkHeader.gerHref();
          * </pre>
          * */
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
          * @returns {Error|String}
          */
         setHref: function(href) {
            if (typeof href !== 'string') {
               return new Error('Ссылка не является строкой');
            }

            this._options.href = href;
            this.getLinkedContext().setValue('href', href);

            return this._options.href;
         }
      });

      return LinkHeader;
   }
);