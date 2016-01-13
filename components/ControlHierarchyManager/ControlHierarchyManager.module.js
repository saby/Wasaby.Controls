define('js!SBIS3.CONTROLS.ControlHierarchyManager', [], function () {

   return {
      zIndexManager: {
         _cur: 100499,
         setFree: function (zIndex) {
            zIndex = parseInt(zIndex, 10);
            if (zIndex == this._cur) {
               this._cur -= 2;
            }
            return this._cur;
         },
         getNext: function () {
            this._cur += 2;
            return this._cur;
         }
      },

      _index: {},
      _topWindow: null,

      addNode: function (component) {
         var parent = component.getParent() || (component.getOpener instanceof Function ? component.getOpener() : null),
             id = component.getId(), node;
         //если есть парент
         if (parent  &&  parent.getId instanceof Function) {
            //то ищем узел этого парента по id
            if (!this._index[parent.getId()]) {
               this.addNode(parent);
            }
            node = this._componentToNode(component, this._index[parent.getId()]);
            node.parent.children.push(node);
            //и индексируем новый узел
            this._index[id] = node;
         } else {
            //если парента нет
            node = this._componentToNode(component, null);
            //создаем новый узел и проверяем нет ли его уже
            if (!this._wasAdded(node)) {
               //и в индекс
               this._index[id] = node;
            }
         }
      },

      removeNode: function(component){
         var parent = component.getParent() || (component.getOpener instanceof Function ? component.getOpener() : null),
             id = component.getId();
         if (parent && parent.getId instanceof Function && this._index[parent.getId()]) {
             this.removeNode(parent);
         }
         delete this._index[id];
      },

      //Проверить является ли target jQuery элементом component или его детей
      checkInclusion: function (component, target) {
         var inclusion = this._checkIndexInclusion(component, target);
         if (!inclusion) {
            inclusion = this._checkParentInclusion(component, target);
         }
         return inclusion;
      },

      // Старые контролы не регистрируются в индексе
      // поэтому проверяем не лежит ли родитель контрола на нашем окне
      // TODO: Нужно рассмотреть возможность объеденить иерархии старых и новых контролов в едином механизме.
      _checkParentInclusion: function(component, target){
         var control = $(target).wsControl();
         if (control){
            var parent = control.getOpener instanceof Function ? control.getOpener() || control.getParent() : control.getParent(),
               parentContainer = parent ? parent.getContainer() : null;
            if (parentContainer && this._findContainer(component, parentContainer)){
               return true;
            } else {
               return this._checkParentInclusion(component, parentContainer);
            }
         }
         return false;
      },

      _findContainer: function(control, container){
         return control._container.find($(container)).length || $(control._container).get(0) == container;
      },

      _checkIndexInclusion: function(component, target){
         var node;
         node = this._index[component.getId()];
         if (node) {
            var len = node.children.length;
            if (len) {
               for (var i = 0; i < len; i++) {
                  var self = node.children[i].self;
                  if (this.checkInclusion(self, target)){
                     return true;
                  }
               }
            }
         }
         return this._findContainer(component, target);
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
      },

      setTopWindow: function(window){
         this._topWindow = window;
      },

      getTopWindow: function(){
         return this._topWindow;
      }
   };

});