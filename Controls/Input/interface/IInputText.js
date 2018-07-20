define('Controls/Input/interface/IInputText', [
], function() {

   /**
    * Interface for text inputs.
    *
    * @interface Controls/Input/interface/IInputText
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputText#value
    * @cfg {String} Field value.
    */

   /**
    * @event Controls/Input/interface/IInputText#valueChanged Occurs when field value was changed.
    * @param {String} value New field value.
    */

   /**
    * @event Controls/Input/interface/IInputText#inputCompleted Occurs when input was completed.
    * @param {String} value Field value.
    */
});
