/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.OperationsMark',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox'
], function(CompoundControl, dotTplFn, StaticSource, ArrayStrategy) {
   var defaultItems = [
      { name: 'selectCurrentPage', title: 'Всю страницу' },
      { name: 'removeSelection', title: 'Снять' },
      { name: 'invertSelection', title: 'Инвертировать' }
   ];

   var OperationsMark = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            caption: 'Отметить',
            items: defaultItems
         },
         _markButton: undefined,
         _markCheckBox: undefined
      },
      init: function() {
         OperationsMark.superclass.init.apply(this, arguments);
         this._markCheckBox = this.getChildControlByName('markCheckBox');
         this._markButton = this.getChildControlByName('markButton');
         this._markButton.setItems(this._options.items);
         this._bindMarkEvents();
         this._updateMark();
      },
      $constructor: function() {
         this._parseItems();
      },
      _parseItems: function() {
         var self = this,
            defaults = new StaticSource({data: defaultItems, keyField: 'name', strategy: new ArrayStrategy()}),
            defaultItem;
         $.each(this._options.items, function(key, val) {
            defaultItem = defaults.read(val.name).getResult();
            if (val.action) {
               self[val.name] = val.action;
            }
            if (!val.title && val.title !== '') {
               val.title = defaultItem ? defaultItem.get('title') : '';
            }
         });
      },
      _bindMarkEvents: function() {
         this.getParent().getLinkedView().subscribe('onSelectedItemsChange', this._updateMark.bind(this));
         this._markButton.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
         this._markCheckBox.subscribe('onActivated', this._onCheckBoxActivated.bind(this));
      },
      _onMenuItemActivate: function(e, id) {
         if (this[id]) {
            this[id].apply(this);
         }
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
            selectedCount,
            caption;
         if (hasMarkOptions) {
            selectedCount = this.getParent().getLinkedView().getSelectedItems().length;
            caption = selectedCount ? 'Отмечено(' + selectedCount + ')' : this._options.caption;
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
