define('js!SBIS3.CONTROLS.ToggleHeader',
   [
      'js!SBIS3.CONTROLS.Header',
      'js!SBIS3.CONTROLS.Clickable',
      'js!SBIS3.CONTROLS.Checkable',
      'html!SBIS3.CONTROLS.ToggleHeader',
      'css!SBIS3.CONTROLS.ToggleHeader'
   ],
   function(Header, Clickable, Checkable, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией сворачивания и разворачивания записей
       * @class SBIS3.CONTROLS.ToggleHeader
       * @extends SBIS3.CONTROLS.Header
       * @mixes SBIS3.CONTROLS.Checkable
       * @initial
       * <component data-component="SBIS3.CONTROLS.ToggleHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="count">120</option>
       * </component>
       * @author Крайнов Дмитрий Олегович
       * */
      var ToggleHeader = Header.extend([Clickable, Checkable], {
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               count: 0
            }
         },

         init: function() {
            ToggleHeader.superclass.init.call(this);

            this.setCount(this._options.count);
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
            var type;

            count = Number(count);
            type = $ws.helpers.type(count);

            if(type !== 'number' || count < 1) {
               count = '';
            }
            this.getLinkedContext().setValue('count', count);
         }
      });

      return ToggleHeader;
   }
);