define('js!SBIS3.CONTROLS.DragCurrentElement', [], function() {
   'use strict';
   /**
    * Синглтон который обеспечивает работу с элементом который сейчас перетаскивают
    *
    * @class SBIS3.CONTROLS.DragTarget
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DragTarget = $ws.proto.Abstract.extend({

      $protected: {
         _owner: undefined,
         _currentElement:undefined,
         _avatar: undefined,
         _dragging: undefined
      },
      /**
       * Возвращает перетаскиваемый элемент
       * @returns {Object}
       */
      get: function() {
         return this._currentElement;
      },
      /**
       * Устанавливает текущий элемент
       * @param {Object} element - элемент который перетаскивают
       * @param {SBIS3.CONTROLS.Control} owner - контрол который устанавливает текущий элемент
       */
      set: function(element, owner) {
         this._currentElement = element;
         this._owner = owner;
      },
      /**
       * Возвращает контрол которому принадлежит элемент
       * @returns {SBIS3.CONTROLS.Control}
       */
      getOwner: function() {
         return this._owner;
      },
      /**
       * Очищает текущий элемент
       */
      reset: function () {
         this._currentElement = undefined;
         this._owner = undefined;
         this.setAvatar(null);
      },
      /**
       * Возвращает аватар, иконка которая отображается около курсора
       * @see setAvatar
       * @see removeAvatar
       * @returns {JQuery}
       */
      getAvatar: function() {
         return this._avatar;
      },
      /**
       * Устанавливает аватар
       * @param {JQuery} avatar
       * @see getAvatar
       * @see removeAvatar
       */
      setAvatar: function(avatar) {
         this.removeAvatar();
         if (avatar) {
            avatar.appendTo($('body'));
            avatar.css({
               'z-index': $ws.single.WindowManager.acquireZIndex(false),
               position: 'absolute'
            });
         }

         this._avatar = avatar;
      },
      /**
       * удаляет аватар
       */
      removeAvatar: function() {
         if (this._avatar) {
            this._avatar.remove();
         }
      },
      /**
       * Вернет true если сейчас тащат элемент
       * @returns {Boolean}
       */
      isDragging: function() {
         return this._dragging;
      },
      /**
       * @protected
       * Устанавливает признак перемещения вызывается только из SBIS3.CONTROLS.DragNDropMixin
       * @param {Boolean} dragging
       */
      setDragging: function(dragging) {
         this._dragging = !!dragging;
      }
   });

   return new DragTarget();
});