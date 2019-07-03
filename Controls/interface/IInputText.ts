/**
 * Интерфейс для ввода текста.
 *
 * @interface Controls/interface/IInputText
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface for text inputs.
 *
 * @interface Controls/interface/IInputText
 * @public
 * @author Красильников А.С.
 */
interface IInputText {
    readonly _options: {
        /**
         * @name Controls/interface/IInputText#trim
         * @cfg {Boolean} Определяет, следует ли обрезать значение поля после завершения ввода.
         * @default false
         * @remark
         * Строка обрезается только после завершения ввода.
         * Если привязать состояние контрола к значению в поле, состояние будет содержать пробелы при вводе пользователем и будет обрезано только после завершения ввода.
         * true - удаляет пробелы с обоих концов строки по завершении ввода.
         * false - ничего не происходит.
         * @example
         * В этом примере, лишние пробелы с обеих сторон будут обрезаны, когда фокус уйдет из поле.
         * <pre>
         *    <Controls.input:Text trim="{{true}}" bind:value="_fieldValue" on:inputCompleted="_inputCompletedHandler()"/>
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *       ...
         *       _fieldValue: '',
         *
         *       _inputCompletedHandler(value) {
         *          // When event fires, both value and _fieldValue will contain trimmed field value
         *       }
         *       ...
         *    });
         * </pre>
         * @see Controls/interface/IInputText#inputCompleted
         */

        /*
         * @name Controls/interface/IInputText#trim
         * @cfg {Boolean} Determines whether the field value should be trimmed when input is completed.
         * @default false
         * @remark
         * String is trimmed only when input is completed.
         * If you bind control's state to the value in the field, the state will contain spaces when user types, and will be trimmed only when input is completed.
         * true - removes whitespaces from both ends of the string when input is completed.
         * false - does not do anything.
         * @example
         * In this example, extra spaces with both side will be trimmed when the focus leaves the text box.
         * <pre>
         *    <Controls.input:Text trim="{{true}}" bind:value="_fieldValue" on:inputCompleted="_inputCompletedHandler()"/>
         * </pre>
         *
         * <pre>
         *    Control.extend({
         *       ...
         *       _fieldValue: '',
         *
         *       _inputCompletedHandler(value) {
         *          // When event fires, both value and _fieldValue will contain trimmed field value
         *       }
         *       ...
         *    });
         * </pre>
         * @see Controls/interface/IInputText#inputCompleted
         */
        trim: boolean;
        /**
         * @name Controls/interface/IInputText#maxLength
         * @cfg {Number} Максимальное количество символов, которое можно ввести в поле.
         * @remark
         * Если пользователь пытается ввести текст длиннее, чем значение maxLength, контрол будет препятствовать вводу.
         * @example
         * В этом примере в поле можно ввести только 20 символов.
         * <pre>
         *    <Controls.input:Text maxLength="{{20}}"/>
         * </pre>
         */

        /*
         * @name Controls/interface/IInputText#maxLength
         * @cfg {Number} Maximum number of characters that can be entered in the field.
         * @remark
         * If user tries to enter text longer than the value of maxLength, control will prevent input.
         * @example
         * In this example, only 20 characters can be entered in the field.
         * <pre>
         *    <Controls.input:Text maxLength="{{20}}"/>
         * </pre>
         */
        maxLength?: number;
        /**
         * @name Controls/interface/IInputText#constraint
         * @cfg {String} Регулярное выражение для входной фильтрации. Шаблон регулярного выражения - {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_Expressions#special-character-set [xyz]}.
         * @remark
         * Это регулярное выражение применяется к каждому символу, который вводит пользователь.
         * Если введенный символ не соответствует регулярному выражению, он не добавляется в поле.
         * Когда пользователь вставляет в поле 'value' несколько символов, мы проверяем их значения посимвольно и добавляем только те символы, которые соответствуют регулярному выражению.
         * Например, при попытке вставить "1ab2cd" в поле с ограничением "[0-9]", в поле будет вставлено только "12".
         * @example
         * 1. В этом примере пользователь сможет ввести в поле только цифры.
         * <pre>
         *    <Controls.input:Text constraint="[0-9]"/>
         * </pre>
         *
         * 2. В этом примере пользователь сможет ввести в поле только прописные латинские буквы.
         * <pre>
         *    <Controls.input:Text constraint="[A-Z]"/>
         * </pre>
         *
         * 3. В этом примере пользователь сможет ввести в поле только строчные латинские буквы.
         * <pre>
         *    <Controls.input:Text constraint="[a-z]"/>
         * </pre>
         */

        /*
         * @name Controls/interface/IInputText#constraint
         * @cfg {String} Regular expression for input filtration. Regular expression pattern is {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_Expressions#special-character-set [xyz]}.
         * @remark
         * This regular expression is applied to every character that user enters.
         * If entered character doesn't match regular expression, it is not added to the field. When user pastes a value with multiple characters to the field, we check the value characters by characters, and only add the characters that pass regular expression. For example, if you try to paste "1ab2cd" to the field with constraint "[0-9]", only "12" will be inserted in the field.
         * @example
         * 1. In this example, the user will be able to enter only numbers in the field.
         * <pre>
         *    <Controls.input:Text constraint="[0-9]"/>
         * </pre>
         *
         * 2. In this example, the user will be able to enter only uppercase Latin letters in the field.
         * <pre>
         *    <Controls.input:Text constraint="[A-Z]"/>
         * </pre>
         *
         * 3. In this example, the user will be able to enter only lowercase Latin letters in the field.
         * <pre>
         *    <Controls.input:Text constraint="[a-z]"/>
         * </pre>
         */
        constraint?: string;
    };
}

export default IInputText;
