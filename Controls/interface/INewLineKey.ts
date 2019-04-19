/**
 * Input new line key interface
 * @interface Controls/interface/INewLineKey
 * @public
 * @author Журавлев М.С.
 */
interface INewLineKey {
    readonly _options: {
        /**
         * @name Controls/interface/INewLineKey#newLineKey
         * @cfg {string} The behavior of creating a new line.
         * @variant enter When user presses Enter.
         * @variant ctrlEnter When user presses Ctrl + Enter.
         * @default enter
         */
        newLineKey: 'enter' | 'ctrlEnter';
    };
}

export default INewLineKey;
