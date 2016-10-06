define('js!SBIS3.CONTROLS.BreadCrumbsController', function() {

   var BreadCrumbsController = $ws.proto.Abstract.extend({
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
         point[breadCrumbs._options.displayField] = data.title;
         point[breadCrumbs._options.keyField] = data.id;
         point[breadCrumbs._options.colorField] = data.color;
         point.data = data.data;
         return point;
      },

      _setPreviousRoot: function() {
         var previousRoot = this._path[this._path.length - 1],
            view = this._options.view,
            keyField = this._options.breadCrumbs.getItems().getIdProperty();

         if (this._currentRoot !== null) {
            this._currentRoot = previousRoot;
            if (this._path.length) this._path.splice(this._path.length - 1);
            view.setCurrentRoot(previousRoot ? previousRoot[keyField] : null);
         }
         view.reload();
      },

      bindBreadCrumbs: function(breadCrumbs, backButton) {
         var self = this,
            view = this._options.view;

         backButton = backButton || this._options.backButton;
         breadCrumbs = breadCrumbs || this._options.breadCrumbs;
         
         view.subscribe('onSetRoot', function(event, id, hier) {
            if (self._currentRoot) {
               self._currentRoot = hier[0];
               self._path = hier.reverse();
            } else {
               /* Если root не установлен, и переданный id === null, то считаем, что мы в корне */
               if ((id === view.getRoot()) || (!view._options.root && id === null)) {
                  self._currentRoot = null;
                  self._path = [];
               }
               for (var i = hier.length - 1; i >= 0; i--) {
                  var rec = hier[i];
                  if (rec) {
                     if (self._currentRoot && !Object.isEmpty(self._currentRoot)) {
                        self._path.push(self._currentRoot);
                     }
                     self._currentRoot = self._createBreadCrumb(rec);
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
         });

         view.subscribe('onKeyPressed', function(event, jqEvent) {
            if (jqEvent.which === $ws._const.key.backspace) {
               self._setPreviousRoot();
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
            self._setPreviousRoot();
         });
      },

   });

   return BreadCrumbsController;

});