/**
 * Created by am.gerasimov on 01.02.2016.
 */
define('js!SBIS3.CONTROLS.ControlsValidators', ['js!SBIS3.CORE.CoreValidators', 'i18n!SBIS3.CONTROLS.ControlsValidators'],function(CoreValidators) {

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
               if(option instanceof $ws.proto.Enum) {
                  isEmpty = option.getCurrentValue() === null;
               } else if($ws.helpers.instanceOfModule(option, 'SBIS3.CONTROLS.Data.Collection.List')) {
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
       * Проверяет ИНН (допустимая длина ИНН - 10 или 12 символов).
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
       * @param {String} value Значение валидируемой опции.
       * @returns {Boolean|String}
       * <ol>
       *    <li>В случае прохождения валидации возвращает true.</li>
       *    <li>В случае не прохождения валидации возвращает сообщение "Поле обязательно для заполнения".</li>
       * </ol>
       */
      inn12: checkInn.bind(undefined, 12)
   };
});