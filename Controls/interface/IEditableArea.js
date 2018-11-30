define('Controls/interface/IEditableArea', [
], function() {

   /**
    * Interface for components that have editing of input fields. The difference between {@link Controls/interface/IEditableList Controls/interface/IEditableList} and this interface is that the former is used in lists and the latter is used outside of them (e.g., in tabs).
    *
    * @interface Controls/interface/IEditableArea
    * @public
    * @author Зайцев А.С.
    * @see Controls/interface/IEditableList
    */

   /**
    * @typedef {String} BeforeBeginEditResult
    * @variant {String} Cancel Cancel start of editing.
    */

   /**
    * @typedef {String|Core/Deferred} BeforeEndEditResult
    * @variant {Core/Deferred} Deferred Deferred is used for saving with custom logic.
    * @variant {String} Cancel Cancel ending of editing.
    */

   /**
    * @event Controls/interface/IEditableArea#beforeBeginEdit Happens before start of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} editObject Editing record.
    * @returns {BeforeBeginEditResult}
    * @example
    * The following example creates EditableArea and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.EditableArea on:beforeBeginEdit="beforeBeginEditHandler()" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, record) {
    *       if (this._editable === false) { //Let's say that we want to allow editing only in certain situations.
    *          return EditConstants.CANCEL;
    *       }
    *    }
    * </pre>
    * @see beforeEndEdit
    * @see afterEndEdit
    * @see editObject
    */

   /**
    * @event Controls/interface/IEditableArea#beforeEndEdit Happens before the end of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} editObject Editing record.
    * @param {Boolean} commit If it is true editing ends with saving.
    * @returns {BeforeEndEditResult}
    * @remark
    * This event fires only if the validation was successful. If you return {@link Core/Deferred Core/Deferred} from the event handler then editing will end only if the deferred resolved successfully.
    * @example
    * The following example shows how to cancel the end of the editing if certain condition is met.
    * WML:
    * <pre>
    *    <Controls.EditableArea on:beforeEndEdit="beforeEndEditHandler()" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    beforeEndEditHandler: function(e, record, commit) {
    *       //Let's say that we want to allow saving only if the field "text" is not empty (in this example the exact same effect can be achieved through validation mechanism, but sometimes condition is more complicated).
    *       if (commit && record.get("text").length === 0) {
    *          return EditConstants.CANCEL;
    *       }
    *    }
    * </pre>
    * The following example shows how to handle the event asynchronously.
    * WML:
    * <pre>
    *    <Controls.EditableArea on:beforeEndEdit="beforeEndEditHandler()" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    beforeEndEditHandler: function(e, record, commit) {
    *       if (commit) {
    *          return this._source.update(record);
    *       }
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see afterEndEdit
    * @see editObject
    */

   /**
    * @event Controls/interface/IEditableArea#afterEndEdit Happens after the end of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} editObject Editing record.
    * @example
    * The following example shows how to hide and show an image based on the state of editing.
    * WML:
    * <pre>
    *    <Controls.EditableArea on:beforeBeginEdit="beforeBeginEditHandler()" on:afterEndEdit="afterEndEditHandler()" editObject="{{_editObject}}" />
    *    <ws:if data="{{_imgVisible}}">
    *       <img src="/media/examples/frog.png" alt="Frog"/>
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, record) {
    *       this._imgVisible = false;
    *    },
    *    afterEndEditHandler: function(e, record) {
    *       this._imgVisible = true;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see beforeEndEdit
    * @see editObject
    */

   /**
    * @name Controls/interface/IEditableArea#toolbarVisibility
    * @cfg {Boolean} Determines whether buttons 'Save' and 'Cancel' should be displayed.
    * @default false
    * @example
    * <pre>
    *    <Controls.EditableArea toolbarVisibility="{{true}}" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditableArea#style
    * @cfg {String} Edit at place display style.
    * @default withoutBackground
    * @variant withBackground Background will be shown while editing.
    * @variant withoutBackground Background will not be shown while editing.
    * @remark
    * You are not limited to these 2 styles, you can pass your own string. Then we will set class 'controls-EditableArea_isEditing_style_<your_class>' on the container of EditableArea and you can use it to write your own CSS.
    * @example
    * <pre>
    *    <Controls.EditableArea style="withBackground" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditableArea#editObject
    * @cfg {WS.Data/Entity/Record} Record with initial data.
    * @example
    * <pre>
    *    <Controls.EditableArea editObject="{{_editObject}}" />
    * </pre>
    * @see editObjectChanged
    */

   /**
    * @name Controls/interface/IEditableArea#editWhenFirstRendered
    * @cfg {Boolean} Determines whether editing should start on first render.
    * @default false
    * @remark
    * This option is useful when you want to start editing immediately and do not want to wait for the component to mount. For example, if you want to open modal window and edit something in it, this option will help you avoid blinking.
    * @example
    * <pre>
    *    <Controls.EditableArea editWhenFirstRendered="{{true}}" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditableArea#content
    * @cfg {Function} Template that will be used for editing.
    * @remark
    * If you want content to look exactly as {@link Controls/Input/Text Controls/Input/Text} then you should use {@link Controls/EditableArea/Templates/Editors/Base Controls/EditableArea/Templates/Editors/Base}. If for some reason it doesn't suit you then you can use your own template.
    * @example
    * Using Controls.EditableArea.Templates.Editors.Base:
    * <pre>
    *     <Controls.EditableArea editObject="{{_editObject}}">
    *        <Controls.EditableArea.Templates.Editors.Base bind:value="content.editObject.text">
    *           <ws:editorTemplate>
    *              <Controls.Input.Text />
    *           </ws:editorTemplate>
    *        </Controls.EditableArea.Templates.Editors.Base>
    *     </Controls.EditableArea>
    * </pre>
    * Using custom template:
    * <pre>
    *    <ws:template name="editingTemplate">
    *       <div class="myEditingTemplate">
    *          <ws:if data="{{isEditing}}">
    *             <Controls.Input.Text value="{{editObject.text}}" />
    *          </ws:if>
    *          <ws:else>
    *             <span>{{editObject.text}}</span>
    *          </ws:else>
    *       </div>
    *    </ws:template>
    *    <Controls.EditableArea editObject="{{_editObject}}">
    *       <ws:partial template="editingTemplate" scope="{{content}}" />
    *    </Controls.EditableArea>
    * </pre>
    * @see Controls/EditableArea/Templates/Editors/Base
    */

   /**
    * Starts editing.
    * @function Controls/interface/IEditableArea#beginEdit
    * @example
    * The following example creates EditableArea and shows how to start editing.
    * WML:
    * <pre>
    *    <Controls.EditableArea name="editableArea" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editableArea.beginEdit();
    *    }
    * </pre>
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Ends editing and discards changes.
    * @function Controls/interface/IEditableArea#cancelEdit
    * @example
    * The following example creates EditableArea and shows how to end editing and discard changes.
    * WML:
    * <pre>
    *    <Controls.EditableArea name="editableArea" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editableArea.cancelEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see commitEdit
    */

   /**
    * Ends editing and commits changes.
    * @function Controls/interface/IEditableArea#commitEdit
    * @example
    * The following example creates EditableArea and shows how to end editing and commit changes.
    * WML:
    * <pre>
    *    <Controls.EditableArea name="editableArea" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editableArea.commitEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see cancelEdit
    */
});
