define('js!SBIS3.CONTROLS.BreadCrumbsController', ["Core/constants", "Core/Abstract", "Core/core-functions"], function(constants, cAbstract, cFunctions) {

   var BreadCrumbsController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            breadCrumbs: null,
            backButton: null
         },
         _currentRoot: null,
         _pathDSRawData: [],
         _path: []
      },

      _createBreadCrumb: function(data) {
         var point = {},
            breadCrumbs = this._options.breadCrumbs;
         point[breadCrumbs._options.displayProperty] = data.title;
         point[breadCrumbs._options.idProperty] = data.id;
         point[breadCrumbs._options.colorField] = data.color;
         point.data = data.data;
         return point;
      },

      _setPreviousRoot: function() {
         var previousRoot = this._path[this._path.length - 1],
            view = this._options.view,
            idProperty = this._options.breadCrumbs.getItems().getIdProperty();

         if (this._currentRoot !== null) {
            this._currentRoot = previousRoot;
            if (this._path.length) this._path.splice(this._path.length - 1);
            view.setCurrentRoot(previousRoot ? previousRoot[idProperty] : null);
         }
         view.reload();
      },

      bindBreadCrumbs: function(breadCrumbs, backButton){
         var self = this,
            view = this._options.view;

         backButton = backButton || this._options.backButton;
         breadCrumbs = breadCrumbs || this._options.breadCrumbs;

         function createBreadCrumb(data){
            var point = {};
            point[breadCrumbs._options.displayProperty] = data.title;
            point[breadCrumbs._options.idProperty] = data.id;
            point[breadCrumbs._options.colorField] = data.color;
            point.data = data.data;
            return point;
         }

         function setPreviousRoot() {
            var previousRoot = self._path[self._path.length - 1];

            if(self._currentRoot !== null) {
               self._currentRoot = previousRoot;
               if (self._path.length) self._path.splice(self._path.length - 1);
               view.setCurrentRoot(previousRoot ? previousRoot[breadCrumbs._options.idProperty] : null);
            }
            view.reload();
         }

         view.subscribe('onSetRoot', function(event, id, hier){
            //Этот массив могут использовать другие подписанты, а мы его модифицируем
            var hierClone = cFunctions.clone(hier);
            //onSetRoot стреляет после того как перешли в режим поиска (так как он стреляет при каждом релоаде),
            //при этом не нужно пересчитывать хлебные крошки
            if (!self._searchMode){
               var lastHierElem = hierClone[hierClone.length - 1];
               //Если пришла иерархия, которая не является продолжением уже установленной заменим ее целиком 
               if ((self._currentRoot && hierClone.length && lastHierElem.parent != self._currentRoot.id)){
                  self._currentRoot = hierClone[0];
                  self._path = hierClone.reverse();
               } else {
                  /* Если root не установлен, и переданный id === null, то считаем, что мы в корне */
                  if ( (id === view._options.root) || (!view._options.root && id === null) ){
                     self._currentRoot = null;
                     self._path = [];
                  }
                  for (i = hierClone.length - 1; i >= 0; i--) {
                     var rec = hierClone[i];
                     if (rec){
                        var c = createBreadCrumb(rec);
                        if (self._currentRoot && !Object.isEmpty(self._currentRoot)) {
                           self._path.push(self._currentRoot);
                        } else {

                        }
                        self._currentRoot = c;
                     }
                  }
               }

               for (i = 0; i < self._path.length; i++){
                  if (self._path[i].id == id) {
                     self._path.splice(i, self._path.length - i);
                     break;
                  }
               }

               breadCrumbs.setItems(self._path);
               backButton.setCaption(self._currentRoot ? self._currentRoot.title : '');
            }
         });

         view.subscribe('onKeyPressed', function(event, jqEvent) {
            if(jqEvent.which === constants.key.backspace) {
               setPreviousRoot();
               jqEvent.preventDefault();
            }
         });

         breadCrumbs.subscribe('onItemClick', function(event, id){
            self._currentRoot = this._dataSet.getRecordById(id);
            self._currentRoot = self._currentRoot ? self._currentRoot.getRawData() : null;
            if (id === null){
               self._path = [];
            }
            view.setCurrentRoot(id);
            view.reload();
         });

         backButton.subscribe('onActivated', function(){
            setPreviousRoot();
         });
      },

      /**
       * Установить отображение нового пути для хлебных крошек и кнопки назад
       * @param {Array} path новый путь, последний элемент попадает в BackButton, остальные в хлебные крошки
       */
      setPath: function(path){
         this._path = path;
         if (path.length){
            this._currentRoot = this._path.pop();
         } else {
            this._currentRoot = {};
         }
         this._options.breadCrumbs.setItems(this._path || []);
         this._options.backButton.setCaption(this._currentRoot.title || '');
      },

      getCurrentRootRecord: function(){
         return this._currentRoot ? this._currentRoot.data : null;
      }

   });

   return BreadCrumbsController;

});