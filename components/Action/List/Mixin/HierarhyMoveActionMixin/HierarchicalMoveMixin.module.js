/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.HierarchicalMoveMixin',[
      'js!WS.Data/Collection/RecordSet'
   ],
   function (RecordSet) {
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
          * @param {WS.Data/Entity/Model} from
          * @param {WS.Data/Entity/Model} to
          * @returns {$ws.proto.Deferred}
          */
         hierarhyMove: function (from, to) {
            var def = new $ws.proto.ParallelDeferred(),
               self = this,
               updateItems;

            this._setParent(from, to);

            if ($ws.helpers.type(from) === 'array') {
               if (from.length > 1) {
                  updateItems = new RecordSet({
                     adapter: from[0].getAdapter()
                  });
                  updateItems.append(from);
               } else {
                  updateItems = from[0];
               }
            } else {
               updateItems = from;
            }

            return self._options.dataSource.update(updateItems);
         },

         _setParent: function(from, to) {
            var newParent = to ? to.getId() : null,
               records = $ws.helpers.type(from) !== 'array' ? [from] : from;

            for (var i = 0, len = records.length; i < len; i++) {
               var record = records[i];
               record.set(this._options.hierField, newParent);
               if (record.getOwner()) {
                  record.getOwner()._reindexTree(this._options.hierField);
               }
            }
         }
      };
   }
);