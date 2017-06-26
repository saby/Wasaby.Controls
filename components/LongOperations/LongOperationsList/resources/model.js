define(
   [
      'js!WS.Data/Entity/Model'/*###,
      'Core/TimeInterval'*/
   ],

   function (Model/*###, TimeInterval*/) {

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
                        return LongOperationModel.timeSpentAsString(this.get('timeSpent'), 2);
                     }
                  },

                  shortTimeSpent: {
                     get: function () {
                        return LongOperationModel.timeSpentAsString(this.get('timeSpent'), 1);
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
            return '';
         }
         details = 1 < details ? details : 1;
         var secs = Math.round(timeSpent/1000);
         var spent = [];
         for (var i = 0, periods = [86400, 3600, 60, 1], names = ['д.', 'ч.', 'мин.', 'сек.']; i < periods.length; i++) {
            var period = periods[i];
            var t = Math.floor(secs/period);
            secs = secs%period;
            if (t) {
               spent.push(t + rk(names[i], 'ДлительныеОперации'));
               if (details <= spent.length) {
                  break;
               }
            }
            /*###else
            if (spent.length) {
               // Не должно быть пропущенных элементов
               break;
            }*/
         }
         return spent.join(' ');

         /*###if (!timeSpent) {
          return '';
          }
          var secs2 = timeSpent;
          var tInt = (new TimeInterval(secs2)).toObject();
          if (500 <= tInt.milliseconds) {
          tInt.seconds++;
          }
          var spent2 = [];
          for (var i = 0, props = ['days', 'hours', 'minutes', 'seconds'], names = ['д.', 'ч.', 'мин.', 'сек.']; i < props.length; i++) {
          var t = tInt[props[i]];
          if (t) {
          spent2.push(t + rk(names[i], 'ДлительныеОперации'));
          if (1 < spent2.length) {
          break;
          }
          }
          /*###else
          if (spent2.length) {
          // Не должно быть пропущенных элементов
          break;
          }* /
          }
          return spent2.join(' ');*/
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