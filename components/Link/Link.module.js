define('js!SBIS3.CONTROLS.Link', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Link' ], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки. Используется только в онлайне.
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.Link
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    */

   var Link = ButtonBase.extend( /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            href: '',
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

      setHref: function(href){
         this._options.href = href;
      }

   });

   return Link;

});