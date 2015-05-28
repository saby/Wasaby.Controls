define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.PathSelector/resources/pointTpl'
], function (CompoundControl, dotTpl, pointTpl) {
   'use strict';

   var PathSelector = CompoundControl.extend({
      $protected: {
         _dotTplFn: dotTpl,
         _pathContainer: undefined,
         _curRoot: null,
         _path: [],
         _options: {
            linkedView: null,
            rootNodeId: null
         }
      },

      $constructor: function () {
         if (this._options.linkedView){
            this._options.linkedView._getChannel().subscribe('onCurrentNodeChange', this._nodeChangeHandler, this);
         }
         this._curRoot = this._options.rootNodeId;
      },

      setLinkedView: function(view){
         if (this._options.linkedView){
            this._options.linkedView.unsubscribe('onCurrentNodeChange', this._nodeChangeHandler);
         }
         this._options.linkedView = view;
         this._options.linkedView._getChannel().subscribe('onCurrentNodeChange', this._nodeChangeHandler, this);
      },

      _nodeChangeHandler: function(event, key, title){
         var node = {key: key, title: title};
         key && this.push(node);
         this._redraw();
         this._curRoot = key;
      },

      _redraw: function(){
         var path = this._path;
         this._container.empty();
         for (var i = 0; i < path.length; i++){
            this._drawPoint(path[i], i === path.length - 1);
         }
      },

      _drawPoint: function(node, last){
         var point = $(pointTpl(node)),
         self = this;
         point.bind('click', function(){
            self._onPointClick(node.parent);
         });
         if (last){
            $('.controls-PathSelector__arrow', point).removeClass('icon-16').addClass('icon-24').css('top', '5px');
         }
         this._container.prepend(point);
      },

      _onPointClick: function(parentKey){
         var path = this._path;
         //убираем все предыдущие ноды, включая ту на которую нажали
         while (path.length && path[path.length - 1].key != parentKey){
            path.pop();
         }
         this._options.linkedView.openNode(parentKey);
      },

      push: function (node) {
         node.parent = this._curRoot;
         if (!this._path.length){
            this._path.push(node);
         } else 
         //не пушим ноду если она и так последняя
         if (this._path[this._path.length - 1].key != node.key){
               this._path.push(node);
            }
      }

   });

   return PathSelector;
});