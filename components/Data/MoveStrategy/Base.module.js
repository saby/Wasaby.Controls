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
             * @cfg {String} Имя объекта бизнес-логики, у которго происходит перемещение записей.
             * @example
             * <pre>
             *    <option name="contract">СвязьПапок</option>
             * </pre>
             * @see move
             */
            contract: undefined,

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

      $constructor: function (cfg){
         cfg = cfg || {};
         //Deprecated
         if ('resource' in cfg && !('contract' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "resource" is deprecated and will be removed in 3.7.4. Use "contract" instead.', 2);
            this._options.contract = cfg.resource;
         }
      },

      move: function (from, to, after) {
         var def = new $ws.proto.ParallelDeferred(),
            self = this;
         $ws.helpers.forEach(from, function(record){
            def.push(self._options.dataSource.call('move', {from: record, to: to, details: {after: after}}));
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
