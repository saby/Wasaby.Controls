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
         },

         //текущий активный компонент, либо по gdi (если переносим)
         //либо отдаем тип, если создаем из палитры
         setCurrentElement: function (e, elementConfig) {
            //координаты с которых начато движение
            this.preparePageXY(e);
            this._moveBeginX = e.pageX;
            this._moveBeginY = e.pageY;
            DragCurrentElement.set(elementConfig, this);
            this._dropCache();
         },

         _dropCache: function () {
         },

         getCurrentElement: function () {
            return DragCurrentElement.get();
         },

         getDragOwner: function () {
            return DragCurrentElement.getOwner();
         },

         beginDropDown: function(e, movable){
            this.notify('onDragBegin', e, movable);
            this._beginDropDown(e, movable);
            DragCurrentElement.setDragging(true);
         },

         isDragging: function () {
            return DragCurrentElement.isDragging();
         },

         endDropDown: function () {
            if (this.isDragging()) {
               this._endDropDown();
               DragCurrentElement.reset();
               this._position = null;
               DragCurrentElement.setDragging(false);
               $('body').removeClass('dragdropBody cantDragDrop');
            }
         },

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

         _callMoveOutHandler: function (e) {
            throw new Error('Method callMoveOutHandler must be implemented');
         },

         _callDropHandler: function () {
            this._containerCoords = null;
            this._notify('onDragEnd', this.getCurrentElement);
         },

         _findDragDropContainerStandart: function (e, target) {
            var elem = target;
            while (elem !== null && (!($(elem).hasClass('genie-dragdrop')))) {
               elem = elem.parentNode;
            }
            return elem;
         },

         _findDragDropContainer: function (e, target) {
            return this._findDragDropContainerStandart(e, target);
         },

         //отвлавливает ли контейнер drag'n'drop внутри себя
         isDragDropContainer: function (element) {
            return $(element).hasClass('genie-dragdrop');
         },

         _createAvatar: function(e) {
            var count = this.getCurrentElement().keys.length,
               avatar = this._getAvatar();
            this.setDragAvatar(avatar);
            this._setAvatarPosition(e);
         },

         getDragAvatar: function() {
            return DragCurrentElement.getAvatar();
         },

         setDragAvatar: function(avatar) {
            DragCurrentElement.setAvatar(avatar);
         },

         _setAvatarPosition: function(e){
            //смещение нужно чтобы событие onmouseup сработало над контролом, а не над аватаром
            if (DragCurrentElement.getAvatar()) {
               DragCurrentElement.getAvatar().css({
                  'left': e.pageX + DRAG_AVATAR_OFFSET,
                  'top': e.pageY + DRAG_AVATAR_OFFSET
               });
            }
         }
      };

   return DragAndDropMixin;
});