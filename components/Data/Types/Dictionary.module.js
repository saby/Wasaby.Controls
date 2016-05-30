/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Dictionary', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (IEnumerable, ArrayEnumerator) {
   'use strict';

   /**
    * Тип данных словарь.
    * Это абстрактный класс, не предусмотрено создание самостоятельных экземпляров.
    * @class SBIS3.CONTROLS.Data.Types.Dictionary
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @author Мальцев Алексей
    */

   var Dictionary = $ws.core.extend({}, [IEnumerable],/** @lends SBIS3.CONTROLS.Data.Types.Dictionary.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Dictionary',
      $protected: {
         _options: {
            /**
             * @cfg {Array.<String>} Словарь возможных значений
             */
            dictionary: []
         }
      },

      $constructor: function () {
         var dictionary = this._options.dictionary;
         if (dictionary instanceof Object && !(dictionary instanceof Array)) {
            var dictionaryArray = [];
            for (var index in dictionary){
               if (dictionary.hasOwnProperty(index)) {
                  dictionaryArray[index] = dictionary[index];
               }
            }
            this._options.dictionary = dictionaryArray;
         }
      },

      //region SBIS3.CONTROLS.Data.Collection.IEnumerable

      each: function (callback, context) {
         context = context || this;
         var enumerator = this.getEnumerator(),
            index = 0,
            key;
         while ((key = enumerator.getNext())) {
            callback.call(context, key, index++);
         }
      },

      getEnumerator: function () {
         return new ArrayEnumerator(this._options.dictionary);
      },

      //endregion SBIS3.CONTROLS.Data.Collection.IEnumerable

      //region Public methods

      /**
       * Сравнивает с другим словарем
       * @param {Dictionary} to Словарь, с которым сравнить
       * returns {Boolean}
       */
      isEqual: function(to) {
         if (!(to instanceof Dictionary)) {
            return false;
         }

         var selfDict = this._options.dictionary,
            extDict = to._options.dictionary,
            selfDictLen = selfDict.length,
            extDictLen = extDict.length,
            index;

         if (selfDictLen !== extDictLen) {
            return false;
         }

         for (index = 0; index < selfDictLen; index++) {
            if (selfDict[index] !== extDict[index]) {
               return false;
            }
         }

         return true;
      },

      //endregion Public methods

      //region Protected methods

      _getIndex: function (name) {
         return Array.indexOf(this._options.dictionary, name);
      },

      _getKeByIndex: function (index) {
         return this._options.dictionary[index];
      }

      //endregion Protected methods
   });

   return Dictionary;
});
