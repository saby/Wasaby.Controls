define('js!Controls/Input/interface/IInputDateTime', [
], function() {

   /**
    * Интерфейс работы поля ввода даты и времени.
    * @mixin Controls/Input/interface/IInputDateTime
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputDateTime#value
    * @cfg {Date} Значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#valueChanged Происходит при изменении числа в поле ввода.
    * @param {Date} value Новое значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#inputCompleted Происходит при завершении ввода.
    * @param {Date} value Новое значение поля.
    */

});