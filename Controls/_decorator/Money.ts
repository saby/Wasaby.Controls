import Control = require('Core/Control');
import entity = require('Types/entity');
import splitIntoTriads = require('Controls/Utils/splitIntoTriads');
import template = require('wml!Controls/_decorator/Money/Money');
import {Logger} from 'UI/Utils';

/**
 * Преобразует число в денежный формат.
 *
 * @class Controls/_decorator/Money
 * @extends Core/Control
 *
 * @mixes Controls/_interface/INumberFormat
 *
 * @public
 * @demo Controls-demo/Decorators/Money/Money
 * @demo Controls-demo/Decorator/Money/Styles/Index
 *
 * @author Красильников А.С.
 */

/*
 * Converts a number to money.
 *
 * @class Controls/_decorator/Money
 * @extends Core/Control
 *
 * @mixes Controls/_interface/INumberFormat
 *
 * @public
 * @demo Controls-demo/Decorators/Money/Money
 *
 * @author Красильников А.С.
 */

/*
 * @name Controls/_decorator/Money#number
 * @cfg {Number} Number to convert.
 * @deprecated Use option {@link value}
 */

/**
 * @name Controls/_decorator/Money#value
 * @cfg {String|Number} Значение в числовом формате для преобразования.
 */

/*
 * @name Controls/_decorator/Money#value
 * @cfg {String|Number} Value in number format to convert.
 */

/*
 * @name Controls/_decorator/Money#delimiters
 * @cfg {Boolean} Determines whether the number should be split into triads.
 * @default false
 * @remark
 * true - the number split into triads.
 * false - does not do anything.
 * @deprecated Use option {@link Controls/input:Number#useGrouping}
 */


/**
 * @name Controls/_decorator/Money#style
 * @cfg {String} Стиль отображения числа в денежном формате. Посмотреть демо-пример можно в описании контрола Money.
 * @variant accentResults Акцентированная сумма в строке Итоги.
 * @variant noAccentResults Не акцентная сумма в строке Итоги.
 * @variant group Сумма в группировке.
 * @variant basicRegistry Основная сумма в реестре.
 * @variant noBasicRegistry Не основная сумма в реестре.
 * @variant accentRegistry Акцентная сумма в реестре.
 * @variant noAccentRegistry Не акцентная сумма в реестре.
 * @variant error Ошибка.
 * @variant default По умолчанию.
 * @default default
 * @demo Controls-demo/Decorator/Money/Styles/Index
 */

/*
 * @name Controls/_decorator/Money#style
 * @cfg {String} The type with which you want to display money.
 * @variant accentResults
 * @variant noAccentResults
 * @variant group
 * @variant basicRegistry
 * @variant noBasicRegistry
 * @variant accentRegistry
 * @variant noAccentRegistry
 * @variant error
 * @variant default
 * @default default
 */

var _private = {
   searchPaths: /(-?[0-9]*?)(\.[0-9]{2})/,

   parseNumber: function (value, delimiters, self) {
      var exec = this.searchPaths.exec(parseFloat(value).toFixed(2));

      if (!exec) {
         Logger.error('Controls/_decorator/Money: That is not a valid option value: ' + value + '.', self);
         exec = ['0.00', '0', '.00'];
      }

      var integer = delimiters ? splitIntoTriads(exec[1]) : exec[1];
      var fraction = exec[2];

      return {
         integer: integer,
         fraction: fraction,
         number: integer + fraction
      };
   },

   isUseGrouping: function (options, useLogging, self) {
      if ('delimiters' in options) {
         if (useLogging) {
            Logger.warn('Controls/_decorator/Money: Опция delimiters устарела, используйте useGrouping.', self);
         }

         return options.delimiters;
      }

      return options.useGrouping;
   },

   getValue: function (options, useLogging, self) {
      if ('number' in options) {
         if (useLogging) {
            Logger.warn('Controls/_decorator/Money: Опция number устарела, используйте value.', self);
         }

         return options.number.toString();
      }

      return options.value;
   },

   getTitle: function(options, value) {
      if (options.hasOwnProperty('title')) {
         return options.title;
      }

      return value;
   }
};

var Money = Control.extend({
   _template: template,

   _parsedNumber: null,

   _title: null,

   _beforeMount: function (options) {
      this._parsedNumber = _private.parseNumber(
         _private.getValue(options, true, this),
         _private.isUseGrouping(options, true, this),
          this
      );
      this._title = _private.getTitle(options, this._parsedNumber.number);
   },

   _beforeUpdate: function (newOptions) {
      var newUseGrouping = _private.isUseGrouping(newOptions, false, this);
      var oldUseGrouping = _private.isUseGrouping(this._options, false, this);
      var newValue = _private.getValue(newOptions, false, this);
      var oldValue = _private.getValue(this._options, false, this);

      if (newValue !== oldValue || newUseGrouping !== oldUseGrouping) {
         this._parsedNumber = _private.parseNumber(newValue, newUseGrouping, this);
      }
      this._title = _private.getTitle(newOptions, this._parsedNumber.number);
   },

   _isDisplayFractionPath: function(value, showEmptyDecimals) {
      return showEmptyDecimals || value !== '.00';
   }
});

Money.getDefaultOptions = function () {
   return {
      style: 'default',
      useGrouping: true,
      showEmptyDecimals: true
   };
};

Money.getOptionTypes = function () {
   return {
      style: entity.descriptor(String),
      useGrouping: entity.descriptor(Boolean),
      value: entity.descriptor(String, Number)
   };
};

Money._theme = ['Controls/decorator'];

Money._private = _private;

export = Money;
