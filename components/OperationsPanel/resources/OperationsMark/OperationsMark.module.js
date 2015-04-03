/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsMark',
   'css!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox'
], function(CompoundControl, dotTplFn) {

   var OperationsMark = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
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
      init: function() {
         OperationsMark.superclass.init.apply(this, arguments);
         this._markCheckBox = this.getChildControlByName('markCheckBox');
         this._markButton = this.getChildControlByName('markButton');
         this._markButton.setItems(this._options.items);
         this._updateMark();
         this._markButton.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
         this._markCheckBox.subscribe('onActivated', this._onCheckBoxActivated.bind(this));
      },
      $constructor: function() {
         var view = this.getParent().getLinkedView();
         this._initHandlers();
         view.subscribe('onSelectedItemsChange', this._updateMark.bind(this));
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
      _updateMark: function() {
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