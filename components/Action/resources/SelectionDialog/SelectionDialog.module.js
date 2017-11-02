define('js!SBIS3.CONTROLS.SelectionDialog', [
   'js!SBIS3.CONTROLS.SelectorController',
   "tmpl!SBIS3.CONTROLS.SelectionDialog",
   "tmpl!SBIS3.CONTROLS.SelectionDialog/resources/FolderTitleTpl",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "i18n!SBIS3.CONTROLS.SelectionDialog",
   'css!SBIS3.CONTROLS.SelectionDialog'
], function(SelectorController, dotTplFn, FolderTitleTpl) {
   var SelectionDialog = SelectorController.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'dialogForSelect',
            autoHeight: false,
            height: 'auto',
            width: 'auto',
            resizable: false,
            linkedView: undefined,
            records: undefined,
            dataSource: undefined,
            partialyReload: undefined,
            displayProperty: undefined,
            filter: undefined,
            infiniteScroll: null,
            pageSize: undefined,
            buttonCaption: 'Выбрать',
            rootValue: null,
            folderTitleTpl: FolderTitleTpl
         },
         treeView: undefined
      },
      $constructor: function() {
         this.subscribe('onReady', this._onReady.bind(this));
      },
      
      _onReady: function() {
         var
             filter = this._options.filter || {};
         this._treeView = this.getChildControlByName('SelectionDialog-TreeDataGridView');
         if (this._options.rootValue) {
            filter[this._options.parentProperty] = this._options.rootValue;
         }
         var root = {};
         root[this._options.idProperty] = this._options.rootValue;
         root[this._options.displayProperty] = rk('Корень');
         root[this._options.nodeProperty] = true;
         this._treeView.setRoot(root);
         this._treeView.setFilter(filter, true);
         this._treeView.setDataSource(this.getDataSource());

         if (this._treeView.getMultiselect()) {
            //по стандарту кнопку выбора надо показывать только если включен мультеселект
            this.getChildControlByName('SelectorControllerButton').show()
         }
      },

      getDataSource: function() {
         return this._options.dataSource;
      }

   });

   return SelectionDialog;
});