define('js!Controls/Input/resources/TargetUtil',
   [
      'Core/core-extend'
   ],
   function(coreExtend) {

      'use strict';

      /*
      * Предназначен для удобной работы с полями ввода.
      * Абстрагирует в себе работу с кареткой и выделением.
      * */

      var TargetUtil = coreExtend({

         saveSelectionPosition: function(target){
            this._selectionStart = target.selectionStart;
            this._selectionEnd = target.selectionEnd;
         },

         setValue: function(target, value, position){
            target.value = value;
            target.setSelectionRange(position, position);
         },

         buildSplitValue: function(target, oldValue){
            var
               newValue = target.value,
               position = target.selectionEnd,
               selectionLength = this._selectionEnd - this._selectionStart;

            var beforeInputValue, afterInputValue, inputValue;

            //Если до этого не было выделения и каретка сместилась назад или осталась на прошлом месте,
            // значит это удаление.
            if(!selectionLength && this._selectionStart >= position){
               afterInputValue = newValue.substring(position);
               beforeInputValue = newValue.substring(0, position);
               inputValue = '';
            }
            else {
               afterInputValue = newValue.substring(position);
               beforeInputValue = oldValue.substring(0, oldValue.length - afterInputValue.length - selectionLength);
               inputValue = newValue.substring(beforeInputValue.length, newValue.length - afterInputValue.length);
            }

            return {
               beforeInputValue: beforeInputValue,
               inputValue: inputValue,
               afterInputValue: afterInputValue
            };
         }

      });

      return TargetUtil;
   }
);