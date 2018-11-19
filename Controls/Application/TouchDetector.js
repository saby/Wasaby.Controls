define('Controls/Application/TouchDetector', [
   'Core/Control',
   'wml!Controls/Application/TouchDetector/TouchDetector',
   'Core/compatibility',
   'Controls/Context/TouchContextField'
], function(
   Control,
   template,
   compatibility,
   TouchContextField
) {
   var
      _private = {
         moveInRow: 1,

         //При инициализации необходимо корректно проставить значение, далее значение определяется в зависимости от событий
         state: compatibility.touch,

         lastState: compatibility.touch
      };
   return Control.extend({

      _template: template,

      _updateTouchObject: function() {
         if (_private.state !== _private.lastState) {
            this._touchObjectContext.setIsTouch(_private.state);
            _private.lastState = _private.state;
         }
      },

      _beforeMount: function() {
         this._touchObjectContext = new TouchContextField(_private.state);
      },

      touchHandler: function() {
         _private.state = true;
         this._updateTouchObject();
         _private.moveInRow = 0;
      },

      moveHandler: function() {
         if (_private.moveInRow > 0) {
            _private.state = false;
            this._updateTouchObject();
         }
         _private.moveInRow++;
      },

      isTouch: function() {
         return _private.state;
      },

      getClass: function() {
         return _private.state ? 'ws-is-touch' : 'ws-is-no-touch';
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
