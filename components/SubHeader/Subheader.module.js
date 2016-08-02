define('js!SBIS3.CONTROLS.Subheader',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.Subheader',
      'css!SBIS3.CONTROLS.Subheader'
   ],
   function(Header, dotTplFn){

      'use strict';

      var Subheader = Header.extend({

         _dotTplFn: dotTplFn

      });

      return Subheader;
   }
);