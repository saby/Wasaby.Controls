define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl'
], function (CompoundControl) {
   'use strict';

   var PathSelector = CompoundControl.extend({
      $protected: {
         _hierarchyField: undefined,
         _block: undefined,
         _path: [],
         _options: {
            dataSet: null,
            rootNodeId: null,
            titleColumn: '',
            hierarchyField: 'Раздел'
         }
      },

      $constructor: function () {
         this._hierarchyField = this._options.hierarchyField + '@';
         this._path.unshift({
            'title': 'Root',
            'id': this._options.rootNodeId
         });

         this._block = this.getContainer().find('.controls-HierarchyDataGrid__PathSelector__block');
         this._build();
         this._publish('onPathChange');
      },

      _onMouseClick: function () {
         var target = $(event.target).closest('.controls-HierarchyDataGrid__PathSelector__block__point'),
            index = target.data('index'),
            id = this._path[index].id,
            title = this._path[index].title;
         if (this._checkBeforePointCLick(index)) {
            this._onPointClick(index, id, title, event);
         }
      },

      _checkBeforePointCLick: function (index) {
         return (index + 1 !== this._path.length);
      },

      _onPointClick: function (index, id, title, event) {
         if (index !== undefined) {
            var count = this._path.length - index - 1;
            for (var j = 0; j < count; ++j) {
               this._path.pop();
            }
         }
         this._build();
         this._notify('onPathChange', id);
      },

      _build: function () {
         var path = this._path,
            point;
         this._block.empty();

         for (var i = 0, length = path.length; i < length; i++) {
            point = this._drawPoint(i, i === length - 1);
         }
      },

      _drawPoint: function (index, last) {
         var point = $('<a class="controls-HierarchyDataGrid__PathSelector__block__point" style="cursor: pointer;">' + this._path[index]['title'] + '</a>');
         point.click(this._onMouseClick.bind(this));
         point.attr('data-index', index);
         this._block.append(point);
         if (!last) {
            this._block.append('<span class="controls-HierarchyDataGrid__PathSelector__block__arrow icon-16 icon-DayForward icon-primary"></span>');
         } else {
            point.addClass('controls-HierarchyDataGrid__PathSelector__block__point--current');
         }
      },

      push: function (node) {
         this._path.push(node);
         this._build();
      },

      setRootNode: function () {

      },

      setPath: function () {

      }

   });

   return PathSelector;
});