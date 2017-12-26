define('js!Controls/Popup/Controller',
   [
      'Core/Control'
   ],
   function (Abstract) {

      /**
       *
       * @class Controls/Popup/Controller
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Controller = Abstract.extend({
         constructor: function(cfg){
            this._options = cfg;
         },

         notifyOnResult: function (args) {
            if( this._options.eventHandlers && this._options.eventHandlers.onResult ){
               this._options.eventHandlers.onResult.apply(this, args);
            }
         }
      });

      return Controller;
   }
);