define('js!SBIS3.CONTROLS.ListView.DragNDropMixin', [
   'js!SBIS3.CONTROLS.ListView.Drag'
], function () {
   return {
      $protected: {

      },
      _beginDragHandler: function (dragObject, e) {
         this._getListViewDrag().beginDrag(e, this._findItemByElement(dragObject.getTargetsDomElemet()));
         this._hideItemsToolbar();
      },
      _onDragHandler: function (dragObject, e) {
         this._getListViewDrag().onDrag(e);
      },

      _updateDragTarget: function (dragObject, e) {
         var target = this._findItemByElement(dragObject.getTargetsDomElemet());
         this._getListViewDrag().updateDragTarget(e, target);

      },

      _endDragHandler: function (dragObject, droppable, e) {
         this._getListViewDrag().endDrag(dragObject, e);
         this._updateItemsToolbar();
      },

      _getListViewDrag: function () {
         return this._listViewDrag || (this._listViewDrag = (new ListViewDrag({
            listView: this,
            mover: this._getMover(),
            projection: this._getItemsProjection()
         })));
      }
   }
});
