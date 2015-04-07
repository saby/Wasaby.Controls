/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.CONTROLS.CheckBox',
], function(MenuLink, StaticSource, ArrayStrategy, CheckBox) {
   var defaultItems = [
      { name: 'selectCurrentPage', title: 'Всю страницу' },
      { name: 'removeSelection', title: 'Снять' },
      { name: 'invertSelection', title: 'Инвертировать' }
   ];

   var OperationsMark = MenuLink.extend({
      $protected: {
         _options: {
            caption: 'Отметить',
            items: defaultItems
         },
         _markCheckBox: undefined
      },
      $constructor: function() {
         this._createMarkCheckBox();
         this._bindEvents();
         this._updateMark();
      },
      _initItems: function(items) {
         var self = this;
         this._defaultItems = new StaticSource({data: defaultItems, keyField: 'name', strategy: new ArrayStrategy()});
         $.each(items, function(key, val) {
            self._parseItem.apply(self,[val]);
         });
         OperationsMark.superclass._initItems.apply(this, [items]);
      },
      _parseItem: function(item) {
         var defaultItem = this._defaultItems.read(item.name).getResult();
         if (item.handler) {
            this[item.name] = item.handler;
         }
         if (!item.title && item.title !== '') {
            item.title = defaultItem ? defaultItem.get('title') : '';
         }
      },
      addItem: function(item) {
         this._parseItem(item);
         OperationsMark.superclass.addItem.apply(this, [item]);
      },
      _bindEvents: function() {
         this.getParent().getLinkedView().subscribe('onSelectedItemsChange', this._updateMark.bind(this));
         this.subscribe('onMenuItemActivate', this._onMenuItemActivate.bind(this));
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
         var hasMarkOptions = !!this.getItems().getItemsCount(),
            selectedCount,
            caption;
         if (hasMarkOptions) {
            selectedCount = this.getParent().getLinkedView().getSelectedItems().length;
            caption = selectedCount ? 'Отмечено(' + selectedCount + ')' : 'Отметить';
            this.setCaption(caption);
         }
         this.setVisible(hasMarkOptions);
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
      },
      _createMarkCheckBox: function() {
         this._markCheckBox = new CheckBox({
            threeState: true,
            element: $('<span>').insertBefore(this._container),
            className: 'controls-OperationsMark-checkBox',
            handlers: {
               onActivated: this._onCheckBoxActivated.bind(this)
            }
         });
      }
   });

   return OperationsMark;
});
