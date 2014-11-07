define('js!SBIS3.CONTROLS.ControlHierarchyManager', [], function () {

   return {
      zIndexManager: {
         _cur: 100499,
         setFree: function (zIndex) {
            zIndex = parseInt(zIndex, 10);
            if (zIndex == this._cur) {
               this._cur--;
            }
            return this._cur;
         },
         getNext: function () {
            this._cur++;
            return this._cur;
         }
      },

      _index: [],
      _tree: [],

      addNode: function (component, parent) {
         var id = component.getId(),
            node = this._componentToNode(component, parent);
         //если есть парент
         this._index.push([{
            id: id,
            node : node
         }]);

         if (parent) {
            
         } else {

         }
      },

      removeNode: function(component){
         var node = this._getNodeById(component.getId()),
            id = node.self.getId();
         for (var i = 0; i < this._index.length; i++) {
            if (this._index[i].id == id) {
               var parentNode = node.parent;
               while (parentNode) {
                  this._removeChildren(id, parentNode);
                  parentNode = parentNode.parent;
               }
               this._index.splice(i,1);
            }
         }
      },

      //удалить ребенка c id childrenId из ноды node
      _removeChildren: function(childrenId, node){
         var len = node.children.length;
         for (var i = 0; i < len; i++){
            if (node.children[i].self.getId() == childrenId){
               node.children.splice(i,1);
               return;
            }
         }
      },

      //Получить ноду по id
      _getNodeById: function(id){
         var node;
         for (var i = 0; i < this._index.length; i++) {
            if (id == this._index[i].id) {
               node = this._index[i].node;
            }
         }
         return node;
      },

      //Проверит является ли target jQuery элементом component или его детей
      checkInclusion: function (component, target) {
         var node, flag;
         node = this._getNodeById(component.getId());
         //проходим по всем детям и ищем target
         var len = node.children.length;
         for (var i = 0; i < len; i++) {
            var self = node.children[i].self;
            if (self._container.find($(target)).length) {
               //если нашли сразу сообщаем
               return true;
            }
         }
         //если в детях не нашли, проверим в собственном контейнере и сам контейнер
         flag = !!component._container.find(target).length || $(component._container).get(0) == target;
         return flag;
      },

      _wasAdded: function (node) {
         for (var i = 0; i < this._index.length; i++) {
            if (node.self.getId() == this._index[i].id) {
               return true;
            }
         }
         return false;
      },

      // сделать из компонента узел
      _componentToNode: function (component, parentNode) {
         return {
            'parent': parentNode,
            'self': component,
            'children': []
         };
      }
   };

});