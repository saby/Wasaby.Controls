define('js!Controls/Input/Number', [
   'Core/Control',
   'tmpl!Controls/Input/Number/Number',
   'js!WS.Data/Type/descriptor',

   'js!Controls/Input/resources/InputRender/InputRender',
   'tmpl!Controls/Input/resources/input'
], function (Control,
             template,
             types) {

   'use strict';
   var
      _private,
      NumberTextBox;

   _private = {
      splitValue: null,

      /**
       * Возвращает значение инпута без разделительных пробелов
       * @returns {String}
       */
      getClearValue: function() {
         return _private.concatSplitValue().replace(/ /g, '');
      },

      /**
       * Возвращает значение инпута в виде строки
       * @returns {String}
       */
      concatSplitValue: function() {
         return _private.splitValue.before + _private.splitValue.insert + _private.splitValue.after;
      },

      /**
       * Возвращает готовую строку с разделителями
       * @returns {String}
       */
      getValueWithDelimiters: function() {
         var
            clearValSplited = _private.getClearValue().split('.');

         //Разбиваем на триады только часть до точки
         clearValSplited[0] = clearValSplited[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');

         return clearValSplited.join('.');
      },

      /**
       * Возвращает позицию курсора с учетом разделителей
       * @param shift {Integer} дополнительный сдвиг курсора
       * @returns {Integer}
       */
      getCursorPosition: function (shift) {
         var
            beforeNewDelimetersSpacesCnt = _private.concatSplitValue().split(' ').length - 1,
            afterNewDelimetersSpacesCnt = _private.getValueWithDelimiters().split(' ').length - 1,
            spacesCntDiff = afterNewDelimetersSpacesCnt - beforeNewDelimetersSpacesCnt;

         return _private.splitValue.before.length + _private.splitValue.insert.length + spacesCntDiff + shift;
      },

      /**
       * Валидирует и подготавливает новое значение по splitValue
       * @param splitValue
       * @returns {{value: (*|String), position: (*|Integer)}}
       */
      prepareData: function (splitValue) {
         var
            regExp = _private.getRegexp(this._options.onlyPositive, this._options.integersLength, this._options.precision),
            shift = 0;

         _private.splitValue = splitValue;

         //Если был удалён пробел, то нужно удалить цифру слева от него и сдвинуть курсор на единицу влево
         if (splitValue.delete === ' ') {
            splitValue.before = splitValue.before.substr(0, splitValue.before.length - 1);
            shift = -1;
         }

         //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
         splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

         //Если валидация не прошла, то не даем ничего ввести
         if (!regExp.test(_private.getClearValue())) {
            splitValue.insert = '';
         } else {
            //Если в начале строки ввода точка, а до неё ничего нет, то предполагаем что хотят видеть '0.'
            if (splitValue.insert[0] === '.' && !splitValue.before) {
               splitValue.before = '0';
            }
         }

         //Запишет значение в input и поставит курсор в указанное место
         return {
            value: _private.getValueWithDelimiters(),
            position: _private.getCursorPosition(shift)
         };
      },

      /**
       * Генерирует регулярное выражение в зависимости от переданных опций
       * @param onlyPositive Только положительные значения
       * @param integersLength Максимальная длина целой части
       * @param precision Максимальная длина дробной части
       * @returns {RegExp}
       */
      getRegexp: function (onlyPositive, integersLength, precision) {
         var
            regExpString = '^';

         //Разрешён ли минус в начале
         if (!onlyPositive) {
            regExpString += '\\-?';
         }

         //Ограничение длины целой части
         if (integersLength) {
            regExpString += '\\d{0,' + integersLength + '}';
         } else {
            regExpString += '\\d*';
         }

         //Ограничение дробной части
         //По умолчанию можно вводить любое количество
         if (typeof precision === 'undefined') {
            regExpString += '(\\.\\d*)?';
         } else if (precision !== 0) {
            regExpString += '(\\.\\d{0,' + precision + '})?';
         }

         regExpString += '$';

         return new RegExp(regExpString);
      }
   };

   NumberTextBox = Control.extend({
      /**
       * Поле ввода числа.
       * @class Controls/Input/Number
       * @extends Controls/Control
       * @mixes Controls/Input/interface/IInputNumber
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidationError
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

      constructor: function (options) {
         NumberTextBox.superclass.constructor.apply(this, arguments);
         this._prepareData = _private.prepareData.bind(this);
      },

      _beforeUpdate: function (newOptions) {
         this._value = newOptions.value;
      },

      _changeValueHandler: function (event, value) {
         this._value = value;
         this._notify('onChangeValue', value);
      },

      _inputCompletedHandler: function () {
         var
            tmp = this._value.split('.'),
            integers = tmp[0],
            decimals = tmp[1];

         //Если дробная часть пустая или нулевая, то нужно убрать её
         if (!parseInt(decimals, 10)) {
            this._value = integers;
         }

         this._notify('inputCompleted', this._value);
      },

      _notifyHandler: function (event, value) {
         this._notify(value);
      }
   });

   NumberTextBox.getOptionTypes = function () {
      return {
         precision: types(Number), //Точность (кол-во знаков после запятой)
         integersLength: types(Number), //Длина целой части
         onlyPositive: types(Boolean) //Только положительные значения
      };
   };

   NumberTextBox._private = _private;

   return NumberTextBox;
});