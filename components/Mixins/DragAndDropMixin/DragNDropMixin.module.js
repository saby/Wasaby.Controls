define('js!SBIS3.CONTROLS.DragNDropMixin', ['js!SBIS3.CONTROLS.DragCurrentElement'], function (DragCurrentElement) {
   'use strict';

   if (typeof window !== 'undefined') {
      var EventBusChannel = $ws.single.EventBus.channel('DragAndDropChannel');

      // Добавлены события для мультитач-девайсов
      // Для обработки используются уже существующие обработчики,
      // незначительно дополненные
      $(document).bind('mouseup touchend', function(e) {
         EventBusChannel.notify('onMouseup', e);
      });

      $(document).bind('mousemove touchmove', function (e) {
         EventBusChannel.notify('onMousemove', e);
      });

   }
   var
      DRAG_AVATAR_OFFSET = 5,
      buildTplArgsLV = function (cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.multiselect = cfg.multiselect;
         tplOptions.decorators = this._decorators;
         tplOptions.colorField = cfg.colorField;

         return tplOptions;
      },
      DragAndDropMixin = {
         $protected: {
            _moveBeginX: null,
            _moveBeginY: null,
            _shiftX: null,
            _shiftY: null,

            //текущий перемещаемый объект
            _currentComponent: null,
            //константа показывающая на сколько надо сдвинуть мышь, чтобы началось перемещение
            _constShiftLimit: 3,

            _position: null,
            _lines: [],
            _dragNDropGroupEvent: undefined

         },
         //region public
         $constructor: function () {
            this._publish(['onDragMove', 'onDragBegin', 'onDragEnd']);
            //$ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this.endDropDown, this);
            $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this.onMousemove, this);
         },

         init: function(){
            $(this.getContainer()).bind('mouseup touchend', this.onMouseup.bind(this));
         },

         preparePageXY: function (e) {
            if (e.type == "touchstart" || e.type == "touchmove") {
               e.pageX = e.originalEvent.touches[0].pageX;
               e.pageY = e.originalEvent.touches[0].pageY;
            }
         },


         /**
          * текущий активный компонент, либо по gdi (если переносим)
          * либо отдаем тип, если создаем из палитры
          * @param {Event} e
          * @param {Object} elementConfig
          */
         setCurrentElement: function (e, elementConfig) {
            //координаты с которых начато движение
            this.preparePageXY(e);
            this._moveBeginX = e.pageX;
            this._moveBeginY = e.pageY;
            DragCurrentElement.set(elementConfig, this);
            this._dropCache();
         },
         /**
          * возвращает текущий элемент
          * @returns {Object}
          */
         getCurrentElement: function () {
            return DragCurrentElement.get();
         },

         /**
          * Возвращает контрол с которого тащат элемент
          * @returns {*}
          */
         getDragOwner: function () {
            return DragCurrentElement.getOwner();
         },

         /**
          * Идет ли сейчас перетаскивание
          * @returns {*}
          */
         isDragging: function () {
            return DragCurrentElement.isDragging();
         },

         /**
          * проверяет наличие контейнера
          * @param element
          * @returns {*|jQuery}
          */
         isDragDropContainer: function (element) {
            return $(element).hasClass('genie-dragdrop');
         },
         /**
          * возвращает аватар
          * @returns {*}
          */
         getDragAvatar: function() {
            return DragCurrentElement.getAvatar();
         },
         /**
          * устанавливает аватар
          * @param {JQuery} avatar
          */
         setDragAvatar: function(avatar) {
            DragCurrentElement.setAvatar(avatar);
         },
         //endregion public

         //region handlers
         _dropCache: function () {
         },
         /**
          * обработчик на Mousemove
          * @param e
          * @param element
          * @private
          */
         _callMoveHandler: function (e, element) {
            var target = this.getCurrentElement();
            if (!this._containerCoords) {
               this._containerCoords = {
                  x: this._moveBeginX - parseInt(target.css('left'), 10),
                  y: this._moveBeginY - parseInt(target.css('top'), 10)
               };
            }

            this.preparePageXY(e);
            target.css({
               top: e.pageY - this._containerCoords.y,
               left: e.pageX - this._containerCoords.x
            });
            this._notify('onDragMove', e, element);
         },
         /**
          * оработчик на MoveOut
          * @param e
          * @param target
          * @private
          */
         _callMoveOutHandler: function (e) {
            throw new Error('Method callMoveOutHandler must be implemented');
         },
         /**
          * оработчик на mouseUP
          * @param e
          * @param droppable
          * @private
          */
         _callDropHandler: function (e, droppable) {
            this._containerCoords = null;
            this._notify('onDragEnd', this.getCurrentElement);
         },
         /**
          * стандартный поиск контейнера
          * @param e
          * @param target
          * @returns {*}
          * @private
          */
         _findDragDropContainerStandart: function (e, target) {
            var elem = target;
            while (elem !== null && (!($(elem).hasClass('genie-dragdrop')))) {
               elem = elem.parentNode;
            }
            return elem;
         },
         /**
          * шаблонныйц метод endDropDown
          * @private
          */
         _endDropDownHandler: function(){

         },
         _beginDropDownHandler: function(){

         },
         //endregion handlers

         //region protected
         /**
          * ищет контейнер
          * @param e
          * @param target
          * @returns {*}
          * @private
          */
         _findDragDropContainer: function (e, target) {
            return this._findDragDropContainerStandart(e, target);
         },

         /**
          * создает аватар
          * @param  {Event} e
          * @private
          */
         _createAvatar: function(e) {
            var count = this.getCurrentElement().keys.length,
               avatar = this._getAvatar();
            this.setDragAvatar(avatar);
            this._setAvatarPosition(e);
         },

         /**
          * устанавливает позицию аватара
          * @param  {Event} e
          * @private
          */
         _setAvatarPosition: function(e){
            //смещение нужно чтобы событие onmouseup сработало над контролом, а не над аватаром
            if (DragCurrentElement.getAvatar()) {
               DragCurrentElement.getAvatar().css({
                  'left': e.pageX + DRAG_AVATAR_OFFSET,
                  'top': e.pageY + DRAG_AVATAR_OFFSET
               });
            }
         },
         /**
          *
          * @param e
          * @param movable
          */
         beginDropDown: function(e, movable){
            this.notify('onDragBegin', e, movable);
            this._beginDropDownHandler(e, movable);
            DragCurrentElement.setDragging(true);
         },
         /**
          *
          */
         _endDropDown: function () {
            if (this.isDragging()) {
               this._endDropDownHandler();
               DragCurrentElement.reset();
               this._position = null;
               DragCurrentElement.setDragging(false);
               $('body').removeClass('dragdropBody cantDragDrop');
            }
         },
         //endregion protected
         //region mouseHandler
         /**
          *
          * @param e
          */
         onMouseup: function (e) {
            //определяем droppable контейнер
            if (this.isDragging()) {
               var droppable = this._findDragDropContainer(e, e.target);

               if (droppable) {
                  this._callDropHandler(e, droppable);
               }
            }
            this.endDropDown();
         },
         /**
          *
          * @param buse
          * @param e
          * @returns {boolean}
          */
         onMousemove: function (buse, e) {
            // Если нет выделенных компонентов, то уходим
            if (!this.getCurrentElement()) {
               return;
            }

            var
            // определяем droppable контейнер
               movable = this._findDragDropContainer(e, e.target);

            if (!this.isDragging()) {
               //начало переноса
               this.preparePageXY(e);
               var
                  moveX = e.pageX - this._moveBeginX,
                  moveY = e.pageY - this._moveBeginY;

               //начинаем движение только если сдвинули сильно
               if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
                  return;
               }
               this.beginDropDown(e, movable);
            }

            $('body').addClass('dragdropBody');
            //двигаем компонент
            if (movable) {
               this._callMoveHandler(e, movable);
            } else {
               this._callMoveOutHandler(e);
            }

            return false;
         }
         //endregion mouseHandler
      };

   return DragAndDropMixin;
});