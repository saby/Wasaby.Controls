define('Controls/Application/TouchDetector', [
   'UI/Base',
   'wml!Controls/Application/TouchDetector/TouchDetector',
   'Env/Touch',
   'Controls/context'
], function(
   Base,
   template,
   Env,
   cContext
) {
   return Base.Control.extend({
      _template: template,

      _beforeMount: function() {
         this._touchDetector = Env.TouchDetect.getInstance();
         this._touchObjectContext = new cContext.TouchContextField(this._touchDetector.isTouch());
         this._touchChangedHandler = this._touchChangedHandler.bind(this);
         this._touchDetector.subscribe('touchChanged', this._touchChangedHandler);
      },
      _beforeUnmount: function() {
         this._touchDetector.unsibescribe('touchChanged', this._touchChangedHandler);
      },
      _touchChangedHandler: function(event, value){
         this._touchObjectContext.setIsTouch(value);
      },

      isTouch: function() {
         return this._touchDetector.isTouch();
      },

      getClass: function() {
         return this._touchDetector.getClass();
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
