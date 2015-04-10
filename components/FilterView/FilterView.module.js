/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterView', [
   'js!SBIS3.CONTROLS.ListViewDS',
   'js!SBIS3.CONTROLS.PickerMixin',
   'html!SBIS3.CONTROLS.FilterView',
   'html!SBIS3.CONTROLS.FilterView/resources/FilterViewItemTemplate',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.MenuLink',
   'js!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.MenuButton'
], function(ListView, PickerMixin, dotTplFn, itemDotTpl) {
   var userTpl = '<div class="userClass"><span style="margin-right: 15px;">{{=it.get("cfg").textValue}}</span><span style="color: red;">Это прикладной шаблон</span></div>';
   var userItems = [ {name: '1993', title: '1993'}, {name: '1994', title: '1994'}, {name: '1995', title: '1995'}, {name: '1996', title: '1996'}, {name: '1997', title: '1997'} ];
   var items = [
      { field: 'Наличие', cfg: { textValue: 'В наличии' }},
      { field: 'Тип', cfg: { textValue: 'ТипТип' }, tpl: userTpl },
      { field: 'ГодMenuLink', componentType: 'SBIS3.CONTROLS.MenuLink', cfg: { items: userItems, caption: 'ГодMenuLink' } },
      { field: 'ГодComboBox', componentType: 'SBIS3.CONTROLS.ComboBox', cfg: { items: userItems, caption: 'ГодComboBox' } },
      { field: 'ГодMenuButton', componentType: 'SBIS3.CONTROLS.MenuButton', cfg: { items: userItems, caption: 'ГодMenuButton' } }
   ];

   var FilterButton = ListView.extend([PickerMixin], {
      $protected: {
         _dotTplFn: dotTplFn,
         _itemDotTpl: itemDotTpl,

         _options: {
            linkText: 'Другие фильтры',
            items: items
         },
         _linkButton: undefined
      },
      $constructor: function() {
         this._publish('onClickLink');
         this._bindLinkButton();
      },
      _bindLinkButton: function() {
         var self = this;
         this.waitChildControlByName('FilterViewLink').addCallback(function(instanse){
            self._linkButton = instanse;
            self._linkButton.subscribe('onActivated', self._onLinkActivated.bind(self));
         });
      },
      _onLinkActivated: function() {
         this._notify('onClickLink');
      },
      _getItemTemplate: function () {
         return this._itemDotTpl;
      },
      _drawItemsCallback: function() {

      },
      deleteRecords: function(idArray) {
         /*TODO тут будет не удаление а скрытие видимости, когда появится перерисовка только одной строки*/
         this._dataSet.removeRecord(idArray);
         this._dataSource.sync(this._dataSet);
      }
   });

   return FilterButton;

});