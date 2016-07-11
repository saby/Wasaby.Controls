/**
 * Created by am.gerasimov on 30.03.2015.
 */
define('js!SBIS3.CONTROLS.CommonHandlers',['i18n!SBIS3.CONTROLS.CommonHandlers'],
   function() {
      /**
       * Миксин, добавляющий функционал манипуляций с записями.
       * @mixin SBIS3.CONTROLS.CommonHandlers
       * @public
       * @author Герасимов Александр Максимович
       */
      var CommonHandlers = /** @lends SBIS3.CONTROLS.CommonHandlers.prototype */{
         /**
          * Удаляет записи из источника данных по переданным идентификаторам элементов коллекции.
          * @remark
          * При использовании метода для в классе {@link SBIS3.CONTROLS.TreeCompositeView} или его наследниках, есть особенность перезагрузки данных.
          * Для режима отображения "Таблица" (table), который устанавливают с помощью опции {@link SBIS3.CONTROLS.CompositeViewMixin#viewMode}, производится частичная перезагрузка данных в узлах иерархии.
          * Это означает, что данные списка будут обновлены быстрее: запрос на обновление будет произведён только для тех узлов, элементы которого удаляются методом.
          * Для списков любых других классов будет произведена полная перезагрузка списка записей, например как при методе {@link SBIS3.CONTROLS.ListView#reload}.
          * @param {Array|Number|String} idArray Массив с идентификаторами элементов коллекции.
          * Если нужно удалить одну запись, то в параметр передаётся простое значение - идентификатор элемента.
          * @param {String} [message] Текст, который будет использован в диалоговом окне перед началом удаления записей из источника.
          * Если параметр не передан, то для удаления нескольких записей будет использован текст "Удалить записи?", а для удаления одной записи - "Удалить текущую запись?".
          * @returns {$ws.proto.Deferred} Возвращает объект deferred. На результат работы метода можно подписаться для решения прикладных задача.
          */
         deleteRecords: function(idArray, message) {
            var self = this;
            idArray = Array.isArray(idArray) ? idArray : [idArray];
            message = message || (idArray.length !== 1 ? rk("Удалить записи?") : rk("Удалить текущую запись?"));
            return $ws.helpers.question(message).addCallback(function(res) {
               if (res) {
                  self._toggleIndicator(true);
                  return self._dataSource.destroy(idArray).addCallback(function () {
                     self.removeItemsSelection(idArray);
                     if ($ws.helpers.instanceOfModule(self, 'SBIS3.CONTROLS.TreeCompositeView') && self.getViewMode() === 'table') {
                        self.partialyReload(idArray);
                     } else {
                        self.reload();
                     }
                  }).addErrback(function(result) {
                     $ws.helpers.alert(result)
                  }).addBoth(function() {
                     self._toggleIndicator(false);
                  });
               }
            });
         },
         editItems: function(tr, id) {
            this.sendCommand('activateItem', id);
         }
      };

      return CommonHandlers;
   });
