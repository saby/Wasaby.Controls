import IPaste from "./IPaste";
import IInputTag from "./IInputTag";
import IInputPlaceholder from "./IInputPlaceholder";
import ISelectableInput from "./ISelectableInput";
import IInputTooltip from "./IInputTooltip";
import IInputStyle from "./IInputStyle";
import IInputField from "./IInputField";

/**
 * Interface for Input.Base.
 *
 * @interface Controls/interface/IInputBase
 *
 * @mixes Controls/interface/IPaste
 * @mixes Controls/interface/IInputTag
 * @mixes Controls/interface/IInputField
 * @mixes Controls/interface/IInputPlaceholder
 *
 * @mixes Controls/interface/ISelectableInput
 * @mixes Controls/interface/IInputTooltip
 *
 * @mixes Controls/_interface/IHeight
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_interface/IFontColorStyle
 *
 * @mixes Controls/interface/ICallback
 *
 * @public
 * @author Krasilnikov A.S.
 */
type IInputBase = IPaste & IInputTag & IInputField & IInputPlaceholder & ISelectableInput & IInputTooltip & IInputStyle & {
    readonly _options: {
        /**
         * @name Controls/interface/IInputBase#textAlign
         * @cfg {Enum} Horizontal alignment of the text in field.
         * @variant left - The text are aligned to the left edge of the line box.
         * @variant right - The text are aligned to the right edge of the line box.
         * @default left
         * @example
         * In this example, we align the text to the left.
         * <pre>
         *    <Controls.input:Text textAlign="left"/>
         * </pre>
         */
        textAlign: 'left' | 'right';
        /**
         * @name Controls/interface/IInputBase#autoComplete
         * @cfg {Boolean} Determines whether to use browser-based auto-complete field.
         * @default false
         * @remark
         * true - The browser is allowed to automatically complete the input.
         * false - The browser is not permitted to automatically enter or select a value for this field.
         * Values for auto-complete are taken by the browser from its storage.
         * The field name is used to access them. Therefore, to prevent values stored in one field from being applied to another,
         * the fields must have different names. To do this, we proxy the name of the control to the name of the native field.
         * Therefore, if you use true as the value of the option and do not want to cross the auto-completion values, specify the name of the control.
         * Choose a name based on the scope of the field. For example, for a login and password registration form, it is preferable to use the login and password names.
         * @example
         * In this example, when the field is clicked, a browser menu appears with the previously entered values in this field.
         * <pre>
         *    <Controls.input:Text autoComplete={{true}}/>
         * </pre>
         */
        autoComplete: boolean;
    }
};


export default IInputBase;
