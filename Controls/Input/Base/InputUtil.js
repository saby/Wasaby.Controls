define('Controls/Input/Base/InputUtil', [], function() {

   'use strict';

   return {

      /**
       * Get split by entered string.
       * @param {String} oldValue Value before working with the field.
       * @param {String} newValue Value after working with the field.
       * @param {Number} caretPosition Carriage position after working with the field.
       * @param {Controls/Input/Base/Types/Selection.typedef} selection Selection before working with the field.
       * @param {Controls/Input/Base/Types/InputType.typedef} inputType Type of working with the field.
       * @return {Controls/Input/Base/Types/SplitValue.typedef} Split
       */
      splitValue: function(oldValue, newValue, caretPosition, selection, inputType) {
         var selectionLength = selection.end - selection.start;
         var deletedValue, insertedValue, beforeInsertedValue, afterInsertedValue;

         afterInsertedValue = newValue.substring(caretPosition);
         beforeInsertedValue = inputType === 'insert'
            ? oldValue.substring(0, oldValue.length - afterInsertedValue.length - selectionLength)
            : newValue.substring(0, caretPosition);
         insertedValue = newValue.substring(beforeInsertedValue.length, newValue.length - afterInsertedValue.length);
         deletedValue = oldValue.substring(beforeInsertedValue.length, oldValue.length - afterInsertedValue.length);

         return {
            before: beforeInsertedValue,
            insert: insertedValue,
            delete: deletedValue,
            after: afterInsertedValue
         };
      },

      /**
       * Получить тип ввода.
       * @variant insert ввод значения.
       * @variant delete удаление с помощью backspace [ + ctrl] или delete [ + ctrl] с выделением значения.
       * @variant deleteBackward удаление с помощью backspace [ + ctrl] без выделения значения.
       * @variant deleteForward удаление с помощью delete [ + ctrl] без выделения значения.
       * @param {String} oldValue строка до ввода.
       * @param {String} newValue строка после ввода.
       * @param {Number} caretPosition позиция каретки после ввода.
       * @param {Object} selection объект с информацией о выделении.
       * @returns {String} тип ввода.
       */
      getInputType: function(oldValue, newValue, caretPosition, selection) {
         var
            selectionLength = selection.selectionEnd - selection.selectionStart,
            isDelete = (oldValue.length - selectionLength >= newValue.length) << 2,
            isSelection = !!selectionLength << 1,
            isOffsetCaret = caretPosition === selection.selectionEnd;

         switch (isDelete + isSelection + isOffsetCaret) {
            case 4:
               return 'deleteBackward';
            case 5:
               return 'deleteForward';
            case 6:
            case 7:
               return 'delete';
            default:
               return 'insert';
         }
      },

      /**
       * Получить тип ввода.
       * @variant insert ввод значения.
       * @variant delete удаление с помощью backspace [ + ctrl] или delete [ + ctrl] с выделением значения.
       * @variant deleteBackward удаление с помощью backspace [ + ctrl] без выделения значения.
       * @variant deleteForward удаление с помощью delete [ + ctrl] без выделения значения.
       * @param {String} nativeInputType нативный тип ввода.
       * @param {Object} selection объект с информацией о выделении.
       * @returns {String} тип ввода.
       */
      getAdaptiveInputType: function(nativeInputType, selection) {
         var selectionLength, execType;

         selectionLength = selection.end - selection.start;
         execType = /^(insert|delete|).*?(Backward|Forward|)$/.exec(nativeInputType);

         return selectionLength ? execType[1] : execType[1] + execType[2];
      }
   };
});
