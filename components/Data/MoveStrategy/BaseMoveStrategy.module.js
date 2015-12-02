/* global define */
define('js!SBIS3.CONTROLS.Data.BaseMoveStrategy', [
   'js!SBIS3.CONTROLS.Data.IMoveStrategy'
], function (IMoveStrategy) {
   'use strict';
   /**
    * Базовый класс для стратегий перемещения
    * @class SBIS3.CONTROLS.Data.BaseMoveStrategy
    * @implements SBIS3.CONTROLS.Data.IMoveStrategy
    * @public
    * @author Ганшин Ярослав
    */

   return $ws.proto.Abstract.extend([IMoveStrategy],/** @lends SBIS3.CONTROLS.Data.BaseMoveStrategy.prototype */{
      $protected: {
         _options:{
            /**
             * @cfg {String} Имя объекта бизнес-логики, у которго происходит перемещение записей.
             * @example
             * <pre>
             *    <option name="moveResource">СвязьПапок</option>
             * </pre>
             * @see move
             */
            resource: undefined,
            /**
             * @cfg {String} Имя поля, по которому строится иерархия.
             * @see hierarhyMove
             */
            hierField: undefined,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Source.SbisService} Источник данных.
             */
            dataSource:null

         },
         _orderProvider: undefined
      },
      $constructor: function (cfg){

      },

      move: function (from, to, after) {

         return this._options.dataSource.call('move', {from: from, to: to, details: {after: after}});
      },

      hierarhyMove: function (from, to) {
         if (!this._options.dataSource) {
            throw new Error('DataSource is not defined.');
         }
         if (!this._options.hierField) {
            throw new Error('Hierrarhy Field is not defined.');
         }
         from.set(this._options.hierField, this._getId(to));
         return this._options.dataSource.update(from);
      },


      //TODO убрать метод когда не станет SBIS3.CONTROLS.Record
      _getId: function(model){
         if ($ws.helpers.instanceOfModule(model, 'SBIS3.CONTROLS.Data.Model')) {
            return model.getId();
         } else if($ws.helpers.instanceOfModule(model, 'SBIS3.CONTROLS.Record')){
            return model.getKey()
         }
      }

   });
});
