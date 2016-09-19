/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragObject', [
], function () {
   'use strict';
   /**
    * Синглтон объект, в котором содержится информация о текущем состоянии Drag'n'drop:
    * <ul>
    *    <li>Элементы, которые перетаскивают</li>
    *    <li>Элемент, над которым сейчас находится курсор мыши</li>
    *    <li>Контрол, с которого тащат элементы</li>
    *    <li>Контрол, над которым сейчас находится курсор мыши</li>
    *    <li>Аватар - иконка которая отображается около курсора мыши</li>
    * </ul>
    * DragObject передается во все события DragNDropMixin. Также его можно получить в любом месте через RequireJS.
    * @class SBIS3.CONTROLS.DragTarget
    * @singleton
    * @public
    * @author Крайнов Дмитрий Олегович
    * @see SBIS3.CONTROLS.DragNDropMixinNew
    * @example
    * Получим DragObject через require
    * <pre>
    *    var dragObject = require('js!SBIS3.CONTROLS.DragObject');
    * </pre>
    */
   var DRAG_AVATAR_OFFSET = 5;
   var DragObject = $ws.proto.Abstract.extend(/**@lends SBIS3.CONTROLS.DragObject.prototype*/{
      $protected: {
         /**
          * @member {SBIS3.CONTROLS.Control} Контрол, который начал dragndrop.
          */
         _owner: undefined,
         /**
          * @member {WS.Data/Collection/IList} Набор элементов, которые сейчас перетаскивают.
          */
         _source: undefined,
         /**
          * @member {SBIS3.CONTROLS.DragEntity.Entity} Элемент, над которым находится курсор мыши.
          */
         _target: undefined,
         /**
          * @member {jQuery} Аватар - иконка которая отображается около курсора мыши.
          */
         _avatar: undefined,
         /**
          * @member {Boolean} Признак - перетаскивают ли ейчас элемент.
          */
         _dragging: undefined,
         /**
          * @member {Object} Дополнительная информация.
          */
         _meta: undefined,
         /**
         * @member {Event} Актульное, текущему моменту перетаскивания, событие брауера (onMouseMove, onMouseDown ...)
         */
         _jsEvent: undefined,
         /**
          * @member {SBIS3.CONTROLS.Control} Контрол, над которым находится курсор мыши.
          */
         _targetsControl: undefined
      },
      /**
       * Возвращает набор перетаскиваемых элементов. Элементы должны быть наследниками класса SBIS3.CONTROLS.DragEntity.Entity.
       * Их устанавливает контрол, который инициализирует Drag'n'drop.
       * @returns {WS.Data/Collection/IList|undefined}
       */
      getSource: function () {
         return this._source;
      },
      /**
       * Устанавливает набор перетаскиваемых элементов. Метод вызывается из контрола, который инициализирует Drag'n'drop.
       * @param {WS.Data/Collection/IList} source
       */
      setSource: function (source) {
         this._source = source;
      },
      /**
       * Возвращает элемент, над которым находится курсор. Элемент должен быть наследником класса SBIS3.CONTROLS.DragEntity.Entity. Его устанавливает контрол, находящийся сейчас под курсором.
       * @returns {SBIS3.CONTROLS.DragEntity.Entity|undefined}
       */
      getTarget: function () {
         return this._target;
      },
      /**
       * Устанавливает элемент над которым находится курсор. Метод вызывается из контрола над которым сейчас находится курсор мыши
       * @param {SBIS3.CONTROLS.DragEntity.Entity|undefined} target
       */
      setTarget: function (target) {
         this._target = target;
      },

      /**
       * Возвращает контрол, который инициализировал Drag'n'drop.
       * @returns {SBIS3.CONTROLS.Control}
       */
      getOwner: function () {
         return this._owner;
      },
      /**
       * Очищает DragObject
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
       * @remark Дополнительные данные рекомендуется складывать в объекты target или source, создавая свои уникальные реализации сущностей Drag'n'drop, унаследованные от SBIS3.CONTROLS.DragEntity.Entity.
       * returns {Object}
       */
      getMeta: function () {
         return this._meta;
      },
      /**
       * Устанавливает метаданные объекта
       * @remark Дополнительные данные рекомендуется складывать в объекты target или source, создавая свои уникальные реализации сущностей Drag'n'drop, унаследованные от SBIS3.CONTROLS.DragEntity.Entity.
       * returns {Object}
       */
      setMeta: function (meta) {
         this._meta = meta;
      },
      /**
       * Устанавливает аватар, иконка которого отображается около курсора мыши.
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
       * Удаляет аватар, иконка которого отображается около курсора мыши.
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
       * Возвращает контрол над которым сейчас находится курсор мыши
       * @returns {SBIS3.CONTROLS.Control}
       */
      getTargetsControl: function () {
         return this._targetsControl;
      },
      /**
       * Возвращает html элемент над которым сейчас находится курсор
       * @returns {*}
       */
      getTargetsDomElemet: function(){
         if (this._jsEvent) {
            if (this._jsEvent.type in {"touchmove":true, "touchend":true}) {
               //для touch событий в таргете всегда лежит элемент над которым началось перетаскивание
               return $(document.elementFromPoint(this._jsEvent.pageX, this._jsEvent.pageY));
            } else {
               return $(this._jsEvent.target);
            }
         }
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
      /**
       * Устанавливает контрол который начал dragndrop. Метод должен вызываться из SBIS3.CONTROLS.DragNDropMixin
       * @param {SBIS3.CONTROLS.Control} owner контрол, который начал dragndrop
       * @protected
       */
      setOwner: function (owner) {
         this._owner = owner;
      },
      onDragHandler: function (e) {
         if (this._jsEvent !== e) {
            this._jsEvent = e;
            this._targetsControl = $(this.getTargetsDomElemet()).wsControl();
            this._setAvatarPosition(e);
         }
      }
      //endregion protected
   });

   return new DragObject();
});