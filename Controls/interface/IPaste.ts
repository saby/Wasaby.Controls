/**
 * Интерфейс для поддержки вставки значения в поле ввода.
 *
 * @interface Controls/interface/IPaste
 * @public
 * @author Красильников А.С.
 */

/*
 * The interface for paste a value to input.
 *
 * @interface Controls/interface/IPaste
 * @public
 * @author Красильников А.С.
 */
interface IPaste {
    /**
     * @name Controls/interface/IPaste#paste
     * @function
     * @description Вставить значение в поле ввода.
     * @param {String} value Заменяемое значение.
     * @remark
     * Если значение не выбрано, строка вставляется в положение каретки.
     * @example
     * В этом примере мы кликаем по кнопке, чтобы добавить смайлик в поле ввода.
     * <pre>
     *    <Controls.input:Text name="message" bind:value="_inputValue"/>
     *    <Controls.Button on:click="_pasteButtonClick(smile)"/>
     * </pre>
     *
     * <pre>
     *   Control.extend({
     *      ...
     *      _inputValue: '',
     *
     *      _pasteButtonClick(smile) {
     *         this._children.message.paste(smile);
     *      }
     *      ...
     *   });
     * </pre>
     */

    /*
     * @name Controls/interface/IPaste#paste
     * @function
     * @description Paste value into the field.
     * @param {String} value The value to replace.
     * @remark
     * If the value is not selected, the line is inserted at the carriage position.
     * @example
     * In this example, we click on the button to add a smile to the field.
     * <pre>
     *    <Controls.input:Text name="message" bind:value="_inputValue"/>
     *    <Controls.Button on:click="_pasteButtonClick(smile)"/>
     * </pre>
     *
     * <pre>
     *   Control.extend({
     *      ...
     *      _inputValue: '',
     *
     *      _pasteButtonClick(smile) {
     *         this._children.message.paste(smile);
     *      }
     *      ...
     *   });
     * </pre>
     */
    paste: (value: string) => void;
}

export default IPaste;
