/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StaticSource', [
   'js!SBIS3.CONTROLS.BaseSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet'
], function (BaseSource, Record, DataSet) {
   'use strict';

   /**
    * Класс для работы с массивами, как с источником данных.
    * @author Мануйлов Андрей
    * @public
    * @class SBIS3.CONTROLS.StaticSource
    * @extends SBIS3.CONTROLS.BaseSource
    */

   return BaseSource.extend({
      $protected: {
         _initialDataSet: undefined,
         _options: {
            /**
             * @cfg {Array} Исходный массив данных, с которым работает StaticSource
             */
            data: [],
            /**
             * @cfg {String} Название поля, являющегося первичных ключом
             * @example
             * <pre>
             *     <option name="keyField">@Заметка</option>
             * </pre>
             */
            keyField: ''
         }
      },

      $constructor: function (cfg) {
         // неявно создадим начальный датасет, с которым будем работать дальше
         this._initialDataSet = new DataSet({
            strategy: this.getStrategy(),
            data: cfg.data,
            keyField: this._options.keyField
         });
      },

      create: function () {
         var def = new $ws.proto.Deferred(),
            record = new Record({
               strategy: this.getStrategy(),
               raw: {},
               keyField: this._options.keyField
            });
         def.callback(record);
         return def;
      },

      read: function (id) {
         var def = new $ws.proto.Deferred();
         def.callback(this._initialDataSet.getRecordByKey(id));
         return def;
      },

      update: function (record) {
         var def = new $ws.proto.Deferred();
         def.callback(true);
         return def;
      },

      destroy: function (id) {
         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy();
         strategy.destroy(this._options.data, this._options.keyField, id);
         def.callback(true);
         return def;
      },

      query: function (filter, sorting, offset, limit) {

         var def = new $ws.proto.Deferred(),
            strategy = this.getStrategy(),
         /*TODO непонятно пока, кажется что метода query в стратегии быть не должно*/
            data = strategy.query(this._options.data, filter, sorting, offset, limit);

         var DS = new DataSet({
            strategy:strategy,
            data: data,
            keyField: this._options.keyField
         });
         def.callback(DS);
         return def;
      }

   });
});