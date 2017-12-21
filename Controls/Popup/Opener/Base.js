define('js!Controls/Popup/Opener/Base',
   [
      'Core/Control',
      'js!Controls/Popup/Manager',
      'Core/core-merge',
      'js!Controls/Popup/Controller'
   ],
   function(Control, Manager, CoreMerge, Controller) {
      /**
       * Базовый опенер
       * @category Popup
       * @class Controls/Popup/Opener/Base
       * @control
       * @public
       * @author Лощинин Дмитрий
       */
      var Base = Control.extend({
         open: function(config, opener){
            var
               cfg = config || {};
            CoreMerge(cfg, this._options.popupOptions);
            if (this._popupId) {
               this._popupId = Manager.update(this._popupId, cfg);
            }
            if (!this._popupId) {
               this._controller = new Controller({
                  eventHandlers: {
                     onResult: this._options.onResult
                  }
               });
               this._popupId = Manager.show(cfg, opener || this, this.getStrategy(), this._controller);
            }
         },

         close: function(){
            if( this._popupId ){
               Manager.remove(this._popupId);
            }
         },

         getStrategy: function(){
            return null;
         }
      });
      return Base
   }
);