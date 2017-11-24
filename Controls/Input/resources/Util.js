define('js!Controls/Input/resources/Util',
   [
      'Core/core-extend'
   ],
   function(coreExtend) {

      'use strict';

      /*
      * Предназначен для удобной работы с полями ввода.
      * Абстрагирует в себе работу с кареткой и выделением.
      * */

      var Util = coreExtend({

         saveSelectionPosition: function(target){
            this._selectionStart = target.selectionStart;
            this._selectionEnd = target.selectionEnd;
         },

         setValue: function(target, value, position){
            target.value = value;
            target.setSelectionRange(position, position);
         },

         /*
         * Разобрать значение из таргета на слудующий формат:
         * {
         *   before - подстрока до введнной
         *   input - введенная подстрока
         *   after - подстрока после введенной
         * }
         *
         * @param target таргет
         * @param oldValue старое значение
         *
         * */
         buildSplitValue: function(target, oldValue){
            var
               newValue = target.value,
               position = target.selectionEnd,
               selectionLength = this._selectionEnd - this._selectionStart;

            var before, after, input;

            //Если до этого не было выделения и каретка сместилась назад или осталась на прошлом месте,
            // значит это удаление.
            if(!selectionLength && this._selectionStart >= position){
               after = newValue.substring(position);
               before = newValue.substring(0, position);
               input = '';
            }
            else {
               after = newValue.substring(position);
               before = oldValue.substring(0, oldValue.length - after.length - selectionLength);
               input = newValue.substring(before.length, newValue.length - after.length);
            }

            return {
               before: before,
               input: input,
               after: after
            };
         }

      });

      return Util;
   }
);