/**
 * Input new line key interface
 * @interface Controls/_input/interface/INewLineKey
 * @public
 * @author Волоцкой В.Д.
 */
export default interface INewLineKey {
    readonly _options: {
        /**
         * @name Controls/_input/interface/INewLineKey#newLineKey
         * @cfg {string} The behavior of creating a new line.
         * @variant enter When user presses Enter.
         * @variant ctrlEnter When user presses Ctrl + Enter.
         * @default enter
         */
        newLineKey: 'enter' | 'ctrlEnter';
    }
}