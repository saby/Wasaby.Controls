define('js!Controls/Popup/Controller',
   [
      'Core/Control',
      'Core/Deferred'
   ],
   function (Abstract, Deferred) {

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
            this.resultDef = new Deferred();
            this._options = cfg;
         },

         notifyOnResult: function (result) {
            // пока убираем поджег деферреда, непонятно что делать в ситуации, когда с одного попапа несколько раз
            // кидается on:result
            // this.resultDef.callback(result);
            if( this._options.eventHandlers && this._options.eventHandlers.onResult ){
               this._options.eventHandlers.onResult(result);
            }
         }
      });

      return Controller;
   }
);