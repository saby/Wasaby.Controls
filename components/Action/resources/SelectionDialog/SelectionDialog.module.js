define('js!SBIS3.CONTROLS.SelectionDialog', [
   "Core/CommandDispatcher",
   'js!SBIS3.CONTROLS.SelectorController',
   "html!SBIS3.CONTROLS.SelectionDialog",
   "Core/core-instance",
   "html!SBIS3.CONTROLS.SelectionDialog/resources/FolderTitleTpl",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "i18n!SBIS3.CONTROLS.SelectionDialog",
   'css!SBIS3.CONTROLS.SelectionDialog'
], function(CommandDispatcher, SelectorController, dotTplFn, cInstance) {

   var SelectionDialog = SelectorController.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'dialogForSelect',
            autoHeight: false,
            width: '400px',
            height: '400px',
            resizable: false,
            linkedView: undefined,
            records: undefined,
            dataSource: undefined,
            partialyReload: undefined,
            displayProperty: undefined,
            filter: undefined,
            infiniteScroll: null,
            pageSize: undefined,
            buttonCaption: 'Выбрать'
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