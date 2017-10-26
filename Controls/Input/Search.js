define('js!Controls/Input/Search',
[
   'js!Controls/Input/Text',
   'tmpl!Controls/Input/Search/searchTextBoxButtons'
], function(TextBox, searchTextBoxButtons) {
   var SearchTextBox = TextBox.extend({
      _afterFieldWrapper: searchTextBoxButtons,
      _searchText: '',
      //Чтобы событие onReset не отправлялось непрерывно
      _onResetIsFired: false,
      //TODO: Зуев обещал в сентябре сделать нормально
      _classes: 'controls-SearchForm',

      _onResetClick: function(e) {
         if(!this._onResetIsFired) {
            this._notify('onReset');
            this._onResetIsFired = true;
         }
      },

      _onSearchClick: function(e) {

      }
   });

   return SearchTextBox;
});