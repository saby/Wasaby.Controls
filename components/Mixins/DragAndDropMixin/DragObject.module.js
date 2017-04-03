/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.DragObject', [
   'Core/Abstract',
   'Core/WindowManager',
   'Core/core-instance'
], function( cAbstract, cWindowManager, cInstance) {
   'use strict';
   /**
    * Синглтон объект, в котором содержится информация о текущем состоянии Drag'n'drop:
    * <ul>
    *    <li>Элементы, которые перемещают;</li>
    *    <li>Элемент, над которым сейчас находится курсор мыши;</li>
    *    <li>Контрол, с которого тащат элементы;</li>
    *    <li>Контрол, над которым сейчас находится курсор мыши;</li>
    *    <li>Аватар - иконка, которая отображается около курсора мыши.</li>
    * </ul>
    * DragObject передается во все события DragNDropMixin. Также его можно получить в любом месте через RequireJS.
    * @class SBIS3.CONTROLS.DragObject
    * @public
    * @author Крайнов Дмитрий Олегович
    * @see SBIS3.CONTROLS.DragNDropMixin
    * @example
    * Получим DragObject через require
    * <pre>
    *    var dragObject = require('js!SBIS3.CONTROLS.DragObject');
    * </pre>
    */
   var DRAG_AVATAR_OFFSET = 5;
   var DragObject = cAbstract.extend(/**@lends SBIS3.CONTROLS.DragObject.prototype*/{
      $protected: {
         /**
          * @member {SBIS3.CONTROLS.Control} Контрол, который инициализировал Drag'n'drop.
          */
         _owner: undefined,
         /**
          * @member {WS.Data/Collection/IList} Набор элементов, которые сейчас перемещают.
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
          * @member {Boolean} Признак - перемещают ли ейчас элемент.
          */
         _dragging: undefined,
         /**
          * @member {Object} Дополнительная информация.
          */
         _meta: undefined,
         /**
         * @member {Event} Событие браузера (onMouseMove, onMouseDown ...), актуальное текущему моменту перемещения.
         */
         _jsEvent: undefined,
         /**
          * @member {SBIS3.CONTROLS.Control} Контрол, над которым находится курсор мыши.
          */
         _targetsControl: undefined
      },
      /**
       * Возвращает набор перемещаемых элементов.
       * @remark Элементы должны быть наследниками класса {@link SBIS3.CONTROLS.DragEntity.Entity}. Их устанавливает контрол, который инициализирует Drag'n'drop.
       * @returns {WS.Data/Collection/IList|undefined}
       */
      getSource: function () {
         return this._source;
      },
      /**
       * Устанавливает набор перемещаемых элементов.
       * @remark Вызывается из контрола, который инициализирует Drag'n'drop. Элементы должны быть наследниками класса {@link SBIS3.CONTROLS.DragEntity.Entity}.
       * @param {WS.Data/Collection/IList} source
       */
      setSource: function (source) {
         this._source = source;
      },
      /**
       * Возвращает элемент, над которым находится курсор.
       * @remark Элемент должен быть наследником класса {@link SBIS3.CONTROLS.DragEntity.Entity}. Его устанавливает контрол, находящийся сейчас под курсором.
       * @returns {SBIS3.CONTROLS.DragEntity.Entity|undefined}
       */
      getTarget: function () {
         return this._target;
      },
      /**
       * Устанавливает элемент над которым находится курсор.
       * @remark Элемент должен быть наследником класса {@link SBIS3.CONTROLS.DragEntity.Entity}. Вызывается из контрола над которым сейчас находится курсор мыши.
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
         this._targetsControl = undefined;
         this._dragging = false;
         this.setAvatar(null);
      },
      /**
       * Возвращает аватар, иконка которая отображается около курсора.
       * @see setAvatar
       * @see removeAvatar
       * @returns {JQuery}
       */
      getAvatar: function () {
         return this._avatar;
      },
      /**
       * Возвращает метаданные объекта.
       * @remark Дополнительные данные рекомендуется складывать в объекты target или source, создавая свои уникальные реализации сущностей Drag'n'drop, унаследованные от {@link SBIS3.CONTROLS.DragEntity.Entity}.
       * @see setMeta
       * returns {Object}
       */
      getMeta: function () {
         return this._meta;
      },
      /**
       * Устанавливает метаданные объекта.
       * @remark Дополнительные данные рекомендуется складывать в объекты target или source, создавая свои уникальные реализации сущностей Drag'n'drop, унаследованные от {@link SBIS3.CONTROLS.DragEntity.Entity}.
       * @see getMeta
       * returns {Object}
       */
      setMeta: function (meta) {
         this._meta = meta;
      },
      /**
       * Устанавливает аватар, иконка которого отображается около курсора мыши.
       * @param {String} avatar Cтрока содержащая верстку аватара.
       * @see getAvatar
       * @see removeAvatar
       */
      setAvatar: function (avatar) {
         this.removeAvatar();
         if (avatar) {
            this._avatar = $(avatar);
            this._setAvatarPosition(this._jsEvent);
            this._avatar.css({
               'z-index': cWindowManager.acquireZIndex(false),
               position: 'absolute'
            }).appendTo($('body'));
         }
      },
      /**
       * Удаляет аватар, иконка которого отображается около курсора мыши.
       * @see setAvatar
       * @see getAvatar
       */
      removeAvatar: function () {
         if (this._avatar) {
            this._avatar.remove();
            this._avatar = null;
         }
      },
      /**
       * Вернет true если сейчас инициализован Drag'n'drop.
       * @returns {Boolean}
       */
      isDragging: function () {
         return this._dragging;
      },

      /**
       * Возвращает контрол над которым сейчас находится курсор мыши.
       * @returns {SBIS3.CONTROLS.Control}
       */
      getTargetsControl: function () {
         return this._targetsControl;
      },
      /**
       * Возвращает html элемент над которым сейчас находится курсор мыши.
       * @returns {*}
       */
      getTargetsDomElemet: function(){
         if (this._jsEvent) {
            if (this._jsEvent.type in {"touchmove":true, "touchend":true}) {
               //для touch событий в таргете всегда лежит элемент над которым началось перемещение
               //тоже самое для firefox
               return $(document.elementFromPoint(this._jsEvent.pageX, this._jsEvent.pageY));
            } else {
               return $(this._jsEvent.target);
            }
         }
      },
      //region protected
      /**
       * Устанавливает признак перемещения вызывается только из {@link SBIS3.CONTROLS.DragNDropMixin}.
       * @param {Boolean} dragging
       * @protected
       */
      setDragging: function (dragging) {
         this._dragging = !!dragging;
      },

      /**
       * Устанавливает позицию аватара.
       * @param  {Event} e Браузерное событие.
       * @protected
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
       * Устанавливает контрол который инициализировал Drag'n'drop. Метод должен вызываться только из SBIS3.CONTROLS.DragNDropMixin
       * @param {SBIS3.CONTROLS.Control} owner контрол, который инициализировал Drag'n'drop
       * @protected
       */
      setOwner: function (owner) {
         this._owner = owner;
      },

      _getTargetsControl: function() {
         var control = $(this.getTargetsDomElemet()).wsControl(),
            found = function(control) {
               //такой поиск нужен что бы в таргете всегда был контрол с dnd миксином, кроме того на ipade контрол находит себя по таргету
               //если внутри контрола будут вложенные контролы то там драгндроп работать не будет.
               if (control) {
                  if (cInstance.instanceOfMixin(control, 'SBIS3.CONTROLS.DragNDropMixin') && control.getItemsDragNDrop()) {
                     return control;
                  }
                  return found(control.getParent());
               }
            };

         return found(control);
      },

      onDragHandler: function (e) {
         if (this.isDragging() && this._jsEvent !== e) {
            this._jsEvent = e;
            this._targetsControl = this._getTargetsControl();
            this._setAvatarPosition(e);
         }
      }
      //endregion protected
   });

   return new DragObject();
});