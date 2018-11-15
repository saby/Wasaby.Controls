define('Controls/Input/interface/IPaste', [], function() {

   /**
    * Interface for paste text to input.
    *
    * @interface Controls/Input/interface/IPaste
    * @public
    * @author Колесова П.С.
    */

   /**
    * @name Controls/Input/interface/IPaste#paste
    * @function
    * @description Paste text into the field.
    * @param {String} text The text to replace.
    * @remark
    * If the text is not selected, the line is inserted at the carriage position.
    * @example
    * In this example, we click on the button to add a smile to the field.
    * <pre>
    *    <Controls.Input.Text name="message" bind:value="_inputValue"/>
    *    <Controls.Button on:click="_pasteButtonClick(smile)"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _inputValue: '',
    *
    *       _pasteButtonClick(smile) {
    *           this._children.message.paste(smile);
    *       }
    *       ...
    *    });
    * </pre>
    */
});
