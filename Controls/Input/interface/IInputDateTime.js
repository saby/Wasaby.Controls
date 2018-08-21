define('Controls/Input/interface/IInputDateTime', [
], function() {

   /**
    * Interface for date/time inputs.
    *
    * @interface Controls/Input/interface/IInputDateTime
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputDateTime#value
    * @cfg {Date} Field value.
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#valueChanged Occurs when field value was changed.
    * @param {Date} value New field value.
    */

   /**
    * @event Controls/Input/interface/IInputDateTime#inputCompleted Occurs when input was completed.
    * @param {Date} value Field value.
    */

});
