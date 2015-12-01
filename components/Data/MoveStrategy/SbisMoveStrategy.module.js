/* global define */
define('js!SBIS3.CONTROLS.Data.SbisMoveStrategy', [
   'js!SBIS3.CONTROLS.Data.IMoveStrategy',
   'js!SBIS3.CONTROLS.Data.Source.SbisService/resources/SbisServiceBLO'
], function (IMoveStrategy, SbisServiceBLO) {
   'use strict';
   /**
    * Стандартная стратегия перемещения записей
    * @class SBIS3.CONTROLS.Data.SbisMoveStrategy
    * @implements SBIS3.CONTROLS.Data.IMoveStrategy
    * @public
    * @author Ганшин Ярослав
    */

   return $ws.proto.Abstract.extend([IMoveStrategy],/** @lends SBIS3.CONTROLS.Data.MoveStrategy.prototype */{
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
             * @cfg {String} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
             * @example
             * <pre>
             *    <option name="moveResource">ПорядковыйНомер</option>
             * </pre>
             * @see move
             */
            moveResource: 'ПорядковыйНомер',

            /**
             * @cfg {String} Префикс имени метода, который используется для перемещения записи. По умолчанию 'Вставить'.
             * @see move
             */
            moveMethodPrefix: 'Вставить',
            /**
             * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки. По умолчанию 'ПорНомер'.
             * @see move
             */
            moveDefaultColumn: 'ПорНомер',
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
         if(!cfg.resource && !cfg.dataSource){
            throw new Error('The Resource and the Data Source are not defined.');
         }
         if (!cfg.resource) {
            this._options.resource = cfg.dataSource.getResource();
         }
      },

      move: function (from, to, after) {
         var self = this,
            params = this._getMoveParams(from, to, after),
            suffix = after ? 'До':'После';
         if (!this._orderProvider) {
            this._orderProvider = new SbisServiceBLO(this._options.moveResource);
         }

         return self._orderProvider.callMethod(this._options.moveMethodPrefix + suffix, params, $ws.proto.BLObject.RETURN_TYPE_ASIS).addErrback(function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.SbisMoveStrategy::move()', error);
            return error;
         });
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

      /**
       * Возвращает параметры перемещения записей
       * @param {SBIS3.CONTROLS.Data.Model} from Перемещаемая запись
       * @param {String} to Значение поля, в позицию которого перемещаем (по умолчанию - значение первичного ключа)
       * @param {Boolean} after Дополнительная информация о перемещении
       * @returns {Object}
       * @private
       */
      _getMoveParams: function(from, to, after) {
         var objectName = this._options.resource,
            params = {
               'ИдО': [parseInt(this._getId(from)), objectName],
               'ПорядковыйНомер': this._options.moveDefaultColumn,
               'Иерархия': null,
               'Объект': this._options.resource
            };

         if (after) {
            params['ИдОДо'] = [parseInt(this._getId(to), 10), objectName];
         } else {
            params['ИдОПосле'] = [parseInt(this._getId(to), 10), objectName];
         }
         return params;
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
