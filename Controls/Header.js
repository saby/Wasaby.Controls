define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Контрол отображающий заголовки
    * @class Controls/Header
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} Размер заголовка
    * @variant s размер шрифта будет 14px(в теме онлайна)
    * @variant default размер шрифта будет 15px(в теме онлайна)
    * @variant l размер шрифта будет 18px(в теме онлайна)
    */

   /**
    * @name Controls/Header#caption
    * @cfg {String} текст заголовка
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} стиль заголовка
    * @variant default синий
    * @variant primary красный
    */

   /**
    * @name Controls/Header#clickable
    * @cfg {Boolean} возможность клика по заголовку
    */

   /**
    * @name Controls/Header#counterValue
    * @cfg {Number} значение счетчика. Если он задан, то счетчик отображается
    */

   /**
    * @name Controls/Header#counterLocation
    * @cfg {String} расположение счетчика относительно заголовка
    * @variant after после загловка
    * @variant before перед заголовком
    */

   /**
    * @name Controls/Header#counterStyle
    * @cfg {String} стиль отображения счетчика
    * @variant primary синий
    * @variant default красный
    * @variant disabled серый без ховера
    */

   /**
    * @name Controls/Header#counterSize
    * @cfg {String} размер счетчика
    * @variant h7 14px
    * @variant h6 15px
    */

   /**
    * @name Controls/Header#countClickable
    * @cfg {Boolean} возможность посылать отдельное событие на клик по счетчику. Название события countClick
    */

   var Header = Control.extend({
      _template: template,

      countClickHandler: function (e) {
         if(this._options.countClickable){
            e.stopPropagation();
            this._notify('countClick');
         }
      }
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String),
         style: types(String).oneOf([
            'default_big',
            'primary_big',
            'default',
            'primary'
         ]),
         clickable: types(Boolean),
         counterValue: types(Number),
         counterLocation: types(String).oneOf([
            'after',
            'before'
         ]),
         counterStyle: types(String).oneOf([
            'primary',
            'default',
            'disabled'
         ]),
         counterSize: types(String).oneOf([
            'h6',
            'h7'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'default',
            's'
         ])
      }
   };

   return Header;
});
