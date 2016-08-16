/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Entity', [], function() {
   'use strict';
   /**
    * Базовый класс перемещаемой сущности
    * @class SBIS3.CONTROLS.DragEntity.Entity
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var Entity = $ws.proto.Abstract.extend(/**@lends SBIS3.CONTROLS.DragEntity.Entity.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Control} owner - контрол которому принадлежит сущность
             */
            owner: null
         }
      },
      /**
       * Возвращает контрол которому принадлежит сущность
       * return {SBIS3.CONTROLS.Control}
       */
      getOwner: function(){
         return this._options.owner;
      }

   });


   return Entity;
});