/*global define, $ws, $*/
define('SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity', [
   "Core/Abstract"
], function( cAbstract) {
   'use strict';
   /**
    * Базовый класс сущности Drag'n'drop, он не предназначен для создания самостоятельных экземпляров.
    * Объекты классов DragEntity соответствуют перемещаемым элементам, их создает контрол элементы которго перемещают.
    * Любой контрол, над которым перемещаются элементы, может быстро проверить - сможет ли он принять объекты этого класса.
    * И соответствующим образом отреагировать. Например, подсветить элемент интерфейса зеленым цветом или сменить аватар(иконку около курсора мыши).
    * @class SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity
    * @public
    * @author Крайнов Д.О.
    * @see SBIS3.CONTROLS/Mixins/DragNDropMixin#dragEntity
    * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject
    * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject#getSource
    * @see SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragObject#getTarget
    */
   var Entity = cAbstract.extend(/**@lends SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Entity.prototype*/ {
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS/Control} owner Контрол, которому принадлежит сущность.
             */
            owner: null
         }
      },
      /**
       * Возвращает экземпляр класса контрола, которому принадлежит сущность.
       * return {SBIS3.CONTROLS/Control}
       */
      getOwner: function(){
         return this._options.owner;
      }

   });


   return Entity;
});