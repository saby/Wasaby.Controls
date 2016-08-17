define('js!SBIS3.CONTROLS.LeftNavigation',
   [
      'js!SBIS3.CONTROLS.Header',
      'html!SBIS3.CONTROLS.LeftNavigation',
      'js!SBIS3.CONTROLS.Checkable',
      'css!SBIS3.CONTROLS.LeftNavigation'
   ],
   function(Header, dotTplFn, Checkable){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией сворачивания и разворачивания записей
       * @class SBIS3.CONTROLS.LeftNavigation
       * @extends SBIS3.CONTROLS.Header
       * @initial
       * <component data-component="SBIS3.CONTROLS.LeftNavigation">
       *    <option name="caption">Заголовок</option>
       *    <option name="count">120</option>
       * </component>
       * @author Журавлев Максим Сергеевич
       * */
      var LeftNavigation = Header.extend([Checkable], {
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               count: 0
            }
         },
         
         getCount: function() {
            return +this._options.count;
         }
      });

      return LeftNavigation;
   }
);