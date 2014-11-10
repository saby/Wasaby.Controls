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

      _index: {},
      _tree: [],

      addNode: function (component) {
         var parent = component.getParent(),
            id = component.getId(), node;
         //если есть парент
         if (parent) {
            //то ищем узел этого парента по id
            if (this._index[parent.getId()]) {
               node = this._componentToNode(component, this._index[parent.getId()]);
               node.parent.children.push(node);
               //и индексируем новый узел
               this._index[id] = node;
            } else { //Если не нашли узел парента
               //TODO: выпилить, кода это будет реализовано в контроле
               this.addNode(parent);
               node = this._componentToNode(component, this._index[parent.getId()]);
               node.parent.children.push(node);
               //и индексируем новый узел
               this._index[id] = node;
            }
         } else {
            //если парента нет
            node = this._componentToNode(component, null);
            //создаем новый узел и проверяем нет ли его уже
            if (!this._wasAdded(node)) {
               //добавляем в дерево
               this._tree.push(node);
               //и в индекс
               this._index[id] = node;
            }
         }
      },

      removeNode: function(component){
         this._index[component.getId()] = null;
      },

      //Проверить является ли target jQuery элементом component или его детей
      checkInclusion: function (component, target) {
         var node, flag = false;
         node = this._index[component.getId()];
         var len = node.children.length;
         if (len) {
            for (var i = 0; i < len; i++) {
               var self = node.children[i].self;
               flag = this.checkInclusion(self, target);
            }
         }
         if (component._container.find($(target)).length || $(component._container).get(0) == target) {
            flag = true;
         }
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