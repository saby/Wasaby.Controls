/**
 * Created by am.gerasimov on 26.05.2015.
 */
define('js!SBIS3.CONTROLS.DragAndDropMixin', [], function() {
   var DragAndDropMixin = {
      $protected: {
         _dragContainer: undefined,
         _withinElement: undefined,
         _shift: {
            x: 0,
            y: 0
         }
      },

      /*
       * Инициализирует drag-n-Drop
       */
      initializeDragAndDrop: function() {
         this._dragContainers = this._getDragContainer();

         /* Выключим браузерный drag-n-drop для каждого элемента*/
         this._toggleNativeDragNDrop(false);

         /* Навесим класс и обработчики, необходимые для работы drag-n-drop'а */
         this._dragContainers.addClass('draggable')
                             .mousedown(this._mouseDownHandler.bind(this));
      },

      /**
       * Обновляет drag-N-Drop, заного ищет элементы, навешивает обработчики
       */
      updateDragAndDrop: function() {
         if(this._dragContainers.length) {
             this._dragContainers.unbind('mousedown', this._mouseDownHandler.bind(this));
         }
         this._toggleNativeDragNDrop(true);
         this.initializeDragAndDrop();
      },

      /**
       * Выключает/включает стандартный drag-N-Drop браузера
       */
      _toggleNativeDragNDrop: function(enable) {
         $ws.helpers.forEach(this._dragContainers, function(elem) {
            elem.ondragstart = function() {
               return enable;
            }
         });
      },

      /*
       * Обработчик нажатия мыши на переносимый элемент
       */
      _mouseDownHandler: function(e) {
         /* Если нажали не левой клавишей мыши, то не будем обрабатывать перенос */
         if(e.which !== 1) return;

         /* Найдём родителя, относительно которого происходит позиционирование */
         this._withinElement = e.target.offsetParent;

         this._dragStart(e);
         this._setStartPosition(e, e.target);
         $ws._const.$doc.bind('mousemove.dragNDrop', this._moveAt.bind(this));
         $ws._const.$doc.bind('mouseup.dragNDrop', this._moveEnd.bind(this));
      },


      /**
       * Сообщает координаты мыши в метод dragMove
       */
      _moveAt: function(e) {
         this._dragMove(e,{top: e.pageY - this._shift.y, left: e.pageX - this._shift.x});
      },

      /**
       * Отписывается от событий, вызывает метод dragEnd
       */
      _moveEnd: function(e) {
         $ws._const.$doc.unbind('.dragNDrop');
         this._dragEnd(e);
      },

      /**
       * Кроссбраузерно расчитывает координаты элемента, учитывая прокрутку
       */
      _getCords: function(elem) {
         var elemCords = elem.getBoundingClientRect(),
            withinElemCords = this._withinElement.getBoundingClientRect();

         return {
            top: elemCords.top + pageYOffset - withinElemCords.top,
            left: elemCords.left + pageXOffset - withinElemCords.left
         };
      },

      _setStartPosition: function(e, elem) {
         var position = this._getCords(elem),
             style = window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;

         this._shift.x = e.pageX - position.left + parseInt(style.marginLeft);
         this._shift.y = e.pageY - position.top + parseInt(style.marginTop);
      },

      _getDragContainer: function() {
         throw new Error('Method _getDragContainer() must be implemented');
      },
      _getWithinElem: function() {
         /* Method must be implemented */
      },
      _dragMove: function() {
         /* Method must be implemented */
      },
      _dragEnd: function () {
         /* Method must be implemented */
      },
      _dragStart: function () {
         /* Method must be implemented */
      },
      before: {
         destroy: function () {
            if(this._dragContainers.length) {
               this._dragContainers.unbind('mousedown');
               this._dragContainers = null;
            }
         }
      }
   };
   return DragAndDropMixin;
});