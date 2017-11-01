define('js!Controls/Input/Search',
   [
      'js!Controls/Input/Text',
      'tmpl!Controls/Input/Search/searchTextBoxButtons'
   ], function(TextBox, searchTextBoxButtons) {

      /**
       * Строка поиска с кнопкой
       * @class Controls/Input/Search
       * @extends Controls/Input/Text
       * @control
       * @public
       * @category Input
       */

      /**
       * @name Controls/Input/Search#startCharacter
       * @cfg {Number} Минимальное количество символов для отображения автодополнения
       */

      /**
       * @event Controls/Input/Search#search Происходит при нажатии на кнопку поиска
       */

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