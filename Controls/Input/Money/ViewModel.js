define('Controls/Input/Money/ViewModel',
   [
      'Controls/Input/Base/ViewModel',
      'Controls/Input/Money/Formatter',
      'Controls/Input/Number/InputProcessor',
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(BaseViewModel, Formatter, InputProcessor, SplitValueHelper) {

      'use strict';

      var ViewModel = BaseViewModel.extend({
         handleInput: function(splitValue, inputType) {
            var
               result,
               splitValueHelper = new SplitValueHelper(splitValue),
               inputProcessor = new InputProcessor();

            this.options.precision = 2;

            //Если по ошибке вместо точки ввели запятую или "б"  или "ю", то выполним замену
            splitValue.insert = splitValue.insert.toLowerCase().replace(/,|б|ю/, '.');

            switch (inputType) {
               case 'insert':
                  result = inputProcessor.processInsert(splitValue, this.options, splitValueHelper);
                  break;
               case 'delete':
                  result = inputProcessor.processDelete(splitValue, this.options, splitValueHelper);
                  break;
               case 'deleteForward':
                  result = inputProcessor.processDeleteForward(splitValue, this.options, splitValueHelper);
                  break;
               case 'deleteBackward':
                  result = inputProcessor.processDeleteBackward(splitValue, this.options, splitValueHelper);
                  break;
            }

            this._value = result.value;
            this._selection.start = result.position;
            this._selection.end = result.position;

            this._shouldBeChanged = true;

            return true;

            /*var pathWithCursor, cursor, position;
            var value, hasDot;

            if (splitValue.insert.slice(-1) === '.' && splitValue.after[0] === '.') {
               hasDot = true;
            }

            if (inputType === 'insert') {
               var insert = Formatter.toNumber(splitValue.insert);

               if (splitValue.delete.indexOf('.') > -1) {
                  value = splitValue.before + '.' + splitValue.after;
                  pathWithCursor = 'fraction';
                  cursor = Formatter.toNumber(splitValue.before).integer.length + Formatter.toNumber(splitValue.insert).integer.length;
               } else {
                  value = splitValue.before + splitValue.after;
                  if (splitValue.before.indexOf('.') > -1) {
                     pathWithCursor = 'fraction';
                     cursor = splitValue.before.length + 1;
                  } else {
                     pathWithCursor = 'integer';
                     cursor = splitValue.before.length;
                  }
               }

               value = Formatter.toNumber(value);

               if (pathWithCursor === 'integer') {
                  value.integer = value.integer.substring(0, cursor) + insert.integer + value.integer.substring(cursor);
                  value.fraction = insert.fraction + value.fraction;
                  position = value.integer.substring(0, cursor).length + insert.integer.length;
               } else {
                  value.integer = insert.integer + value.integer;
                  value.fraction = value.fraction.substring(0, cursor - value.integer.length - insert.fraction.length - 1) + insert.fraction + value.fraction.substring(cursor - value.integer.length - insert.fraction.length - 1);
                  position = value.integer.length + 1 + insert.fraction.length;
               }
            } else {
               if (splitValue.delete.indexOf('.') > -1) {
                  value = splitValue.before + '.' + splitValue.after;
               } else {
                  value = splitValue.before + splitValue.after;
               }
               position = splitValue.before.length;
               value = Formatter.toNumber(value);
            }

            value = Formatter.toNumber(value.integer).integer + '.' + value.fraction.substring(0, 2) + '00'.substring(value.fraction.length);

            if (hasDot) {
               position++;
            }

            this._value = value;
            this._selection.start = position;
            this._selection.end = position;

            this._shouldBeChanged = true;

            return true;*/
         }
      });

      return ViewModel;
   }
);
