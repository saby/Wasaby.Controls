/* global define, $ws  */
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Base', [
   'js!SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (IMoveStrategy, Utils) {
   'use strict';
   /**
    * Базовый класс для стратегий перемещения
    * @class SBIS3.CONTROLS.Data.MoveStrategy.Base
    * @implements SBIS3.CONTROLS.Data.MoveStrategy.IMoveStrategy
    * @public
    * @author Ганшин Ярослав
    */

   return $ws.proto.Abstract.extend([IMoveStrategy],/** @lends SBIS3.CONTROLS.Data.MoveStrategy.Base.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.MoveStrategy.Base',
      $protected: {
         _options:{
            /**
             * @cfg {String} Имя поля, по которому строится иерархия.
             * @see hierarhyMove
             */
            hierField: undefined,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.SbisService} Источник данных.
             */
            dataSource: null

         },

         _orderProvider: undefined
      },

      move: function (from, to, after) {
         var def = new $ws.proto.ParallelDeferred(),
            self = this;
         $ws.helpers.forEach(from, function(record){
            def.push(self._options.dataSource.move(record,  to, !after));
         });
         return def.done().getResult();
      },

      hierarhyMove: function (from, to) {
         if (!this._options.dataSource) {
            throw new Error('DataSource is not defined.');
         }
         if (!this._options.hierField) {
            throw new Error('Hierrarhy Field is not defined.');
         }
         var def = new $ws.proto.ParallelDeferred(),
            newParent = to ? to.getId() : null,
            self = this,
            record;

         for (var i = 0, len = from.length; i < len; i++) {
            record = from[i];
            record.set(self._options.hierField, newParent);
            def.push(self._options.dataSource.update(record));
         }

         if (record.getOwner()) {
            record.getOwner()._reindexTree(self._options.hierField);
         }

         return def.done().getResult();

      }
   });
});
