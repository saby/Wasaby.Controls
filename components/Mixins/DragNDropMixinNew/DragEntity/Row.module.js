/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragEntity.Row', [
   'js!SBIS3.CONTROLS.DragEntity.Entity',
   'js!WS.Data/Di'
], function (Entity, Di) {
   'use strict';
   /**
    * Объект перемещения списочного контрола
    *
    * @class SBIS3.CONTROLS.DragEntity.Entity
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var Row = Entity.extend(/**@lends SBIS3.CONTROLS.DragEntity.Row*/{
      _moduleName: 'SBIS3.CONTROLS.DragEntity.Row',
      $protected: {
         _options: {
            model: undefined,
            position: undefined,
            domElement: undefined
         }
      },
      getModel: function () {
         return this._options.model;
      },

      setModel: function (model) {
         this._options.model = model;
      },

      getPosition: function () {
         return this._options.position;
      },

      setPosition: function (position) {
         this._options.position = position;
      },

      getDomElement: function () {
         return this._options.domElement;
      },

      setDomElement: function (element) {
         this._options.domElement = element;
      }
   });
   Di.register('dragentity.row', Row);
   return Row;
});