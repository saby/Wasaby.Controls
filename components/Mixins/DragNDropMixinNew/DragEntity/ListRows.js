/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.ListRows', [
   'js!WS.Data/Collection/List'
], function (List) {
   'use strict';
   /**
    * @class SBIS3.CONTROLS.DragEntity.ListRows
    */
   var ListRows = List.extend(/**@lends SBIS3.CONTROLS.DragEntity.ListRows.prototype*/{
      _moduleName: 'SBIS3.CONTROLS.DragEntity.ListRows',
      /**
       * @typedef {String} Operation
       * @variant move Перемещает запись: в новый список добавляет из старого удаляет.
       * @variant add Добавляет запись в новый список.
       * @variant delete Удаляет запись из старого списка.
       * @variant undefined ничего не делать
       */
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Action.Action} Экшен который обработает перемещение
             */
            action: undefined,
            /**
             * @cfg {Operation} operation Показывает как отобразить перемещение записей.
             */
            operation:  'move'
         }
      },
      getOperation: function() {
         return this._options.operation;
      },
      setOperation: function(operation) {
         this._options.operation = operation;
      },
      getAction: function() {
         return this._options.action;
      },
      setAction: function(action) {
         this._options.action = action;
      }
   });
   Di.register('dragentity.listrows', ListRows);
   return ListRows;
});