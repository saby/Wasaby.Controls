/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('SBIS3.CONTROLS/Utils/ControlsValidators', [
   'Lib/CoreValidators/CoreValidators',
   'Core/core-instance',
   'Core/IoC',
   'Controls/Validate/Validators/IsEmail',
   'Controls/Validate/Validators/IsRequired',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'i18n!SBIS3.CONTROLS/Utils/ControlsValidators'
],function(CoreValidators, cInstance, IoC, IsEmail, IsRequired, DateUtil) {

   'use strict';

   function checkInn(innLen, value) {
      var obj = {
         getValue: function() {
            return value;
         }
      };

      return CoreValidators.inn.call(obj, innLen);
   }


   /**
    * Компонент с набором платформенных валидаторов, которые можно применять только к контролам из пространства имён SBIS3.CONTROLS.
    * Подробнее о работе с валидаторами вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/validation/">Валидация вводимых данных</a>.
    * @class SBIS3.CONTROLS/Utils/ControlsValidators
    * @public
    * @author Красильников А.С.
    */
   return /** @lends SBIS3.CONTROLS/Utils/ControlsValidators.prototype */{
      /**
       * Проверяет наличие введённого значения.
       * @param {String} option Название опции контрола, значение которой валидируется.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Поле обязательно для заполнения".</li>
       * </ol>
       */
      required: function(option) {
         if (typeof option === 'object' && cInstance.instanceOfModule(option, 'Deprecated/Enum')) {
            IoC.resolve('ILogger').error('SBIS3.CONTROLS/Utils/ControlsValidators', 'использует устаревший модуль Deprecated/Enum. Выпишите ошибку на Интерфейсный фреймворк со скриншотом.');
            return IsRequired({
               value: option.getCurrentValue()
            });
         }

         return IsRequired({
            value: option
         });
      },

      /**
       * Проверяет введённое число на соответствие допустимому диапазону значений.
       * @param {Number|String} min Нижняя граница диапазона.
       * @param {Number|String} max Верхняя граница диапазона.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Значение должно попадать в диапазон ...".</li>
       * </ol>
       */
      inRange: function (min, max, value) {
         var isInRange;

         min = parseFloat(min);
         max = parseFloat(max);

         if(value === '' || isNaN(value) || isNaN(min) || isNaN(max) || value == undefined){
            return true;
         }

         isInRange = !isNaN(parseFloat(value)) && isFinite(value) && value >= min && value <= max;
         return isInRange ? true : 'Значение должно попадать в диапазон ['+ min +';' + max +']';
      },

      /**
       * Проверяет ИНН (допустимая длина ИНН - 10 или 12 символов).
       * @function
       * @param {String} value Значение валидируемой опции.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Поле обязательно для заполнения".</li>
       * </ol>
       */
      inn: checkInn.bind(undefined, undefined),

      /**
       * Проверяет ИНН (допустимая длина ИНН - 10 символов).
       * @function
       * @param {String} value Значение валидируемой опции.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Поле обязательно для заполнения".</li>
       * </ol>
       */
      inn10: checkInn.bind(undefined, 10),

      /**
       * Проверяет ИНН (допустимая длина ИНН - 12 символов).
       * @function
       * @param {String} value Значение валидируемой опции.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Поле обязательно для заполнения".</li>
       * </ol>
       */
      inn12: checkInn.bind(undefined, 12),
      /**
       * Проверяет значение поля ввода на соответствие значению из другого поля ввода.
       * @param {String} name Имя поля ввода, со значением которого будет производиться сравнивание.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Значение поля должно совпадать с полем ...".</li>
       * </ol>
       */
      compare : function(name, currentValue) {
         var compareValue;
         try {
            compareValue = this.getTopParent().getChildControlByName(name).getText() || '';
         } catch(e) {
            return false;
         }
         return (currentValue === compareValue) ? true : 'Значение поля должно совпадать с полем "' + name + '"';
      },
      /**
       * Проверяет корректность введеного e-mail.
       * @remark Предпочтительно использовать с флагом noFailOnError, т.к. есть исключительный ситуации.
       * @param {String} value Значение которое валидируется.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "В поле требуется ввести адрес электронной почты".</li>
       * </ol>
       */
      email: function(value) {
         return IsEmail({
          value :value

         });
      },
      /**
       * Проверяет строку на соответствие формату страхового номера индивидуального лицевого счета (СНИЛС).
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщения "СНИЛС должен состоять из 11 цифр" или "Неверная контрольная сумма СНИЛС".</li>
       * </ol>
       */
      snils : function(value){
         if (!value){
            return true;
         }
         value = value.replace(/\D+/g,""); //Берем только цифры,т.к. с форматных полей могут прийти лишние символы с маски
         //Проверим длину входных данных
         if (value.length !== 11){
            return rk('СНИЛС должен состоять из 11 цифр');
         }

         var lastDigs = value % 100, //Получим контрольные цифры
             snilsNum = value.substr(0, 9),
             ctrlDigs = 0;//Считаем контрольную сумму ( сумма произведений цифры на( 10 - (позиция, на которой она стоит) ) )

         for (var i = 1; i < 10; i++) {
            ctrlDigs += snilsNum.substr(i - 1, 1) * (10 - i);
         }
         //Посчитанную контрольную сумму надо взять по модулю 101 и после этого по модулю 100( контрольная сумма для 100 должна быть 00 )
         ctrlDigs = (ctrlDigs % 101) % 100;
         //Сравним значения контрольных сумм
         return (ctrlDigs == lastDigs) ? true : rk('Неверная контрольная сумма СНИЛС');
      },

      /**
       * Проверяет является ли дата началом месяца.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщения "Неверная дата. Дата не является датой начала месяца".</li>
       * </ol>
       */
      startOfMonth: function(value) {
         return !value || DateUtil.isStartOfMonth(value) || rk('Неверная дата. Дата не является датой начала месяца.');
      },

      /**
       * Проверяет является ли дата концом месяца.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщения "Неверная дата. Дата не является датой конца месяца".</li>
       * </ol>
       */
      endOfMonth: function(value) {
         return !value || DateUtil.isEndOfMonth(value) || rk('Неверная дата. Дата не является датой конца месяца.');
      }
   };
});