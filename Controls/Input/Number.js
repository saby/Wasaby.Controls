define('js!Controls/Input/Number', [
   'Core/Control',
   'tmpl!Controls/Input/Number/Number',
   'js!WS.Data/Type/descriptor',
   'js!WS.Data/Utils',

   'js!Controls/Input/resources/TextRender/TextRender'
], function (
   Control,
   template,
   types,
   Utils
) {

   'use strict';

   var NumberTextBox = Control.extend({
      /**
       * Поле ввода числа.
       * @class Controls/Input/Number
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       */

      /**
       * @name Controls/Input/Number#decimals
       * @cfg {Number} Количество знаков после запятой
       */

      /**
       * @name Controls/Input/Number#onlyPositive
       * @cfg {Boolean} Ввод только положительных чисел
       */

      /**
       * @name Controls/Input/Number#onlyInteger
       * @cfg {Boolean} Ввод только целых чисел
       */

      /**
       * @name Controls/Input/Number#integers
       * @cfg {Number} Количество знаков до запятой
       */

      /**
       * @name Controls/Input/Number#showEmptyDecimals
       * @cfg {Boolean} Показывать нулевую дробную часть
       */

       _template: template,

      _beforeMount: function (options) {
         this._value = options.value;
         this._getInputData = this._getInputData.bind(this);
      },

      _beforeUpdate: function (newOptions) {
         this._value = newOptions.value;
      },

      _inputHandler: function (event, newValue) {
         if (this._value !== newValue) {
            this._value = newValue;
            this._notify('onChangeValue', newValue);
         }
      },

      //Срабатывает при вводе символа. Позволяет скорректировать итоговое значение поля
      _getInputData: function (splitValue) {
         var
            splitValueInterface = new SplitValueModule(splitValue);

         //Если валидация не прошла, то не даем ничего ввести
         if (!splitValueInterface.validate(_getRegexp(this._options))) {
            splitValueInterface.setInputValue('');
         } else {
            //Если в начале строки ввода точка, а до неё ничего нет, то предполагаем что хотят видеть '0.'
            if (splitValueInterface.getInputValue()[0] === '.' && !splitValueInterface.getBeforeInputValue()) {
               splitValueInterface.setBeforeInputValue('0');
            }
         }

         //Тут нужно произвести какую-то обработку пришедшего значения (в сплит-формате) и вернуть итоговое значение и позицию

         //Запишет значение в input и поставит курсор в указанное место
         return {
            value: splitValueInterface.getValueWithDelimiters(),
            position: splitValueInterface.getCursorPosition()
         };
      }
   });

   //Функция генерирует регулярное выражение в зависимости от переданных опций
   function _getRegexp(options) {
      var
         regExpString = '^';

      //Разрешён ли минус в начале
      if (!options.onlyPositive) {
         regExpString += '\\-?';
      }

      //Ограничение длины целой части
      if (options.integersLength) {
         regExpString += '\\d{0,' + options.integersLength + '}';
      } else {
         regExpString += '\\d*';
      }

      //Ограничение дробной части
      //По умолчанию можно вводить любое количество
      if (typeof options.precision === 'undefined') {
         regExpString += '(\\.\\d*)?';
      } else if (options.precision !== 0) {
         regExpString += '(\\.\\d{0,' + options.precision + '})?';
      }

      regExpString += '$';

      return new RegExp(regExpString);
   }


   /**
    * Модуль для работы с объектом из TextRender
    * Возможности:
    * Получение оригинального объекта splitValue -- getOriginalObject()
    * Склейка объекта splitValue в строку -- concat()
    * Получение "чистой" (без пробелов) склеенной строки -- getClear()
    * Получение текущей позиции курсора -- getCursorPosition()
    * Есть геттеры и сеттеры свойств
    * Валидация -- validate(regExp)
    * Получение целой части -- getIntegers()
    * Получение дробной части -- getDecimals()
    */
   function SplitValueModule(splitValueObj) {
      var
         _splitValueObj = Utils.clone(splitValueObj);
      return {
         getSplitValue: function() {
            return _splitValueObj;
         },
         concat: function() {
            return _splitValueObj.beforeInputValue + _splitValueObj.inputValue + _splitValueObj.afterInputValue;
         },
         getClear: function() {
            return this.concat().replace(/ /g, '');
         },
         getCursorPosition: function() {
            //FIXME подумать как сделать получше
            var
               beforeNewDelimetersSpacesCnt = this.concat().split(' ').length - 1,
               afterNewDelimetersSpacesCnt = this.getValueWithDelimiters().split(' ').length - 1,
               spacesCntDiff = afterNewDelimetersSpacesCnt - beforeNewDelimetersSpacesCnt;
            return _splitValueObj.beforeInputValue.length + _splitValueObj.inputValue.length + spacesCntDiff;
         },
         setBeforeInputValue: function(value) {
            _splitValueObj.beforeInputValue = value || '';
            return this;
         },
         getBeforeInputValue: function() {
            return _splitValueObj.beforeInputValue;
         },
         setInputValue: function(value) {
            _splitValueObj.inputValue = value || '';
            return this;
         },
         getInputValue: function() {
            return _splitValueObj.inputValue;
         },
         setAfterInputValue: function(value) {
            _splitValueObj.afterInputValue = value || '';
            return this;
         },
         getAfterInputValue: function() {
            return _splitValueObj.afterInputValue;
         },
         validate: function(regExp) {
            return regExp.test(this.getClear());
         },
         getValueWithDelimiters: function() {
            var
               clearValSplited = this.getClear().split('.');

            //Разбиваем на триады только часть до точки
            clearValSplited[0] = clearValSplited[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

            return clearValSplited.join('.');
         },
         getIntegers: function() {
            return this.getClear().split('.')[0];
         },
         getDecimals: function() {
            return this.getClear().split('.')[1] || '';
         }
      }
   }

   NumberTextBox.getOptionTypes = function () {
      return {
         precision: types(Number), //Точность (кол-во знаков после запятой)
         integersLength: types(Number), //Длина целой части
         onlyPositive: types(Boolean) //Только положительные значения
      };
   };

   return NumberTextBox;
});