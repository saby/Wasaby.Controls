/* global define, $ws*/
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Sbis', [
   'js!SBIS3.CONTROLS.Data.MoveStrategy.Base',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (BaseMoveStrategy, DI, Utils) {
   'use strict';
   /**
    * Стандартная стратегия перемещения записей
    * @class SBIS3.CONTROLS.Data.MoveStrategy.Sbis
    * @extends SBIS3.CONTROLS.Data.MoveStrategy.Base
    * @public
    * @author Ганшин Ярослав
    * @example
    */

   var SbisMoveStrategy = BaseMoveStrategy.extend([],/** @lends SBIS3.CONTROLS.Data.MoveStrategy.Sbis.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.MoveStrategy.Sbis',
      $protected: {
         _options:{

            /**
             * @cfg {String} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
             * @example
             * <pre>
             *    <option name="moveContract">ПорядковыйНомер</option>
             * </pre>
             * @see move
             */
            moveContract: 'ПорядковыйНомер',

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
             * @cfg {List} .
             */
            listView: undefined

         },

         _orderProvider: undefined
      },
      $constructor: function (cfg){
         cfg = cfg || {};

         //Deprecated
         if ('moveResource' in cfg && !('moveContract' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "moveResource" is deprecated and will be removed in 3.7.4. Use "moveContract" instead.', 1);
            this._options.moveContract = cfg.moveResource;
         }

         if (!this._options.contract) {
            this._options.contract = this._options.dataSource.getEndpoint().contract;
         }
      },

      move: function (from, to, after) {
         var self = this,
            suffix = after ? 'После':'До',
            def = new $ws.proto.ParallelDeferred(),
            method = this._options.moveMethodPrefix + suffix,
            params = this._getMoveParams(to, after);
         if (!this._orderProvider) {
            this._orderProvider = DI.resolve(
               'source.provider.sbis-business-logic', {
                  endpoint: {
                     contract: this._options.moveContract
                  }
               }
            );
         }
         $ws.helpers.forEach(from, function(record) {
            params['ИдО'] = self._prepareComplexId(record.getId());
            def.push(self._orderProvider.call(method, params, $ws.proto.BLObject.RETURN_TYPE_ASIS).addErrback(function (error) {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.MoveStrategy.Sbis::move()', error);
               return error;
            }));
         });
         return def.done().getResult();
      },

      hierarhyMove: function(from, to) {
         var self = this,
            oldParents = [];
         $ws.helpers.forEach(from, function (record) {
            oldParents.push(record.get(self._options.hierField));
         });
         return SbisMoveStrategy.superclass.hierarhyMove.call(this, from, to).addCallback(function(){
            if(self._options.listView) {
               var items = self._options.listView.getItems();
               if(items.getFormat().getIndexByValue('name', self._options.hierField + '$') !== -1) {
                  to = (items.getIndex(to) !== -1) ? to : items.getRecordById(to.getId());

                  if (to && to.has(self._options.hierField + '$')) {
                     to.set(self._options.hierField + '$', true);
                  }

                  $ws.helpers.forEach(oldParents, function (parentId) {
                     if (items.getChildItems(parentId).length === 0) {
                        items.getRecordById(parentId).set(self._options.hierField + '$', false);
                     }
                  });
               }
            }
         });
      },
      /**
       * Возвращает параметры перемещения записей
       * @param {String} to Значение поля, в позицию которого перемещаем (по умолчанию - значение первичного ключа)
       * @param {Boolean} after Дополнительная информация о перемещении
       * @returns {Object}
       * @private
       */
      _getMoveParams: function(to, after) {
         var params = {
               'ПорядковыйНомер': this._options.moveDefaultColumn,
               'Иерархия': null,
               'Объект': this._options.contract
            },
            id = this._prepareComplexId(to.getId());

         if (after) {
            params['ИдОПосле'] = id;
         } else {
            params['ИдОДо'] = id;

         }
         return params;
      },
      /**
       * подготавливает сложный идентификатор
       * @param id
       * @private
       */
      _prepareComplexId: function (id){
         var preparedId = String.prototype.split.call(id, ',', 2);
         if (preparedId.length < 2) {
            preparedId.push(this._options.contract);
         }
         return preparedId;
      }
   });

   return SbisMoveStrategy;
});
