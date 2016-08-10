define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.LinkHeader',
      'js!SBIS3.CONTROLS.Link',
      'css!SBIS3.CONTROLS.LinkHeader'
   ],
   function(Header, dotTplFn){

      'use strict';

      var LinkHeader = Header.extend({
         _dotTplFn: dotTplFn,

         hrefTemplate: hrefTemplate,

         _link: null,

         $protected: {
            _options: {
               href: '',

               separator: false
            }
         },

         init: function(){
            LinkHeader.superclass.init.call(this);

            this._link = this.getChildControlByName('LinkHeader-caption');
         },

         getHref: function(){
            return this._options.href;
         },

         setHref: function(link){
            this._options.href = link;
            this._link.setHref(link);
         },

         getSeparator: function(){
            return this._options.separator;
         },

         setSeparator: function(separator){
            this._options.separator = separator;
            this._container.html(this._options.hrefTemplate(this._options));
         }
      });

      return LinkHeader;
   }
);