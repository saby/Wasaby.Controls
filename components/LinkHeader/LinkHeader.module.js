define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.LinkHeader',
      'js!SBIS3.CONTROLS.Clickable',
      'js!SBIS3.CONTROLS.Link',
      'css!SBIS3.CONTROLS.LinkHeader'
   ],
   function(Header, dotTplFn, Clickable){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией перехода по ссылке
       * @class SBIS3.CONTROLS.LinkHeader
       * @extends SBIS3.CONTROLS.Header
       * @mixes SBIS3.CONTROLS.Clickable
       * @initial
       * <component data-component="SBIS3.CONTROLS.LinkHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="href">https://inside.tensor.ru</option>
       * </component>
       * cssModifier controls-LinkHeader__separator После текста появляется разделитель |
       * @author Крайнов Дмитрий Олегович
       * */
      var LinkHeader = Header.extend([Clickable], {
         _dotTplFn: dotTplFn,

         _link: null,

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
         /**
          * Возвращает ссылку
          * */
         getHref: function() {
            return this._options.href;
         },
         /**
          * Устанавливает ссылку
          * @param href ссылка
          * */
         setHref: function(href) {
            this._options.href = href;
            this.getContainer().find('a').attr('href', href);
         }
      });

      return LinkHeader;
   }
);