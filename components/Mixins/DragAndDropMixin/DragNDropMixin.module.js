define('js!SBIS3.CONTROLS.DragNDropMixin', [], function() {
   'use strict';

   if (typeof window !== 'undefined') {
      var EventBusChannel = $ws.single.EventBus.channel('DragAndDropChannel');

      // Добавлены события для мультитач-девайсов
      // Для обработки используются уже существующие обработчики,
      // незначительно дополненные
      $(document).bind('mouseup touchend', function(e) {
         EventBusChannel.notify('onMouseup', e);
      });

      $(document).bind('mousemove touchmove', function(e) {
         EventBusChannel.notify('onMousemove', e);
      });
      
   }

   var DragAndDropMixin = {
      $protected: {
         _moveBeginX: null,
         _moveBeginY: null,
         _shiftX: null,
         _shiftY: null,

         //флаг сигнализирующий о том что юзер начал сдвиг
         _isShifted: false,
         //текущий перемещаемый объект
         _currentComponent: null,
         //константа показывающая на сколько надо сдвинуть мышь, чтобы началось перемещение
         _constShiftLimit: 3,

         _avatar: null,
         _position: null,
         _lines: []
      },

      $constructor: function() {
         var self = this;
         self._publish('onDragMove');
         $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMouseup', this.onMouseup, this);
         $ws.single.EventBus.channel('DragAndDropChannel').subscribe('onMousemove', this.onMousemove, this);
      },

      preparePageXY: function(e) {
         if (e.type == "touchstart" || e.type == "touchmove") {
            e.pageX = e.originalEvent.touches[0].pageX;
            e.pageY = e.originalEvent.touches[0].pageY;
         }
      },
     
      onMouseup: function(buse, e) {
         //определяем droppable контейнер
         if (this._isShifted) {
            var droppable = this._findDragDropContainer(e, e.target);

            if (droppable) {
               this._callDropHandler(e, droppable);
            }

            this._endDropDown();
         }

         this._currentComponent = null;

         if (this._avatar) {
            this._avatar = null;
         }

         this._position = null;
         $('body').removeClass('dragdropBody cantDragDrop');
      },

      onMousemove: function(buse, e) {
         // Если нет выделенных компонентов, то уходим
         if (!this._currentComponent) {
            return;
         }
         var 
            // определяем droppable контейнер
            movable = this._findDragDropContainer(e, e.target);

         if (!this._isShifted) {
            //начало переноса
            this.preparePageXY(e);
            var 
               moveX = e.pageX - this._moveBeginX,
               moveY = e.pageY - this._moveBeginY;
   
            //начинаем движение только если сдвинули сильно
            if ((Math.abs(moveX) < this._constShiftLimit) && (Math.abs(moveY) < this._constShiftLimit)) {
               return;
            }
            this._beginDropDown(e, movable);
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
      setCurrentElement: function(e, elementConfig) {
         //координаты с которых начато движение
         this.preparePageXY(e);
         this._moveBeginX = e.pageX;
         this._moveBeginY = e.pageY;
         this._currentComponent = elementConfig;

         this._isShifted = false;
         this._dropCache();
      },

      _dropCache: function() {},

      getCurrentElement: function() {
         return this._currentComponent;
      },

      _beginDropDown: function() {
         this._isShifted = true;
      },

      _endDropDown: function() {
         this._isShifted = false;
      },

      _callMoveHandlerStandart: function(e, element) {
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
      },

      _callMoveHandler: function(e, element) {
         throw new Error('Method _callMoveHandler must be implemented');
      },
      _callMoveOutHandler: function(e) {
         throw new Error('Method callMoveOutHandler must be implemented');
      },
      _callDropHandlerStandart: function(e, element) {
         this._containerCoords = null;
      },
      _callDropHandler: function(e, element) {
         throw new Error('Method _callDropHandler must be implemented');
      },

      _findDragDropContainerStandart: function(e, target) {
         var elem = target;
         while (elem !== null && (!($(elem).hasClass('genie-dragdrop')))) {
            elem = elem.parentNode;
         }
         return elem;
      },

      _findDragDropContainer: function(e, target) {
         return this._findDragDropContainerStandart(e, target);
      },
      //отвлавливает ли контейнер drag'n'drop внутри себя
      isDragDropContainer: function(element) {
         return $(element).hasClass('genie-dragdrop');
      }
   };

   return DragAndDropMixin;
});