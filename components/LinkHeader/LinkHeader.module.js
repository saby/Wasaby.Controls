define('js!SBIS3.CONTROLS.LinkHeader',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.LinkHeader',
      'css!SBIS3.CONTROLS.LinkHeader'
   ],
   function(Header, dotTplFn){

      'use strict';

      var LinkHeader = Header.extend({
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               href: ''
            }
         },

         getHref: function(){
            return this._options.href;
         },

         setHref: function(link){
            this._options.href = link;
         }
      });

      return LinkHeader;
   }
);