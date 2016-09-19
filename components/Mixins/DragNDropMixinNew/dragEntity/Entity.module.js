/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Entity', [], function() {
   'use strict';
   /**
    * Базовый класс сущности dragndrop, он не предназначен для создания самостоятельных экземпляров.
    * Объекты классов DragEntity соответсвуют перетаскиваемым элементам, их создает контрол элементы которго двигают.
    * Любой контрол над которым проносятся элементы может быстро проверить сможет ли он принять объекты этого класса и
    * соответсвующим образом отреагировать, например подсветится зеленым цветом или сменить аватар - иконку около курсора мыши.
    * @class SBIS3.CONTROLS.DragEntity.Entity
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @see SBIS3.CONTROLS.DragNDropMixinNew#dragEntity
    * @see SBIS3.CONTROLS.DragObject
    * @see SBIS3.CONTROLS.DragObject#getSource
    * @see SBIS3.CONTROLS.DragObject#getTarget
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
       * Возвращает инстанс контрола которому принадлежит сущность
       * return {SBIS3.CONTROLS.Control}
       */
      getOwner: function(){
         return this._options.owner;
      }

   });


   return Entity;
});