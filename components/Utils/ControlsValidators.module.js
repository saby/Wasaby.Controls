/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('js!SBIS3.CONTROLS.ControlsValidators', [
   'js!SBIS3.CORE.CoreValidators',
   'Core/core-instance',
   'Core/Enum',
   'i18n!SBIS3.CONTROLS.ControlsValidators'
],function(CoreValidators, cInstace, cEnum) {

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
    * Подробнее о работе с валидаторами вы можете прочитать в разделе <a href="http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/validation/">Валидация вводимых данных</a>.
    * @class SBIS3.CONTROLS.ControlsValidators
    * @public
    * @author Красильников Андрей Сергеевич
    */
   return /** @lends SBIS3.CONTROLS.ControlsValidators.prototype */{
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
         var isEmpty;

         switch (typeof option) {
            case 'string' :
               isEmpty = !Boolean(option);
               break;
            case 'number' :
               isEmpty = isNaN(option);
               break;
            case 'object' :
               if(option instanceof cEnum) {
                  isEmpty = option.getCurrentValue() === null;
               } else if(cInstace.instanceOfModule(option, 'WS.Data/Collection/List')) {
                  isEmpty = !Boolean(option.getCount());
               } else if(option instanceof Array) {
                  isEmpty = !Boolean(option.length);
               } else if(option instanceof Object) {
                  isEmpty = Object.isEmpty(option)
               } else if(option === null) {
                  isEmpty = true;
               }
               break;
            case 'boolean' :
               isEmpty = option;
               break;
            case 'undefined' :
               isEmpty = true;
               break;
         }

         return isEmpty ?
             rk('Поле обязательно для заполнения') :
             true;
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

         if(value === '' || isNaN(value) || isNaN(min) || isNaN(max)){
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
         //Регулярное выражение для проверки email отсюда http://stackoverflow.com/a/46181/6729520
         var
            regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            isGoodValue = value ? regExp.test(value) : true;

         return isGoodValue ? 
            true :
            rk('В поле требуется ввести адрес электронной почты');
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
      }
   };
});