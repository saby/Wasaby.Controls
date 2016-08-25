/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragObject', [
   'js!SBIS3.CONTROLS.DragEntity.Entity'
], function () {
   'use strict';
   /**
    * Синглтон который обеспечивает работу с элементом который сейчас перетаскивают
    *
    * @class SBIS3.CONTROLS.DragTarget
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DRAG_AVATAR_OFFSET = 5;
   var DragObject = $ws.proto.Abstract.extend(/**@lends SBIS3.CONTROLS.DragObject.prototype*/{
      $protected: {
         _owner: undefined,
         _source: undefined,
         _target: undefined,
         _avatar: undefined,
         _dragging: undefined,
         _meta: undefined,
         _jsEvent: undefined,
         _targetsControl: undefined
      },
      /**
       * Возвращает элемент который сейчас тащат
       * @returns {*}
       */
      getSource: function () {
         return this._source;
      },
      /**
       * Возвращает элемент над которым находится курсор
       * @returns {*}
       */
      getTarget: function () {
         return this._target;
      },
      /**
       * метод должен вызываться из SBIS3.CONTROLS.DragNDropMixin
       * @param {SBIS3.CONTROLS.Control} owner контрол который с которого тащят элемент
       */
      setOwner: function (owner) {
         this._owner = owner;
      },
      /**
       * Возвращает контрол которому принадлежит элемент
       * @returns {SBIS3.CONTROLS.Control}
       */
      getOwner: function () {
         return this._owner;
      },
      /**
       * Очищает текущий элемент
       */
      reset: function () {
         this._source = undefined;
         this._target = undefined;
         this._owner = undefined;
         this._meta = undefined;
         this._jsEvent = undefined;
         this.setAvatar(null);
      },
      /**
       * Возвращает аватар, иконка которая отображается около курсора
       * @see setAvatar
       * @see removeAvatar
       * @returns {JQuery}
       */
      getAvatar: function () {
         return this._avatar;
      },
      /**
       * Возвращает метаданные объекта
       */
      getMeta: function () {
         return this._meta;
      },
      /**
       * Устанавливает метаданные объекта
       */
      setMeta: function (meta) {
         this._meta = meta;
      },
      /**
       * Устанавливает аватар
       * @param {String} avatar строка содержащая верстку аватара
       * @see getAvatar
       * @see removeAvatar
       */
      setAvatar: function (avatar) {
         this.removeAvatar();
         if (avatar) {
            this._avatar = $(avatar);
            this._setAvatarPosition(this._jsEvent);
            this._avatar.css({
               'z-index': $ws.single.WindowManager.acquireZIndex(false),
               position: 'absolute'
            }).appendTo($('body'));
         }
      },
      /**
       * удаляет аватар
       */
      removeAvatar: function () {
         if (this._avatar) {
            this._avatar.remove();
            this._avatar = null;
         }
      },
      /**
       * Вернет true если сейчас тащат элемент
       * @returns {Boolean}
       */
      isDragging: function () {
         return this._dragging;
      },

      /**
       * Возвращает контрол над которым сейчас находится курсор
       * @returns {SBIS3.CONTROLS.Control}
       */
      getTargetsControl: function () {
         return this._targetsControl;
      },
      //region protected
      /**
       * @protected
       * Устанавливает признак перемещения вызывается только из SBIS3.CONTROLS.DragNDropMixin
       * @param {Boolean} dragging
       */
      setDragging: function (dragging) {
         this._dragging = !!dragging;
      },
      /**
       * @protected
       * Устанавливает элемент который будут перетаскивать
       * @param source
       */
      setSource: function (source) {
         this._source = source;
      },
      /**
       * @protected
       * Устанавливает элемент над которым находится курсор
       * @param target
       */
      setTarget: function (target) {
         this._target = target;
      },

      /**
       * устанавливает позицию аватара
       * @param  {Event} e
       */
      _setAvatarPosition: function (e) {
         //смещение нужно чтобы событие onmouseup сработало над контролом, а не над аватаром
         if (this.getAvatar()) {
            this.getAvatar().css({
               'left': e.pageX + DRAG_AVATAR_OFFSET,
               'top': e.pageY + DRAG_AVATAR_OFFSET
            });
         }
      },

      onDragHandler: function (e) {
         if (this._jsEvent !== e) {
            this._jsEvent = e;
            this._targetsControl = $(e.target).wsControl();
            this._setAvatarPosition(e);
         }
      }
      //endregion protected
   });

   return new DragObject();
});