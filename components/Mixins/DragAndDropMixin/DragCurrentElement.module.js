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
   var DragTarget = $ws.proto.Abstract.extend({

      $protected: {
         _owner: undefined,
         _currentElementConfig:undefined,
         _avatar: undefined,
         _dragging: undefined
      },

      get: function() {
         return this._currentElementConfig;
      },

      set: function(config, owner) {
         this._currentElementConfig = config;
         this._owner = owner;
      },

      getOwner: function() {
         return this._owner;
      },

      reset: function () {
         this._currentElementConfig = undefined;
         this._owner = undefined;
         this.setAvatar(null);
      },

      getAvatar: function() {
         return this._avatar;
      },

      setAvatar: function(avatar) {
         this.removeAvatar();
         if (avatar) {
            avatar.appendTo($('body'));
         }
         this._avatar = avatar;
      },

      removeAvatar: function() {
         if (this._avatar) {
            this._avatar.remove();
         }
      },

      isDragging: function() {
         return this._dragging;
      },

      setDragging: function(dragging) {
         this._dragging = dragging;
      }
   });

   return new DragTarget();
});