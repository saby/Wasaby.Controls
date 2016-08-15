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

      var LinkHeader = Header.extend([Clickable], {
         _dotTplFn: dotTplFn,

         _link: null,

         $protected : {
            _options : {
               href : '',

               separator : false
            }
         },

         init : function() {
            LinkHeader.superclass.init.call(this);

            this._link = this.getChildControlByName('LinkHeader-caption');
         },

         getHref : function() {
            return this._options.href;
         },

         setHref : function(link) {
            this._options.href = link;
            this._link.setHref(link);
         },

         getSeparator : function() {
            return this._options.separator;
         },

         setSeparator : function(separator) {
            var container = $('controls-LinkHeader__separator'),
                className = 'ws-hidden';

            this._options.separator = separator;
            separator ? container.removeClass(className) : container.addClass(className);
         }
      });

      return LinkHeader;
   }
);