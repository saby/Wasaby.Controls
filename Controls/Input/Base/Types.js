define('Controls/Input/Base/Types', [], function() {
   /**
    * @typedef {Object} SelectionInField
    * @property {Number} start The beginning of the selected portion of the field's text. The value specifies the index of the first selected character.
    * @property {Number} end The end of the selected portion of the field's text. The value specifies the index of the character after the selection.
    * If this value is equal to the value of the start property, no text is selected, but the value indicates the position of the caret (cursor) within the field.
    */

   /**
    * @type {Object} SplitValue
    * @property {String} before Substring preceding the value entered.
    * @property {String} insert Entered value.
    * @property {String} delete Remote value.
    * @property {String} after Substring next the value entered.
    */

   /**
    * @type {String} InputType
    * @variant insert Enter value.
    * @variant delete Delete with help key backspace [ + ctrl] or delete [ + ctrl] with value selection.
    * @variant deleteBackward Delete with help key backspace [ + ctrl] without value selection.
    * @variant deleteForward Delete with help key delete [ + ctrl] without value selection.
    */

   /**
    * @type {Object} DisplayingControl
    * @property {Function} template Control template.
    * @property {Object} [scope] Control template options.
    */
});
