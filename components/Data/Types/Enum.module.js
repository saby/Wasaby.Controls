/* global define, $ws */

define('js!SBIS3.CONTROLS.Data.Types.Enum', [
   'js!SBIS3.CONTROLS.Data.Types.IEnum',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.Projection.Enum'
], function (IEnum, IEnumerable, ArrayEnumerator) {
   /**
    * Тип данных перечисляемое.
    * @class SBIS3.CONTROLS.Data.Types.Enum
    * @mixin SBIS3.CONTROLS.Data.Data.Types.IEnum
    * @mixin SBIS3.CONTROLS.Data.Data.Types.IEnumerable
    * @public
    * @author Ганшнин Ярослав
    */
   'use strict';
   var Enum = $ws.core.extend({}, [IEnum,IEnumerable], {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Enum',
      $protected: {
         _options: {
            data: [],
            currentValue:undefined
         },
         _currentValue: undefined,
         _enumerator: undefined
      },
      $constructor: function(cfg) {
         if(!(cfg.data instanceof Array)){
            throw new Error('data must be an array');
         }
         if(cfg.hasOwnProperty('currentValue')){
            this.set(cfg.currentValue);
         }
      },

      each: function(callback, context, unwrapOnRead) {
         var listItem,
            enumerator = this.getEnumerator(),
            index = 0;
         enumerator.reset();
         context = context||this;
         if(typeof callback !== 'function'){
            throw new Error("callback isn't a function");
         }
         while ((listItem = enumerator.getNext())) {
            var item  = listItem;
            if (unwrapOnRead) {
               item = listItem.getContents();
            }
            callback.call(context, item, index++);
         }
         $ws.helpers.forEach(this._options.data, callback, context);
      },

      toArray: function() {
         return this._options.data;
      },

      getEnumerator: function() {
         if(!this._enumerator) {
            this._enumerator =  new ArrayEnumerator({
               items: this._options.data
            });
         }
         return this._enumerator;
      },

      get: function() {
         return this._currentValue;
      },

      set: function(index) {
         if(index in this._options.data) {
            this._currentValue = index;
         }
      },
      /**
      *  Возвращает текущее значение
      * @deprecated Будет удалено с 3.8.0 Используйте {@link get}
      * @returns {Number}
      */
      getCurrentValue: function() {
         $ws.single.ioc.resolve('ILogger').log('getCurrentValue', 'c 3.8.0 метод getCurrentValue перестанет работать. Используйте метод get.');
         return this.get();
      }
   });
   return Enum;
});
