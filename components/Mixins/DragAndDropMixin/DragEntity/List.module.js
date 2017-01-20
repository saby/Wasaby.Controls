/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.List', [
   'js!WS.Data/Di',
   'js!WS.Data/Collection/List'
], function (Di, CollectionList) {
   'use strict';
   /**
    * Список строк, обладающий информацией о том как обработать перемещаемые записи.
    * @class SBIS3.CONTROLS.DragEntity.List
    */
   var List = CollectionList.extend(/**@lends SBIS3.CONTROLS.DragEntity.List.prototype*/{
      _moduleName: 'SBIS3.CONTROLS.DragEntity.List',
      /**
       * @typedef {String} Operation
       * @variant move Перемещает запись: в новый список добавляет из старого удаляет.
       * @variant add Добавляет запись в новый список.
       * @variant delete Удаляет запись из старого списка.
       * @variant undefined ничего не делать
       */
      /**
       * @cfg {function} Метод который будет вызван вместо стандарного, для перемещения записей в источниках данных
       * @see getAction
       * @see setAction
       */
      _$action: undefined,
      /**
       * @cfg {Operation} operation Показывает как обработать перемещение записей.
       * @see getOperation
       * @see setOperation
       */
      _$operation:  'move',
      /**
       *
       * @returns {string}
       */
      getOperation: function() {
         return this._$operation;
      },
      /**
       *
       * @param operation
       */
      setOperation: function(operation) {
         this._$operation = operation;
      },
      /**
       *
       * @returns {*}
       */
      getAction: function() {
         return this._$action;
      },
      /**
       *
       * @param action
       */
      setAction: function(action) {
         this._$action = action;
      }
   });
   Di.register('dragentity.list', List);
   return List;
});