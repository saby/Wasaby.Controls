/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.RelativeMoveMixin',[
   ],
   function () {
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
                * @cfg  {String} название поля иерархии
                * */
               parentProperty: undefined
            }
         },
         /**
          *
          * перемещает элемент from к элементу to
          * @param {SBIS3.CONTROLS.Data.Model|Array} from
          * @param {SBIS3.CONTROLS.Data.Model} to
          * @param {Boolean} up Направление перемещения, если true то елемент from встанет выше эелемента to
          * @returns {$ws.proto.Deferred}
          */
         _move: function (from, to, up) {
            var self = this,
               def = new $ws.proto.ParallelDeferred();
            if ($ws.helpers.type(from) !== 'array') {
               from = [from];
            }
            $ws.helpers.forEach(from, function(record) {
               def.push(self.getDataSource().move(record.getId(), to.getId(), {before: up}));
            });
            return  def.done().getResult().addCallback(function() {
               self.moveInItems(from, to, up);
            });
         },

         moveInItems: function (from, to, up) {
            if ($ws.helpers.instanceOfModule(this.getLinkedObject(), 'js!SBIS3.CONTROLS.ListView')) {
               this.getLinkedObject().moveInItems(from, to, up);
            }
         }

      };
   }
);