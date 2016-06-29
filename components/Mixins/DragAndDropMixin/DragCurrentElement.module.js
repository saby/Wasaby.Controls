define('js!SBIS3.CONTROLS.DragCurrentElement', [], function() {
   'use strict';
   /**
    * Синглтон в котором хранится элемент который сейчас перетаскивают
    *
    * @class SBIS3.CONTROLS.DragTarget
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DragTarget = {

      get: function() {
         return this._currentElementConfig;
      },

      set: function(config, owner) {
         this._currentElementConfig = config;
         this._owner = owner;
      },

      getOwner: function() {
         return this._owner;
      }
   };

   return DragTarget;
});