/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.RelativeMoveMixin',[
   'js!WS.Data/Di'
   ],
   function (DI) {
      'use strict';
      /**
       * Действие перемещения
       * @mixin SBIS3.CONTROLS.Action.List.RelativeMoveMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      return /** @lends SBIS3.CONTROLS.Action.List.RelativeMoveMixin.prototype */{
         $protected: {
            options: {
               /**
                * @cfg {Object} содержит названия методов для перемещения
                * <pre>
                *    binding: {
                *       moveUp: 'ВставитьДо',
                *       moveDown: 'ВставитьПосле'
                *    }
                * </pre>
                */
               binding: {
                  moveUp: 'ВставитьДо',
                  moveDown: 'ВставитьПосле'
               },
               /**
                * @cfg {String} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
                * @example
                * <pre>
                *    <option name="endpoint">ПорядковыйНомер</option>
                * </pre>
               */
               endpoint: 'ПорядковыйНомер',
               /**
                * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки. По умолчанию 'ПорНомер'.
                */
               moveProperty: 'ПорНомер',
               /**
                * @cfg  {String} название поля иерархии
                * */
               parentProperty: undefined
            }
         },
         /**
          *
          * перемещает элемент from к элементу to
          * @param {WS.Data/Entity/Model} from
          * @param {WS.Data/Entity/Model} to
          * @param {Boolean} down  Направление перемещения, если true то елемент from встанет ниже эелемента to
          * @returns {$ws.proto.Deferred}
          */
         _move: function (from, to, down) {
            var  moveMethod = $ws.helpers.instanceOfModule(this.getDataSource(), 'WS.Data/Source/SbisService') ?
                  '_sbisOrderMove' : '_baseOrderMove',
               self = this;
            if ($ws.helpers.type(from) !== 'array') {
               from = [from];
            }
            //todo нужно перенести в источники реализацию перемещени
            return this[moveMethod].call(this, from, to, down).addCallback(function() {
               self.getLinkedObject().moveInItems(from, to, !down);
            });
         },

         /**
          *
          * реализация перемещения для SbisService
          * TODO должна быть убрана в SbisService
          */
         _sbisOrderMove: function (from, to, down) {
            var self = this,
               def = new $ws.proto.ParallelDeferred(),
               method = down ? this._options.binding.moveDown : this._options.binding.moveUp,
               params = {},
               parent = this._options.parentProperty ? to.get(this._options.parentProperty) : undefined;

            if (!this._orderProvider) {
               this._orderProvider = DI.resolve(
                  'source.provider.sbis-business-logic', {
                     endpoint: this._options.endpoint
                  }
               );
            }

            $ws.helpers.forEach(from, function(record) {
               params['ИдО'] = self._prepareComplexId(record.getId());
               def.push(self._orderProvider.call(method, params, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function () {
                     if (self._options.parentProperty) {
                        record.set(self._options.parentProperty, parent);
                     }
                  }, function (error) {
                     $ws.single.ioc.resolve('ILogger').log('WS.Data/MoveStrategy/Sbis::move()', error);
                     return error;
                  })
               );
            });
            return def.done().getResult();
         },

         /**
          *  реализация перемещения для Sourcee.Memory
          */
         _baseOrderMove: function (from, to, down) {
            var def = new $ws.proto.ParallelDeferred(),
               self = this;

            $ws.helpers.forEach(from, function(record) {
               def.push(self.getDataSource().call('move', {from: record, to: to, details: {after: down}}));
            });
            return def.done().getResult();
         }

      };
   }
);