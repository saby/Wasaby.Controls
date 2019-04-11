/**
 * Interface for Input.Base.
 *
 * @interface Controls/_input/interface/IInputBase
 *
 * @mixes Controls/_input/interface/IInputTag
 * @mixes Controls/_input/interface/IInputPlaceholder
 *
 * @mixes Controls/_input/interface/ISelectableInput
 * @mixes Controls/_input/interface/IInputTooltip
 * @mixes Controls/_input/interface/IInputStyle
 *
 * @mixes Controls/_input/Base/Styles
 * @mixes Controls/_input/Render/Styles
 *
 * @public
 * @author Журавлев М.С.
 */

/**
 * @name Controls/_input/interface/IInputBase#size
 * @cfg {String} Field size.
 * @variant s - The size of a small field.
 * @variant m - The size of a medium field.
 * @variant l - The size of a large field.
 * @variant default - The size of a standard field.
 * @default default
 * @remark
 * The size is selected depending on the context of the value in the field.
 */

/**
 * @name Controls/_input/interface/IInputBase#fontStyle
 * @cfg {String} Fonts of the text in field.
 * @variant default - Font style in standard field.
 * @variant primary - Font style to attract attention.
 * @default default
 * @remark
 * The font style is selected depending on the context of the value in the field.
 * @example
 * In this example, we create a form for input passport data. Fields for entering your name have accent font.
 * <pre>
 *    <div class="form">
 *       <div class="fio">
 *          <Controls.input:Text name="firstName" font="primary"/>
 *          <Controls.input:Text name="lastName" font="primary"/>
 *       </div>
 *       <div class="residence">
 *          <Controls.input:Text name="street"/>
 *       </div>
 *    </div>
 * </pre>
 */

/**
 * @name Controls/_input/interface/IInputBase#textAlign
 * @cfg {String} Horizontal alignment of the text in field.
 * @variant left - The text are aligned to the left edge of the line box.
 * @variant right - The text are aligned to the right edge of the line box.
 * @default left
 * @example
 * In this example, we align the text to the left.
 * <pre>
 *    <Controls.input:Text textAlign="left"/>
 * </pre>
 */

/**
 * @name Controls/_input/interface/IInputBase#autoComplete
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
