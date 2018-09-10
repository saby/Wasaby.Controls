define('Controls/interface/IEditAtPlace', [
], function() {

   /**
    * Interface for components that have editing of input fields. The difference between {@link Controls/interface/IEditInPlace Controls/interface/IEditInPlace} and this interface is that the former is used in lists and the latter is used outside of them (e.g., in tabs).
    *
    * @interface Controls/interface/IEditAtPlace
    * @public
    * @see Controls/interface/IEditInPlace
    */

   /**
    * @typedef {String} BeforeEditResult
    * @variant {String} Cancel Cancel start of editing.
    */

   /**
    * @typedef {String} BeforeEndEditResult
    * @variant {String} Cancel Cancel ending of editing.
    */

   /**
    * @event Controls/interface/IEditAtPlace#beforeEdit Happens before start of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} editObject Editing record.
    * @returns {BeforeEditResult}
    * @example
    * The following example creates EditAtPlace and shows how to handle the event.
    * TMPL:
    * <pre>
    *    <Controls.EditAtPlace on:beforeEdit="beforeEditHandler()" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    beforeEditHandler: function(e, record) {
    *       if (this._editable === false) { //Let's say that we want to allow editing only in certain situations.
    *          return 'Cancel';
    *       }
    *    }
    * </pre>
    * @see beforeEndEdit
    * @see editObject
    */

   /**
    * @event Controls/interface/IEditAtPlace#beforeEndEdit Happens before the end of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} editObject Editing record.
    * @param {Boolean} commit If it is true editing ends with saving.
    * @returns {BeforeEndEditResult}
    * @remark
    * This event fires only if the validation was successful.
    * @example
    * The following example creates EditAtPlace and shows how to handle the event.
    * TMPL:
    * <pre>
    *    <Controls.EditAtPlace on:beforeEndEdit="beforeEndEditHandler()" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    beforeEndEditHandler: function(e, record, commit) {
    *       if (commit && record.get("text").length === 0) { //Let's say that we want to allow saving only if the field "text" is not empty (in this example the exact same effect can be achieved through validation mechanism, but sometimes condition is more complicated).
    *          return 'Cancel';
    *       }
    *    }
    * </pre>
    * @see beforeEdit
    * @see editObject
    */

   /**
    * @name Controls/interface/IEditAtPlace#commitOnDeactivate
    * @cfg {Boolean} Commit changes after losing focus.
    * @default false
    * @remark
    * Even if this option is set to true, changes will be saved and editing will end only if changes are valid.
    * @example
    * <pre>
    *    <Controls.EditAtPlace commitOnDeactivate="{{true}}" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditAtPlace#showToolbar
    * @cfg {Boolean} Determines whether buttons 'Save' and 'Cancel' should be displayed.
    * @default false
    * @example
    * <pre>
    *    <Controls.EditAtPlace showToolbar="{{true}}" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditAtPlace#style
    * @cfg {String} Edit at place display style.
    * @default default
    * @variant withBackground Background will be shown while editing.
    * @variant default Default display style.
    * @remark
    * You are not limited to these 2 styles, you can pass your own string. Then we will set class 'controls-EditAtPlaceV_isEditing_style_<your_class>' on the container of EditAtPlace and you can use it to write your own CSS.
    * @example
    * <pre>
    *    <Controls.EditAtPlace style="withBackground" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditAtPlace#editObject
    * @cfg {WS.Data/Entity/Record} Record with initial data.
    * @example
    * <pre>
    *    <Controls.EditAtPlace editObject="{{_editObject}}" />
    * </pre>
    * @see editObjectChanged
    */

   /**
    * @name Controls/interface/IEditAtPlace#editWhenFirstRendered
    * @cfg {Boolean} Determines whether editing should start on first render.
    * @default false
    * @remark
    * This option is useful when you want to start editing immediately and do not want to wait for the component to mount.
    * @example
    * <pre>
    *    <Controls.EditAtPlace editWhenFirstRendered="{{true}}" editObject="{{_editObject}}" />
    * </pre>
    */

   /**
    * @name Controls/interface/IEditAtPlace#content
    * @cfg {Function} Template that will be used for editing.
    * @remark
    * If you want content to look exactly as {@link Controls/Input/Text Controls/Input/Text} then you should use {@link Controls/EditAtPlace/EditAtPlaceTemplate Controls/EditAtPlace/EditAtPlaceTemplate}. If for some reason it doesn't suit you then you can use your own template.
    * @example
    * Using Controls.EditAtPlace.EditAtPlaceTemplate:
    * <pre>
    *     <Controls.EditAtPlace editObject="{{_editObject}}">
    *        <Controls.EditAtPlace.EditAtPlaceTemplate bind:value="content.editObject.text">
    *           <ws:editorTemplate>
    *              <Controls.Input.Text />
    *           </ws:editorTemplate>
    *        </Controls.EditAtPlace.EditAtPlaceTemplate>
    *     </Controls.EditAtPlace>
    * </pre>
    * Using custom template:
    * <pre>
    *    <ws:template name="editingTemplate">
    *       <div class="myEditingTemplate">
    *          <ws:if data="{{_options.isEditing}}">
    *             <Controls.Input.Text value="{{_options.value}}" />
    *          </ws:if>
    *          <ws:else>
    *             <span>{{_options.value}}</span>
    *          </ws:else>
    *       </div>
    *    </ws:template>
    *    <Controls.EditAtPlace editObject="{{_editObject}}">
    *       <ws:partial template="editingTemplate" bind:value="content.editObject.text" />
    *    </Controls.EditAtPlace>
    * </pre>
    * @see Controls/EditAtPlace/EditAtPlaceTemplate
    */

   /**
    * Starts editing.
    * @function Controls/interface/IEditAtPlace#startEdit
    * @example
    * The following example creates EditAtPlace and shows how to start editing.
    * TMPL:
    * <pre>
    *    <Controls.EditAtPlace name="editAtPlace" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editAtPlace.startEdit();
    *    }
    * </pre>
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Ends editing and discards changes.
    * @function Controls/interface/IEditAtPlace#cancelEdit
    * @example
    * The following example creates EditAtPlace and shows how to end editing and discard changes.
    * TMPL:
    * <pre>
    *    <Controls.EditAtPlace name="editAtPlace" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editAtPlace.cancelEdit();
    *    }
    * </pre>
    * @see startEdit
    * @see commitEdit
    */

   /**
    * Ends editing and commits changes.
    * @function Controls/interface/IEditAtPlace#commitEdit
    * @example
    * The following example creates EditAtPlace and shows how to end editing and commit changes.
    * TMPL:
    * <pre>
    *    <Controls.EditAtPlace name="editAtPlace" editObject="{{_editObject}}" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.editAtPlace.commitEdit();
    *    }
    * </pre>
    * @see startEdit
    * @see cancelEdit
    */
});
