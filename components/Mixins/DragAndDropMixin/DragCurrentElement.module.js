define('js!SBIS3.CONTROLS.DragObject', [], function() {
   'use strict';
   /**
    * Синглтон который обеспечивает работу с элементом который сейчас перетаскивают
    *
    * @class SBIS3.CONTROLS.DragTarget
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DragObject = $ws.proto.Abstract.extend({

      $protected: {
         _owner: undefined,
         _source:undefined,
         _target:undefined,
         _avatar: undefined,
         _dragging: undefined,
         _meta: undefined
      },
      /**
       * Возвращает элемент который сейчас тащат
       * @returns {*}
       */
      getSource: function() {
         return this._source;
      },
      /**
       * Возвращает элемент над которым находится курсор
       * @returns {*}
       */
      getTarget: function() {
         return this._target;
      },
      /**
       * метод должен вызываться из SBIS3.CONTROLS.DragNDropMixin
       * @param {SBIS3.CONTROLS.Control} owner контрол который с которого тащят элемент
       */
      setOwner: function(owner) {
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
            $(avatar).appendTo($('body'));
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
      //region protected
      /**
       * @protected
       * Устанавливает признак перемещения вызывается только из SBIS3.CONTROLS.DragNDropMixin
       * @param {Boolean} dragging
       */
      setDragging: function(dragging) {
         this._dragging = !!dragging;
      },
      /**
       * @protected
       * Устанавливает элемент который будут перетаскивать
       * @param source
       */
      setSource: function(source) {
         this._source = source;
      },
      /**
       * @protected
       * Устанавливает элемент над которым находится курсор
       * @param target
       */
      setTarget: function(target) {
         this._target = target;
      }
      //endregion protected
   });

   return new DragObject();
});