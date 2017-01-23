/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Entity', [
   "Core/Abstract"
], function( cAbstract) {
   'use strict';
   /**
    * Базовый класс сущности Drag'n'drop, он не предназначен для создания самостоятельных экземпляров.
    * Объекты классов DragEntity соответствуют перемещаемым элементам, их создает контрол элементы которго перемещают.
    * Любой контрол, над которым перемещаются элементы, может быстро проверить - сможет ли он принять объекты этого класса.
    * И соответствующим образом отреагировать. Например, подсветить элемент интерфейса зеленым цветом или сменить аватар(иконку около курсора мыши).
    * @class SBIS3.CONTROLS.DragEntity.Entity
    * @public
    * @author Крайнов Дмитрий Олегович
    * @see SBIS3.CONTROLS.DragNDropMixin#dragEntity
    * @see SBIS3.CONTROLS.DragObject
    * @see SBIS3.CONTROLS.DragObject#getSource
    * @see SBIS3.CONTROLS.DragObject#getTarget
    */
   var Entity = cAbstract.extend(/**@lends SBIS3.CONTROLS.DragEntity.Entity.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Control} owner Контрол, которому принадлежит сущность.
             */
            owner: null
         }
      },
      /**
       * Возвращает экземпляр класса контрола, которому принадлежит сущность.
       * return {SBIS3.CONTROLS.Control}
       */
      getOwner: function(){
         return this._options.owner;
      }

   });


   return Entity;
});