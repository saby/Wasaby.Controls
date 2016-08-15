define('js!SBIS3.CONTROLS.Subheader',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.Subheader',
      'css!SBIS3.CONTROLS.Subheader'
   ],
   function(Header, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения подзаголовков
       * @class SBIS3.CONTROLS.Subheader
       * @extends SBIS3.CONTROLS.Header
       * @initial
       * <component data-component="SBIS3.CONTROLS.Subeader">
       *    <option name="caption">Подаголовок</option>
       *    <option name="big">true</option>
       * </component>
       * @author Журавлев Максим Сергеевич
       * */
      var Subheader = Header.extend({

         _dotTplFn : dotTplFn,

         setBig : function(big) {
            var container = this.getContainer(),
                className= 'controls-Subheader__big';

            this._options.big = big;
            big ? container.addClass(className) : container.removeClass(className);
         }

      });

      return Subheader;
   }
);