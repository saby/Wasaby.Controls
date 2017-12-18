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
         notifyOnResult: function (args) {
            this._notify('onResult', args);
         }
      });

      return Controller;
   }
);