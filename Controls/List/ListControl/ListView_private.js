/**
 * Created by kraynovdo on 08.11.2017.
 */
define('js!Controls/List/ListControl/ListView_private', [
   'js!Controls/List/resources/utils/ItemsUtil'
], function(ItemsUtil){
   return {
      calcSelectedItem: function(newOptions) {
         if (newOptions.selectedKey !== undefined) {
            this._selectedItem = ItemsUtil.getDisplayItemById(this._display, newOptions.selectedKey, newOptions.idProperty);
         }
         else {
            this._selectedItem = null;
         }


         //TODO надо вычислить индекс
         /*if(!this._selectedItem) {
          if (!this._selectedIndex) {
          this._selectedIndex = 0;//переводим на первый элемент
          }
          else {
          this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
          }
          this._selectedItem = this._display.at(this._selectedIndex);
          }*/
      }
   }
});