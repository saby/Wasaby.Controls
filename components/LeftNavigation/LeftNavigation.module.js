define('js!SBIS3.CONTROLS.LeftNavigation',
   [
      'js!SBIS3.CONTROLS.Header',
      'js!SBIS3.CONTROLS.Clickable',
      'js!SBIS3.CONTROLS.Checkable',
      'html!SBIS3.CONTROLS.LeftNavigation',
      'css!SBIS3.CONTROLS.LeftNavigation'
   ],
   function(Header, Clickable, Checkable, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией сворачивания и разворачивания записей
       * @class SBIS3.CONTROLS.LeftNavigation
       * @extends SBIS3.CONTROLS.Header
       * @mixes SBIS3.CONTROLS.Checkable
       * @initial
       * <component data-component="SBIS3.CONTROLS.LeftNavigation">
       *    <option name="caption">Заголовок</option>
       *    <option name="count">120</option>
       * </component>
       * @author Крайнов Дмитрий Олегович
       * */
      var LeftNavigation = Header.extend([Clickable, Checkable], {
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               count: 0
            }
         },

         init: function() {
            LeftNavigation.superclass.init.call(this);

            this.getLinkedContext().setValue('count', this.getCount());
         },
         /**
          * Возвращает число записей
          * */
         getCount: function() {
            return this._options.count;
         },
         /**
          * Устанавливает чисо записей
          * @param count число записей
          */
         setCount: function(count) {
            count = Number(count);
            this._options.count = count;
            if(count < 1) {
               count = 0;
            }
            this.getLinkedContext().setValue('count', count);
         }
      });

      return LeftNavigation;
   }
);