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
            Controller.superclass.constructor.call(this, cfg);
            this._publish('onResult');
         },

         notifyOnResult: function (args) {
            this._notify('onResult', args);
         }
      });

      return Controller;
   }
);