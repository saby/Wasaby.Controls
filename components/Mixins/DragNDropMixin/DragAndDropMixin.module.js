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
      initializeDragAndDrop: function() {
         var self = this;
         this._dragContainer = this._getDragContainer();

         /* Запросим, относительно чего, мы двигаем элемент, иначе просто body */
         this._withinElement = this._getWithinElem() || $(document.body);

         /* Выключим браузерный drag-n-drop */
         this._dragContainer[0].ondragstart = function() {
            return false;
         };
         this._dragContainer
            .addClass('draggable')
            .mousedown(function(e) {

               /* Если нажали не левой клавишей мыши, то не будем обрабатывать перенос */
               if(e.which !== 1) return;

               self._dragStart(e);
               self._setStartPosition(e, this);
               $ws._const.$doc.bind('mousemove.dragNDrop', self._moveAt.bind(self));
               $ws._const.$doc.bind('mouseup.dragNDrop', self._moveEnd.bind(self));
            });
      },
      _moveAt: function(e) {
         this._dragMove(e,{top: e.pageY - this._shift.y, left: e.pageX - this._shift.x});
      },
      _moveEnd: function(e) {
         $ws._const.$doc.unbind('.dragNDrop');
         this._dragEnd(e);
      },
      _getCords: function(elem) {
         var elemCords = elem.getBoundingClientRect(),
            withinElemCords = this._withinElement[0].getBoundingClientRect();

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
            if(this._dragContainer) {
               this._dragContainer.unbind('mousedown');
               this._dragContainer = null;
            }
         }
      }
   };
   return DragAndDropMixin;
});