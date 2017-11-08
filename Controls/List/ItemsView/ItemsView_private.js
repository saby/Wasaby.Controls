/**
 * Created by kraynovdo on 08.11.2017.
 */
define('js!Controls/List/ItemsView/ItemsView_private', [], function(){
   return {
      initDisplay: function(items, cfg) {
         if (this._items) {
            //TODO убрать дестрой, проверить утечки памяти
            if (this._display) {
               this._display.destroy();
            }
            this._display = this._createDefaultDisplay(items, cfg);
            this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
         }
      }
   }
});