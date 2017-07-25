define(
   [
      'js!WS.Data/Entity/Model'
   ],

   function (Model) {

      var LongOperationModel = Model.extend({
         $protected: {
            _options: {
               properties: {
                  fullId: {
                     get: function () {
                        return LongOperationModel.getFullId(this.get('tabKey'), this.get('producer'), this.get('id'));
                     }
                  },

                  strTimeSpent: {
                     get: function () {
                        return LongOperationModel.timeSpentAsString(this.get('timeSpent') || (new Date()).getTime() - this.get('startedAt'), 2);
                     }
                  },

                  shortTimeSpent: {
                     get: function () {
                        return LongOperationModel.timeSpentAsString(this.get('timeSpent') || (new Date()).getTime() - this.get('startedAt'), 1);
                     }
                  },

                  userFullName: {
                     get: function () {
                        var parts = [];
                        for (var i = 0, props = ['userLastName', 'userFirstName', 'userPatronymicName']; i < props.length; i++) {
                           var part = this.get(props[i]);
                           if (!part) {
                              break;
                           }
                           parts.push(i === 0 ? part : part.charAt(0) + '.');
                        }
                        return parts.length ? parts.join(' ') : rk('Пользователь удален');
                     }
                  }
               }
            }
         }
      });

      /**
       * Возвращает промежуток времени с указаной подробностью
       * @param {number} details Детальность - количество элементов в строке
       * @return {string}
       */
      LongOperationModel.timeSpentAsString = function (timeSpent, details) {
         if (!timeSpent) {
            return '0 сек.';
         }
         details = 1 < details ? details : 1;
         var secs = Math.round(timeSpent/1000);
         var spent = [];
         for (var i = 0, periods = [86400, 3600, 60, 1], names = ['д.', 'ч.', 'мин.', 'сек.']; i < periods.length; i++) {
            var period = periods[i];
            var t = Math.floor(secs/period);
            secs = secs%period;
            if (t) {
               spent.push(t + ' ' + rk(names[i], 'ДлительныеОперации'));
               if (details <= spent.length) {
                  break;
               }
            }
            /*else
            if (spent.length) {
               // Не должно быть пропущенных элементов
               break;
            }*/
         }
         return spent.join(' ');
      };

      /**
       * Составить полный идентификатор
       * @param {string} tabKey Ключ вкладки
       * @param {string} producer Имя продюсера
       * @param {string|number} id Идентификатор операции
       */
      LongOperationModel.getFullId = function (tabKey, producer, id) {
         return (tabKey || '') + ':' + producer + ':' + id;
      }

      return LongOperationModel;
   }
);