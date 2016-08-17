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
       * @initial
       * <component data-component="SBIS3.CONTROLS.LinkHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="big">true</option>
       *    <option name="href">https://inside.tensor.ru</option>
       * </component>
       * @author Журавлев Максим Сергеевич
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
               href: '',
               /**
                * @cfg {Boolean} Устанавливает нужен ли разделитель.
                * @example
                * <pre class="brush: xml">
                *    <option name="separator">true</option>
                * </pre>
                * @see getSeparator
                * @see setSeparator
                * */
               separator: false
            }
         },

         init: function() {
            LinkHeader.superclass.init.call(this);

            this._link = this.getChildControlByName('LinkHeader-caption');
         },
         /**
          * Возвращает ссылку
          * */
         getHref: function() {
            return this._options.href;
         },
         /**
          * Устанавливает ссылку
          * @param link ссылка
          * */
         setHref: function(link) {
            this._options.href = link;
            this._link.setHref(link);
         },
         /**
          * Возвращает есть ли разделитель
          * */
         isSeparator: function() {
            return this._options.separator;
         },
         /**
          * Устанавливает наличие разделителя
          * @param separator есть ли разделитель
          * */
         setSeparator: function(separator) {
            var container = $('controls-LinkHeader__separator'),
                className = 'ws-hidden';

            this._options.separator = separator;
            separator ? container.removeClass(className) : container.addClass(className);
         }
      });

      return LinkHeader;
   }
);