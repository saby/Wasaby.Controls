define('js!Controls/Input/interface/IInputNumber', [
], function() {

   /**
    * Интерфейс работы числового поля ввода.
    * @mixin Controls/Input/interface/IInputNumber
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputNumber#value
    * @cfg {Number} Значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputNumber#valueChanged Происходит при изменении числа в поле ввода.
    * @param {Number} value Новое значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputNumber#inputCompleted Происходит при завершении ввода.
    * @param {Number} value Новое значение поля.
    */

});