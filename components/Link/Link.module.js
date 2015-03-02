define('js!SBIS3.CONTROLS.Link', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Link' ], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки. Используется только в онлайне.
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.Link
	* @demo SBIS3.Demo.Control.MyLink Пример кнопки в виде ссылки
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.Link'>
    *    <option name='caption' value='Ссылка'></option>
    * </component>
    * @public
    * @category Buttons
    * @ignoreOptions validators, independentContext, contextRestriction, allowChangeEnable, extendedTooltip
    */

   var Link = ButtonBase.extend( /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
             /**
              * @cfg {String} Адрес документа, к которому нужно перейти
              * @example
              * <pre>
              *     <option name="href">https://google.ru/</option>
              * </pre>
              * @see inNewTab
              */
            href: '',
             /**
              * @cfg {Boolean} Открывать ссылку в новой вкладке
              * @example
              * <pre>
              *     <option name="inNewTab">true</option>
              * </pre>
              * @see href
              */
            inNewTab: false
         }
      },

      $constructor: function() {
      },

      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         if (this._options.icon) {
            $('.controls-Link__field', this._container).html(caption);
         } else {
            this._container.html(caption);
         }
      },

      setIcon: function(icon){
         Link.superclass.setIcon.call(this, icon);
         var content;
         if (icon) {
            content = $('<i class="controls-Link__icon ' + this._iconClass + '" ></i><span class="controls-Link__field">' + this._options.caption + '</span>');
         } else {
            content = this._options.caption;
         }
         this._container.html(content);
      },
       /**
        * Установить ссылку.
        * Метод установки либо замены адреса, заданного опцией {@link href}.
        * @param href Сыылка.
        * @see href
        * @see inNewTab
        */
      setHref: function(href){
         this._options.href = href;
         if (!href) {
            href = 'javascript:void(0);';
         } 
         this._container.attr('href', href);
      }

   });

   return Link;

});