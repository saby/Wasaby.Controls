define('Controls/Input/interface/IInputDateTag', [
], function() {

   /**
    * Interface for input tags (colored indicators in the right top corner).
    *
    * @interface Controls/Input/interface/IInputDateTag
    * @public
    * @author Миронов А.Ю.
    */

   /**
    * @name Controls/Input/interface/IInputDateTag#startTagStyle
    * @cfg {String} Style of the tag in start field (colored indicator shown at the top right corner of the field).
    * @variant secondary
    * @variant success
    * @variant primary
    * @variant danger
    * @variant info
    * @remark
    * Tag is used to show some information about the field (e.g. if the field is required). Frequently, Infobox with the tip is shown when you click or hover on the tag (see tagClick, tagHover).
    * @example
    * In this example, the field will be rendered with "danger" to show that it is required. When you click on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range startTagStyle="danger" on:startTagClick="tagClickHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagClickHandler(target) {
    *          this._children.infoboxOpener.open({
    *             target: target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see endTagStyle
    * @see startTagHover
    * @see endTagHover
    * @see startTagClick
    * @see endTagClick
    */

   /**
    * @event Controls/Input/interface/IInputDateTag#startTagClick Occurs when tag in start field was clicked.
    * @param {Object} event Native event object. Can be used to get target (DOM node of the tag) to show Infobox.
    * @remark The event will never fire unless you specify tagStyle option on the field.
    * @example
    * In this example, when you click on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range startTagStyle="danger" on:startTagClick="tagClickHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagClickHandler(event) {
    *          this._children.infoboxOpener.open({
    *             target: event.target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see startTagStyle
    * @see endTagStyle
    * @see startTagHover
    * @see endTagHover
    * @see endTagClick
    */

   /**
    * @event Controls/Input/interface/IInputDateTag#startTagHover Occurs when tag in start field is hovered.
    * @param {Object} event Native event object. Can be used to get target (DOM node of the tag) to show Infobox.
    * @remark The event will never fire unless you specify tagStyle option on the field.
    * @example
    * In this example, when you hover on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range startTagStyle="danger" on:startTagHover="_tagHoverHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagHoverHandler(event) {
    *          this._children.infoboxOpener.open({
    *             target: event.target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see startTagStyle
    * @see endTagStyle
    * @see endTagHover
    * @see startTagClick
    * @see endTagClick
    */

   /**
    * @name Controls/Input/interface/IInputDateTag#endTagStyle
    * @cfg {String} Style of the tag in end field (colored indicator shown at the top right corner of the field).
    * @variant secondary
    * @variant success
    * @variant primary
    * @variant danger
    * @variant info
    * @remark
    * Tag is used to show some information about the field (e.g. if the field is required). Frequently, Infobox with the tip is shown when you click or hover on the tag (see tagClick, tagHover).
    * @example
    * In this example, the field will be rendered with "danger" to show that it is required. When you click on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range endTagStyle="danger" on:endTagClick="tagClickHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagClickHandler(target) {
    *          this._children.infoboxOpener.open({
    *             target: target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see startTagStyle
    * @see startTagHover
    * @see endTagHover
    * @see startTagClick
    * @see endTagClick
    */

   /**
    * @event Controls/Input/interface/IInputDateTag#endTagClick Occurs when tag in end field was clicked.
    * @param {Object} event Native event object. Can be used to get target (DOM node of the tag) to show Infobox.
    * @remark The event will never fire unless you specify tagStyle option on the field.
    * @example
    * In this example, when you click on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range endTagStyle="danger" on:endTagClick="tagClickHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagClickHandler(event) {
    *          this._children.infoboxOpener.open({
    *             target: event.target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see startTagStyle
    * @see endTagStyle
    * @see startTagHover
    * @see endTagHover
    * @see startTagClick
    */

   /**
    * @event Controls/Input/interface/IInputDateTag#endTagHover Occurs when tag in end field is hovered.
    * @param {Object} event Native event object. Can be used to get target (DOM node of the tag) to show Infobox.
    * @remark The event will never fire unless you specify tagStyle option on the field.
    * @example
    * In this example, when you hover on tag, the Infobox with message "This field is required" will be shown.
    * <pre>
    *    <Controls.Input.Date.Range endTagStyle="danger" on:endTagHover="_tagHoverHandler()"/>
    *    <Controls.Opener.Infobox name="infoboxOpener"/>
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _tagHoverHandler(event) {
    *          this._children.infoboxOpener.open({
    *             target: event.target,
    *             text: 'This field is required'
    *          });
    *       }
    *       ...
    *    });
    * </pre>
    * @see startTagStyle
    * @see endTagStyle
    * @see startTagHover
    * @see startTagClick
    * @see endTagClick
    */
});
