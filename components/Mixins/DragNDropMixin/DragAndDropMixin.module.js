/**
 * Created by am.gerasimov on 26.05.2015.
 */
define('js!SBIS3.CONTROLS.DragAndDropMixin', [], function() {

   var isMobile = $ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid;

   var DragAndDropMixin = {
      $protected: {
         _dragContainer: undefined,
         _withinElement: undefined,
         _startPosition: {
            x: 0,
            y: 0
         },
	      _dragStartEventHandler: undefined,
	      _eventHandlers: {}
      },
	   $constructor: function () {
		   var touchHandlers = {
				   touchmove: '_moveAt',
				   touchend: '_moveEnd',
				   touchcancel: '_moveEnd'
			   },
			   mouseHandlers = {
				   mousemove: '_moveAt',
				   mouseup: '_moveEnd'
			   };
		   this._dragStartEventHandler = this._startEventHandler.bind(this);
		   this._eventHandlers = isMobile ? touchHandlers : mouseHandlers;
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
	                          .bind('mousedown touchstart', this._dragStartEventHandler);
      },
      /*
       * Навешивает обработчики движения необходимые для обработки переноса
       */
      _bindDragEvents: function() {
         for (var i = 0; i < this._eventHandlers.length; i++) {
            $ws._const.$doc.bind(i + '.dragNDrop', this[this._eventHandlers[i]].bind(this));
         }
      },
      /**
       * Обновляет drag-N-Drop, заного ищет элементы, навешивает обработчики
       */
      updateDragAndDrop: function() {
         if(this._dragContainers.length) {
	         this._dragContainersUnbind();
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
      _startEventHandler: function(e) {
         /* Если нажали не левой клавишей мыши, то не будем обрабатывать перенос */
         if(isMobile ? e.originalEvent.touches.length > 1 : e.which !== 1) return;

         /* Найдём родителя, относительно которого происходит позиционирование */
         this._withinElement = e.target.offsetParent;

         this._dragStart(e);
         this._setStartPosition(e, e.target);
         this._bindDragEvents();
      },

      /**
       * Сообщает координаты мыши в метод dragMove
       */
      _moveAt: function(e) {
         var eventCords = isMobile ? e.originalEvent.touches[0] : e;
         this._dragMove(e,{top: eventCords.pageY - this._startPosition.y, left: eventCords.pageX - this._startPosition.x});
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
	   _dragContainersUnbind: function() {
		   this._dragContainers.unbind('mousedown touchstart', this._dragStartEventHandler);
	   },

      /* Cчитает координаты с которых началось движение */
      _setStartPosition: function(e, elem) {
         var position = this._getCords(elem),
             style = window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle,
             eventCords = isMobile ? e.originalEvent.touches[0] : e;

         this._startPosition.x = eventCords.pageX - position.left + parseInt(style.marginLeft);
         this._startPosition.y = eventCords.pageY - position.top + parseInt(style.marginTop);
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
            if(this._dragContainers && this._dragContainers.length) {
               this._dragContainersUnbind();
               this._dragContainers = null;
            }
	         this._dragStartEventHandler = undefined;
         }
      }
   };
   return DragAndDropMixin;
});