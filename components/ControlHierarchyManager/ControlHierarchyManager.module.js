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

      addNode: function (component) {
         var parent = component.getParent(),
            id = component.getId();
         //если есть парент
         if (parent) {
            for (var i = 0; i < this._index.length; i++) {
               //то ищем узел этого парента по id
               if (this._index[i].id == parent.getId()) {
                  var node = this._componentToNode(component, this._index[i].node),
                     parentNode = node.parent;
                  //добавляем в список детей этого узла, и всех его предков новый узел
                  while (parentNode) {
                     parentNode.children.push(node);
                     parentNode = parentNode.parent;
                  }
                  //и индексируем новый узел
                  this._index.push({
                     'node': node,
                     'id': id
                  });
               }
            }
         } else {
            //если парента нет
            var node = this._componentToNode(component, null);
            //создаем новый узел и проверяем нет ли его уже
            if (!this._wasAdded(node)) {
               //добавляем в дерево
               this._tree.push(node);
               //и в индекс
               this._index.push({
                  'node': node,
                  'id': id
               });
            }
         }
         console.log(this._tree);
      },

      //TODO: не работает, доделать
      removeNode: function(component){
         var node = this._getNodeById(component.getId()),
            id = node.self.getId();
         for (var i = 0; i < this._index.length; i++) {
            if (this._index[i].id == id) {
               this._index.splice(i,1);
            }
         }
      },

      //Получись ноду по id
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