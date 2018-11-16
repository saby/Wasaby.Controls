define('Controls/Input/Base/InputUtil', [], function() {

   'use strict';

   return {

      /**
       * Get split by entered string.
       * @param {String} oldValue Values in the field before changing it.
       * @param {String} newValue Values in the field after changing it.
       * @param {Number} caretPosition Carriage position in the field after changing value.
       * @param {Controls/Input/Base/Types/Selection.typedef} selection Selection in the field before changing value.
       * @param {Controls/Input/Base/Types/InputType.typedef} inputType Type of changing value in the field.
       * @return {Controls/Input/Base/Types/SplitValue.typedef}
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
       * @param {String} oldValue Values in the field before changing it.
       * @param {String} newValue Values in the field after changing it.
       * @param {Number} caretPosition Carriage position in the field after changing value.
       * @param {Controls/Input/Base/Types/Selection.typedef} selection Selection in the field before changing value.
       * @returns {Controls/Input/Base/Types/InputType.typedef}
       */
      getInputType: function(oldValue, newValue, caretPosition, selection) {
         var
            selectionLength = selection.end - selection.start,
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
       * @param {Controls/Input/Base/Types/InputType.typedef} inputType Type of changing value in the field.
       * @param {Controls/Input/Base/Types/Selection.typedef} selection Selection in the field before changing value.
       * @returns {Controls/Input/Base/Types/InputType.typedef}
       */
      getAdaptiveInputType: function(nativeInputType, selection) {
         var selectionLength, execType;

         selectionLength = selection.end - selection.start;
         execType = /^(insert|delete|).*?(Backward|Forward|)$/.exec(nativeInputType);

         return selectionLength ? execType[1] : execType[1] + execType[2];
      }
   };
});
