define('Controls/Input/Date/interface/IRangeLink', [
], function() {
   'use strict';

   /**
       * @event Controls/Input/Date/RangeLink#startValueChanged Occurs when field start value was changed.
       * @param {Date} The number that will be projected to the text in the field.
       * @param {String} Value of the field.
       * @remark This event should be used to react to changes user makes in the startValue field.
       * @see Documentation: Inputs
       * @see Documentation: bind
   */

   /**
       * @event Controls/Input/Date/RangeLink#endValueChanged Occurs when field end value was changed.
       * @param {Date} The number that will be projected to the text in the field.
       * @param {String} Value of the field.
       * @remark This event should be used to react to changes user makes in the endValue field.
       * @see Documentation: Inputs
       * @see Documentation: bind
   */

   /**
       * @event Controls/Input/Date/RangeLink#rangeChanged Occurs when start value and end value of field was changed.
       * @param {Date} The number that will be projected to the text in the field.
       * @param {String} Value of the field.
       * @remark This event should be used to react to changes user makes in the startValue and endValue fields.
       * @see Documentation: Inputs
       * @see Documentation: bind
   */
});
