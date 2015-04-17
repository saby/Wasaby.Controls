/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.CheckBox',
], function(MenuLink, CheckBox) {

   /*TODO Пока что динамическое создание CheckBox, пока не слиты Control и CompaundControl!!!*/
   var OperationsMark = MenuLink.extend({
      $protected: {
         _options: {
             /**
              * @cfg {String} Текст на кнопке
              */
            caption: 'Отметить',
            linkedView: undefined,
             /**
              * @cfg {Array[]} Операции отметки
              */
            items: [
               { name: 'selectCurrentPage', title: 'Всю страницу' },
               { name: 'removeSelection', title: 'Снять' },
               { name: 'invertSelection', title: 'Инвертировать' }
            ]
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
         $.each(items, function(key, val) {
            self._parseItem(val);
         });
         OperationsMark.superclass._initItems.apply(this, [items]);
      },
      _parseItem: function(item) {
         if (item.handler) {
            this[item.name] = item.handler;
         }
      },
      addItem: function(item) {
         this._parseItem(item);
         OperationsMark.superclass.addItem.apply(this, [item]);
      },
      _bindEvents: function() {
         this._options.linkedView.subscribe('onSelectedItemsChange', this._updateMark.bind(this));
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
         var view = this._options.linkedView,
            recordsCount = view._dataSet.getCount(),
            selectedCount = view.getSelectedItems().length;
         this._markCheckBox.setChecked(selectedCount === recordsCount && recordsCount ? true : selectedCount ? null : false);
      },
      _updateMarkButton: function() {
         var hasMarkOptions = !!this.getItems().getItemsCount(),
            selectedCount,
            caption;
         if (hasMarkOptions) {
            selectedCount = this._options.linkedView.getSelectedItems().length;
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
         this._options.linkedView.setSelectedItemsAll()
      },
      removeSelection: function() {
         this._options.linkedView.setSelectedItems([]);
      },
      invertSelection: function() {
         this._options.linkedView.toggleItemsSelectionAll();
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
