define('js!SBIS3.CONTROLS.PagingController', ['js!SBIS3.StickyHeaderManager'], function(StickyHeaderManager) {

   var PagingController = $ws.proto.Abstract.extend({
      $protected: {
         _options: {
            breadCrumbs: null,
            backButton: null
         }
      },

      bindBreadCrumbs: function(breadCrumbs, backButton) {
         var self = this,
            view = this._options.view;

         backButton = backButton || this._options.backButton;
         breadCrumbs = breadCrumbs || this._options.breadCrumbs;

         function createBreadCrumb(data) {
            var point = {};
            point[breadCrumbs._options.displayField] = data.title;
            point[breadCrumbs._options.keyField] = data.id;
            point[breadCrumbs._options.colorField] = data.color;
            point.data = data.data;
            return point;
         }

         function setPreviousRoot() {
            var previousRoot = self._path[self._path.length - 1];

            if (self._currentRoot !== null) {
               self._currentRoot = previousRoot;
               if (self._path.length) self._path.splice(self._path.length - 1);
               view.setCurrentRoot(previousRoot ? previousRoot[breadCrumbs._options.keyField] : null);
            }
            view.reload();
         }

         view.subscribe('onSetRoot', function(event, id, hier) {
            //onSetRoot стреляет после того как перешли в режим поиска (так как он стреляет при каждом релоаде),
            //при этом не нужно пересчитывать хлебные крошки
            if (!self._searchMode) {
               var i;
               /*
                TODO: Хак для того перерисовки хлебных крошек при переносе из папки в папку
                Проверить совпадение родительского id и текущего единственный способ понять,
                что в папку не провалились, а попали через перенос.
                От этого нужно избавиться как только будут новые датасорсы и не нужно будет считать пути для крошек
                */
               if (self._currentRoot && hier.length && hier[hier.length - 1].parent != self._currentRoot.id) {
                  self._currentRoot = hier[0];
                  self._path = hier.reverse();
               } else {
                  /* Если root не установлен, и переданный id === null, то считаем, что мы в корне */
                  if ((id === view._options.root) || (!view._options.root && id === null)) {
                     self._currentRoot = null;
                     self._path = [];
                  }
                  for (i = hier.length - 1; i >= 0; i--) {
                     var rec = hier[i];
                     if (rec) {
                        var c = createBreadCrumb(rec);
                        if (self._currentRoot && !Object.isEmpty(self._currentRoot)) {
                           self._path.push(self._currentRoot);
                        } else {

                        }
                        self._currentRoot = c;
                     }
                  }
               }

               for (i = 0; i < self._path.length; i++) {
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
            if (jqEvent.which === $ws._const.key.backspace) {
               setPreviousRoot();
               jqEvent.preventDefault();
            }
         });

         breadCrumbs.subscribe('onItemClick', function(event, id) {
            self._currentRoot = this._dataSet.getRecordById(id);
            self._currentRoot = self._currentRoot ? self._currentRoot.getRawData() : null;
            if (id === null) {
               self._path = [];
            }
            this.setItems(self._path);
            view.setCurrentRoot(id);
            view.reload();
            this._toggleHomeIcon(!self._path.length);
         });

         backButton.subscribe('onActivated', function() {
            setPreviousRoot();
         });
      },

   });

   return PagingController;

});