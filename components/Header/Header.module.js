define('js!SBIS3.CONTROLS.Header',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Header',
      'css!SBIS3.CONTROLS.Header'
   ],
   function(CompoundControl, dotTplFn){

      'use strict';

      var Header = CompoundControl.extend({
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               caption: '',
               big: false
            }
         },

         getCaption: function(){
            return this._options.caption;
         },

         setCaption: function(caption){
            this._options.caption = caption;
         }

      });

      return Header;
   }
);