/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationsMark', [
   'js!SBIS3.CONTROLS.MenuLink'
], function(MenuLink) {

   var OperationsMark = MenuLink.extend({

      $protected: {
         _options: {
            name: 'markOperations',
            caption: 'Отметить',
            items: [
               { name: 'selectCurrentPage', title: 'Всю страницу'},
               { name: 'removeSelection', title: 'Снять' },
               { name: 'invertSelection', title: 'Инвертировать' }
            ]
         }
      },

      $constructor: function() {
         this.subscribe('onMenuItemActivate', this._onMenuItemActivate);
         this.getParent().getLinkedView().subscribe('onSelectedItemsChange', this._onSelectedItemsChange.bind(this));
      },
      _onMenuItemActivate: function(e, id) {
         this[id]();
      },
      _onSelectedItemsChange: function() {
         var hasMarkOptions = !!this.getItems().getItemsCount(),
            view = this.getParent().getLinkedView(),
            caption,
            selectedCount;
         if (hasMarkOptions) {
            selectedCount = view.getSelectedItems().length;
            caption = selectedCount ? 'Отмечено(' + selectedCount + ')' : 'Отметить';
            this.setCaption(caption);
         }
         this.setVisible(hasMarkOptions)
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