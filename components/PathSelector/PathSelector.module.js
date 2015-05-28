define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl'
], function (CompoundControl) {
   'use strict';

   var PathSelector = CompoundControl.extend({
      $protected: {
         _pathContainer: undefined,
         _path: [],
         _options: {
            dataSet: null,
            rootNodeId: null,
            titleColumn: ''
         }
      },

      $constructor: function () {
         this._publish('onPathChange');
         this._pathContainer = this.getContainer().find('.controls-HierarchyDataGrid__PathSelector__block');
      },

      _redraw: function(){
         var path = this._path;
         this._pathContainer.empty();
         for (var i = 0; i < path.length; i++){
            this._drawPoint(i, i === path.length - 1);
         }
      },

      _drawPoint: function(index, last){
         var point = $('<span class="controls-HierarchyDataGrid__PathSelector__block__point hover-target" style="cursor:pointer">' +
                           '<a>' + this._path[index]['title'] +
                              '<span class="' + this._path[index]['icon'] +'"style="top: 2px; position: relative;"><span>' + 
                           '</a>' + 
                       '</span>'),
            arrow = $('<span class="controls-HierarchyDataGrid__PathSelector__block__arrow icon-Back icon-primary action-hover hover-target"></span>'),
            container = this._pathContainer,
            self = this;
         point.data('index', this._path[index - 1] ? index - 1 : this._options.rootNodeId);
         if (!last) {
            arrow.get(0).className+= ' icon-16';
         } else {
            arrow.get(0).className+= ' icon-24 controls-HierarchyDataGrid__PathSelector__block__arrow-last';
         }
         point.prepend(arrow);
         point.bind('click', function(e){
            self._onMouseClick(e);
         });
         container.prepend(point);
      },

      _onMouseClick: function (e) {
         var target = $(e.target).closest('.controls-HierarchyDataGrid__PathSelector__block__point'),
            index = target.data('index'),
            id =  index !== null ? this._path[index].id : null,
            title = index !== null ? this._path[index].title : '';
            this._onPointClick(index, id, title, event);
      },

      _onPointClick: function (index, id, title, event) {
         if (index !== undefined) {
            index = index || 0;
            var count = this._path.length - index - 1;
            if (id != null){
               for (var j = 0; j < count; ++j) {
                  this._path.pop();
               }
            } else {
               this._path = [];
            }
         }
         this._redraw();
         this._notify('onPathChange', id);
      },

      push: function (node) {
         if (!this._path.length){
            this._path.push(node);
         } else if (this._path[this._path.length - 1].id != node.id){
               this._path.push(node);
            }
         this._redraw();
      }

   });

   return PathSelector;
});