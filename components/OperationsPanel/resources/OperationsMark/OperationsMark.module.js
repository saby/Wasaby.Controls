/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsMark',
   'css!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox'
], function(CompoundControl, dotTplFn, OMStyles, MenuLink) {

   var OperationsMark = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'markOperations',
            caption: 'Отметить',
            items: [
               { name: 'selectCurrentPage', title: 'Всю страницу' },
               { name: 'removeSelection', title: 'Снять' },
               { name: 'invertSelection', title: 'Инвертировать' }
            ]
         },
         _markButton: undefined,
         _markCheckBox: undefined
      },
      $constructor: function() {
         var view = this.getParent().getLinkedView();
         this.reviveComponents();
         this._markCheckBox = this.getChildControlByName('markCheckBox');
         /*TODO не знаю как в xhtml задать items*/
         this._markButton = new MenuLink({
            caption: this._options.caption,
            element: $('<div>').appendTo($('.controls__operations-mark')),
            items: this._options.items
         });
         this._initHandlers();
         this._markButton.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
         this._markCheckBox.subscribe('onActivated', this._onCheckBoxActivated.bind(this));
         view.subscribe('onSelectedItemsChange', this._onSelectedItemsChange.bind(this));

      },
      _initHandlers: function() {
         $.each(this._options.items, function(key, val){
            if (val.action) {
               this[val.name] = val.action;
            }
         });
      },
      _onMenuItemActivate: function(e, id) {
         this[id]();
      },
      _onCheckBoxActivated: function() {
         this._markCheckBox.isChecked() === true ? this.selectCurrentPage() : this.removeSelection();
      },
      _updateMarkCheckBox: function() {
         var view = this.getParent().getLinkedView(),
            recordsCount = view._dataSet.getCount(),
            selectedCount = view.getSelectedItems().length;
         this._markCheckBox.setChecked(selectedCount === recordsCount && recordsCount ? true : selectedCount ? null : false);
      },
      _updateMarkButton: function() {
         var hasMarkOptions = !!this._markButton.getItems().getItemsCount(),
            view = this.getParent().getLinkedView(),
            caption,
            selectedCount;
         if (hasMarkOptions) {
            selectedCount = view.getSelectedItems().length;
            caption = selectedCount ? 'Отмечено(' + selectedCount + ')' : 'Отметить';
            this._markButton.setCaption(caption);
         }
         this._markButton.setVisible(hasMarkOptions)
      },
      _onSelectedItemsChange: function() {
         this._updateMarkButton();
         this._updateMarkCheckBox();
      },
      selectCurrentPage: function() {
         this.getParent().getLinkedView().setSelectedItemsAll()
      },
      removeSelection: function() {
         this.getParent().getLinkedView().setSelectedItems([]);
      },
      invertSelection: function() {
         this.getParent().getLinkedView().toggleItemsSelectionAll();
      }
   });

   return OperationsMark;

});