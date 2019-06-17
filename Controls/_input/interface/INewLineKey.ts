/**
 * Input new line key interface
 * @interface Controls/_input/interface/INewLineKey
 * @public
 * @author Krasilnikov A.S.
 */
interface INewLineKey {
    readonly _options: {
        /**
         * @name Controls/_input/interface/INewLineKey#newLineKey
         * @cfg {Enum} The behavior of creating a new line.
         * @variant enter When user presses Enter.
         * @variant ctrlEnter When user presses Ctrl + Enter.
         * @default enter
         */
        newLineKey: 'enter' | 'ctrlEnter';
    };
}

export default INewLineKey;
