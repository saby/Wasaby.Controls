define('Controls/Popup/Compatible/EscProcessing',
   [
      'Env/Env',
      'Core/core-simpleExtend'
   ],
   function(Env, simpleExtend) {
      'use strict';

      /**
       * Класс для совместимости старых и новых окон по нажатию на esc.
       *
       * Старая панель по событию keydown закрывается и блокирует всплытие события. Новая панель делает
       * тоже самое, но по событию keyup. Из-за этого возникает следующая ошибка.
       * https://online.sbis.ru/opendoc.html?guid=0e4a5c02-f64c-4c7d-88b8-3ab200655c27
       *
       * Что бы не трогать старые окна, мы добавляем поведение на закрытие по esc. Закрываем только в том случае,
       * если новая панель поймала событие keydown клавиши esc.
       *
       * Использование:
       * 1. В кострукторе окна создаем инстанс Controls/Popup/Compatible/EscProcessing.
       * 2. Подписываемся на событие keydown.
       * 3. В обработчике события keydown вызываем Controls/Popup/Compatible/EscProcessing::keyDownHandler.
       * 4. В обработчике события keyup вызываем Controls/Popup/Compatible/EscProcessing::keyUpHandler.
       * В качестве аргумента передаем функцию, которая должна выполниться на keyup.
       */
      return simpleExtend.extend({
         _isEscDown: false,

         keyDownHandler: function(event) {
            if (event.nativeEvent.keyCode === Env.constants.key.esc) {
               this._isEscDown = true;
            }
         },

         /**
          * @param callback
          * @param ctx Контекст выполнения callback.
          * @param args Аргументы с которыми выполнится callback.
          */
         keyUpHandler: function(callback, ctx, args) {
            if (this._isEscDown) {
               this._isEscDown = false;
               callback.apply(ctx, args);
            }
         }
      });
   });
