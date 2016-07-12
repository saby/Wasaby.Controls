/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin',[
   ],
   function () {
      'use strict';
      /**
       * Действие перемещения
       * @mixin SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      return /** @lends SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin.prototype */{
         $protected: {
            _options: {
               /**
                * @cfg  {String} название поля иерархии
                * */
               parentProperty: undefined
            }
         },
         /**
          * реализация перемещения по иерархии
          * @param {SBIS3.CONTROLS.Data.Model} from
          * @param {SBIS3.CONTROLS.Data.Model} to
          * @returns {$ws.proto.Deferred}
          */
         _move: function (from, to) {
            var def = new $ws.proto.ParallelDeferred(),
               newParent = to ? to.getId() : null,
               dataSource = this.getDataSource(),
               self = this;
            if ($ws.helpers.type(from) !== 'array') {
               from = [from];
            }
            $ws.helpers.forEach(from, function (record) {
               record.set(self._options.parentProperty, newParent);
               def.push(dataSource.update(record));
            });
            return def.done().getResult();
         }
      };
   }
);