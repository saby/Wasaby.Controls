define('Controls/Application/TouchDetector', [
   'Core/Control',
   'wml!Controls/Application/TouchDetector/TouchDetector',
   'Controls/Application/TouchDetectorController'
], function(
   Control,
   template,
   Controller
) {
   return Control.extend({
      _template: template,

      _beforeMount: function() {
         this._touchController = new Controller();
         this._touchController.createContext();
      },

      touchHandler: function() {
         this._touchController.touchHandler();
      },

      moveHandler: function() {
         this._touchController.moveHandler();
      },

      isTouch: function() {
         this._touchController.isTouch();
      },

      getClass: function() {
         this._touchController.getClass();
      },

      // Объявляем функцию, которая возвращает поля Контекста и их значения.
      // Имя функции фиксировано.
      _getChildContext: function() {
         // Возвращает объект.
         return {
            isTouch: this._touchObjectContext
         };
      }
   });
});
