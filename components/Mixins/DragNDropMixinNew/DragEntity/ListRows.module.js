/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.ListRows', [
   'js!WS.Data/Di',
   'js!WS.Data/Collection/List'
], function (Di, List) {
   'use strict';
   /**
    * Список строк, обладающий информацией о том как обработать перемещаемые записи.
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
      /**
       * @cfg {SBIS3.CONTROLS.Action.Action} Экшен который обработает перемещение
       */
      _$action: undefined,
      /**
       * @cfg {Operation} operation Показывает как отобразить перемещение записей.
       */
      _$operation:  'move',

      getOperation: function() {
         return this._$operation;
      },
      setOperation: function(operation) {
         this._$operation = operation;
      },
      getAction: function() {
         return this._$action;
      },
      setAction: function(action) {
         this._$action = action;
      }
   });
   Di.register('dragentity.listrows', ListRows);
   return ListRows;
});