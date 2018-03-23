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
    * @variant s 14px
    * @variant default 15px
    */

   /**
    * @name Controls/Header#countClickable
    * @cfg {Boolean} возможность посылать отдельное событие на клик по счетчику. Название события countClick
    */

   /**
    * @name Controls/Header#iconClickable
    * @cfg {Boolean} возможность посылать отдельное событие на клик по иконке. Название события iconClick
    */

   /**
    * @name Controls/Header#iconLocation
    * @cfg {String} расположение счетчика относительно заголовка
    * @variant after после загловка
    * @variant before перед заголовком
    */

   /**
    * @name Controls/Header#iconStyle
    * @cfg {String} стиль отображения иконки
    * @variant Accent синяя (все описания стилей в теме онлайна)
    * @variant Additional серая, без ховера
    * @variant Main красная
    */

   /**
    * @name Controls/Header#iconType
    * @cfg {String} тип иконки, названия совпадают с наименованием иконки(можно посмотреть на wi классы иконок icon-<имя>)
    * @variant MarkExpandBold обычная галка но двойной ширины
    * @variant ExpandLight обычная галка
    * @variant AccordionArrowDown двойная галка
    */

   /**
    * @name Controls/Header#iconValue
    * @cfg {Boolean} состоянее кнопки, включена ли она
    */

   /**
    * @name Controls/Header#separatorIcon
    * @cfg {Boolean} нужна ли иконка разделитель, используется только с заголовком. не путать  с кнопкой-разделителем. клик всегда общий с заголовком
    */

   /**
    * @name Controls/Header#separatorIconStyle
    * @cfg {String} стиль отображения иконки, в теме онлайна есть только одна возможная тема, она будет при установке любого допустимого значения в эту опцию
    * @variant primary красная в теме carry
    * @variant default синяя в теме carry
    */

   /**
    * @name Controls/Header#commonClick
    * @cfg {Boolean} если истина, то будет общий ховер у всех элементов
    */


   var classesOfIcon = {
      MarkExpandBold: {
         true: "icon-MarkExpandBold",
         false: "icon-MarkCollapseBold",
         size: "icon-16"
      },

      ExpandLight: {
         true: "icon-ExpandLight",
         false: "icon-CollapseLight",
         size: "icon-16"
      },

      AccordionArrowDown: {
         true: "icon-AccordionArrowDown",
         false: "icon-AccordionArrowUp ",
         size: "icon-24"
      }
   };

   var _private = {
      cssStyleGeneration: function (self, options) {
         if (classesOfIcon.hasOwnProperty(options.iconType)) {
            var currentIconClass = classesOfIcon[options.iconType];
            self._icon = currentIconClass[options.iconValue]+ ' ' + currentIconClass.size;
         }
      }
   };

   var Header = Control.extend({
      _template: template,

      constructor: function (options) {
         Header.superclass.constructor.apply(this, arguments);
         _private.cssStyleGeneration(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.cssStyleGeneration(this, newOptions);
      },

      countClickHandler: function (e) {
         if(this._options.countClickable){
            e.stopPropagation();
            this._notify('countClick');
         }
      },

      iconClickHandler: function (e) {
         if(this._options.iconClickable){
            e.stopPropagation();
            this._notify('iconClick');
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
            'default',
            's'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'default',
            's'
         ]),
         iconClickable: types(Boolean),
         iconLocation: types(String).oneOf([
            'after',
            'before'
         ]),
         iconStyle: types(String).oneOf([
            'Accent',
            'Additional',
            'Main'
         ]),
         iconType: types(String).oneOf([
            'MarkExpandBold',
            'ExpandLight',
            'AccordionArrowDown'
         ]),
         iconValue: types(Boolean),
         separatorIcon: types(Boolean),
         separatorIconStyle: types(String).oneOf([
            'primary',
            'default'
         ]),
         commonClick: types(Boolean)
      }
   };

   return Header;
});
