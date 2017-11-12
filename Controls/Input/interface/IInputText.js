define('js!Controls/Input/interface/IInputText', [
], function() {

   /**
    * Интерфейс работы текстового поля ввода.
    *
    * @mixin Controls/Input/interface/IInputText
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputText#value
    * @cfg {String} Значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputText#valueChanged Происходит при изменении текста в поле ввода.
    * @param {String} value Новое значение поля.
    */

   /**
    * @event Controls/Input/interface/IInputText#inputCompleted Происходит при завершении ввода.
    * @param {String} value Новое значение поля.
    */
});