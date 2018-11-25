define('Controls/interface/IEditableList', [
], function() {

   /**
    * Interface for lists that have editing. The difference between this interface and {@link Controls/EditableArea Controls/EditableArea} is that the former is used in lists and the latter is used outside of them (e.g., in tabs).
    *
    * @interface Controls/interface/IEditableList
    * @public
    * @author Зайцев А.С.
    * @see Controls/EditableArea
    */

   /**
    * @typedef {Object} ItemEditOptions
    * @property {WS.Data/Entity/Record} [options.item] Record with initial data.
    */

   /**
    * @typedef {Object} EditingConfig
    * @property {Boolean} [editingConfig.editOnClick=false] If true, click on list item starts editing in place.
    * @property {Boolean} [editingConfig.autoAdd=false] If true, after the end of editing of the last list item, new item adds automatically and its editing begins.
    * @property {Boolean} [editingConfig.sequentialEditing=false] If true, after the end of editing of any list item other than the last, editing of the next list item starts automatically.
    * @property {Boolean} [editingConfig.toolbarVisibility=false] Determines whether buttons 'Save' and 'Cancel' should be displayed.
    * @property {WS.Data/Entity/Record} [editingConfig.item=undefined] If present, editing of this item will begin on first render.
    */

   /**
    * @typedef {String|WS.Data/Entity/Record|Core/Deferred} ItemEditResult
    * @variant {String} Cancel Cancel start of editing.
    * @variant {ItemEditOptions} options Options of editing.
    * @variant {Core/Deferred} Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with {@link ItemEditOptions ItemEditOptions} or 'Cancel'. If deferred takes too long to resolve then loading indicator will be shown.
    */

   /**
    * @typedef {String|Core/Deferred} EndEditResult
    * @variant {String} Cancel Cancel ending of editing\adding.
    * @variant {Core/Deferred} Deferred is used for saving with custom logic.
    */

   /**
    * @event Controls/interface/IEditableList#beforeBeginEdit Happens before the start of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {ItemEditOptions} options Options of editing.
    * @param {Boolean} isAdd
    * @returns {ItemEditResult}
    * @remark
    * You should handle this event if you want to show one item but edit another. For example, you may want to add some fields to it which are not shown in reading mode.
    * Don't update your UI in the handler of this event because if an error happens during preparation of data you'll have to rollback your changes.
    * Note that editing\adding can start not only after the calling of corresponding methods but also in response to user actions (e.g., after the user has clicked on list item). See {@link editingConfig editingConfig} for more info on how to configure responses to user actions.
    * @example
    * The following example shows how to prevent editing of an element if it matches condition:
    * WML:
    * <pre>
    *    <Controls.List on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, options) {
    *       if (options.item.getId() === 1) {
    *          return EditConstants.CANCEL;
    *       }
    *    }
    * </pre>
    * The following example shows how to read item from BL and open it for editing.
    * WML:
    * <pre>
    *    <Controls.List on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, options) {
    *       return this.source.read(options.item.getId()).addCallback(function(result) {
    *          return {
    *             item: result
    *          };
    *       });
    *    }
    * </pre>
    * The following example shows how to start editing with an item created on the client.
    * WML:
    * <pre>
    *    <Controls.List on:beforeBeginEdit="beforeBeginEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeBeginEditHandler: function(e, options) {
    *       return {
    *          item: new Model({
    *             rawData: {
    *                //Obviously, you would use something else instead of Date.now() to generate id, but we'll use it here to keep the example simple
    *                id: Date.now(),
    *                title: ''
    *             }
    *          })
    *       }
    *    }
    * </pre>
    * @see afterBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    * @see editingConfig
    */

   /**
    * @event Controls/interface/IEditableList#afterBeginEdit Happens after the start of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @remark
    * This event is useful if you want to do something after the editing has started, for example hide an add button.
    * The main difference between this event and {@link beforeBeginEdit beforeBeginEdit} is that this event fires when the preparation of the data has successfully finished and it is safe to update your UI.
    * @example
    * The following example shows how to hide the add button after the start of editing\adding.
    * WML:
    * <pre>
    *    <Controls.List on:afterBeginEdit="afterBeginEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.List.AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterBeginEditHandler: function(e, item, isAdd) {
    *       this.showAddButton = false;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see beforeEndEdit
    * @see afterEndEdit
    */

   /**
    * @event Controls/interface/IEditableList#beforeEndEdit Happens before the end of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Editing record.
    * @param {Boolean} willSave Determines whether changes to editing item will be saved.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @returns {EndEditResult}
    * @remark
    * This event is useful if you want to validate data and cancel if needed or if you want to handle saving yourself. By default, list's update method will be called to save changes.
    * Don't update your UI in the handler of this event because if an error happens during preparation of data you'll have to rollback your changes.
    * @example
    * The following example shows how to prevent the end of editing of an element if it matches condition:
    * WML:
    * <pre>
    *    <Controls.List on:beforeEndEdit="beforeEndEditHandler()" />
    * </pre>
    * JS:
    * <pre>
    *    beforeEndEditHandler: function(e, item, commit, isAdd) {
    *       if (!item.get('text').length) {
    *          return EditConstants.CANCEL;
    *       }
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEdit
    * @see afterEndEdit
    */

   /**
    * @event Controls/interface/IEditableList#afterEndEdit Happens after the end of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @remark
    * This event is useful if you want to do something after the end of editing, for example show an add button.
    * The main difference between this event and {@link beforeEndEdit beforeEndEdit} is that this event fires when the editing has successfully finished and it is safe to update your UI.
    * @example
    * The following example shows how to show the add button after the end of editing\adding.
    * WML:
    * <pre>
    *    <Controls.List on:afterEndEdit="afterEndEditHandler()" />
    *    <ws:if data="{{ showAddButton }}">
    *       <Controls.List.AddButton />
    *    </ws:if>
    * </pre>
    * JS:
    * <pre>
    *    afterEndEditHandler: function() {
    *       this.showAddButton = true;
    *    }
    * </pre>
    * @see beforeBeginEdit
    * @see afterBeginEdit
    * @see beforeEndEdit
    */

   /**
    * @cfg {EditingConfig} editingConfig Configuration for editing in place.
    * @name Controls/interface/IEditableList#editingConfig
    * @example
    * WML:
    * <pre>
    *    <Controls.List>
    *       <ws:editingConfig>
    *          <ws:Object editOnClick="{{true}}" showToolbar="{{true}}" />
    *       </ws:editingConfig>
    *    </Controls.List>
    * </pre>
    */

   /**
    * Starts editing.
    * @function Controls/interface/IEditableList#beginEdit
    * @param {ItemEditOptions} options Options of editing.
    * @returns {Core/Deferred}
    * @remark
    * Use this method in situations when you want to start editing from an unusual location, e.g., from item actions.
    * @example
    * The following example shows how to start editing of an item.
    * WML:
    * <pre>
    *    <Controls.List name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.beginEdit({
    *          item: this._items.at(0)
    *       });
    *    }
    * </pre>
    * @see beginAdd
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Starts adding.
    * @function Controls/interface/IEditableList#beginAdd
    * @param {ItemEditOptions} options Options of adding.
    * @returns {Core/Deferred}
    * @remark
    * If you don't pass the options then {@link WS.Data/Source/ICrud#create create} method of the list's source will be called and the result will be added to the list.
    * @example
    * The following example shows how to start editing of an item.
    * WML:
    * <pre>
    *    <Controls.List name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.beginAdd();
    *    }
    * </pre>
    * @see beginEdit
    * @see commitEdit
    * @see cancelEdit
    */

   /**
    * Ends editing and commits changes.
    * @function Controls/interface/IEditableList#commitEdit
    * @returns {Core/Deferred}
    * @remark
    * Use this method when you want to end editing in response to user action, e.g., when a user tries to close a dialog you'd use this method to save changes.
    * @example
    * The following example shows how to end editing and commit changes.
    * WML:
    * <pre>
    *    <Controls.List name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.commitEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see beginAdd
    * @see cancelEdit
    */

   /**
    * Ends editing and discards changes.
    * @function Controls/interface/IEditableList#cancelEdit
    * @returns {Core/Deferred}
    * @remark
    * Use this method when you want to end editing in response to user action, e.g., when a user clicks on a 'Cancel' button.
    * @example
    * The following example shows how to end editing and discard changes.
    * WML:
    * <pre>
    *    <Controls.List name="list" />
    * </pre>
    * JS:
    * <pre>
    *    foo: function() {
    *       this._children.list.cancelEdit();
    *    }
    * </pre>
    * @see beginEdit
    * @see beginAdd
    * @see commitEdit
    */

});
