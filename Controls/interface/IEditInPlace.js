define('Controls/interface/IEditInPlace', [
], function() {

   /**
    * Interface for components that have edit in place.
    *
    * @interface Controls/interface/IEditInPlace
    * @public
    */

   /**
    * @typedef {Object} ItemEditOptions
    * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
    */

   /**
    * @typedef {String|WS.Data/Entity/Record|Core/Deferred} ItemEditResult
    * @variant {String} Cancel Cancel start of editing.
    * @variant {ItemEditOptions} options Options of editing.
    * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of edited record. It is necessary to fullfill deferred with a record which will be opened for editing.
    */

   /**
    * @typedef {String|Core/Deferred} ItemEndEditResult
    * @variant {String} Cancel Cancel ending of editing\adding.
    * @variant {Core/Deferred} Deferred Deferred is used for saving with custom logic.
    */

   /**
    * @typedef {Object} AddItemOptions
    * @param {WS.Data/Entity/Record} [options.item] Record with initial data.
    */

   /**
    * @typedef {String|Core/Deferred|AddItemOptions} AddItemResult
    * @variant {String} Cancel Cancel start of adding.
    * @variant {AddItemOptions} Options of adding.
    * @variant {Core/Deferred} Deferred Deferred is used for asynchronous preparation of adding record. It is necessary to fullfill deferred with options of adding.
    */

   /**
    * @event Controls/interface/IEditInPlace#beforeItemEdit Happens before start of editing.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {ItemEditOptions} item Options of editing.
    * @returns {BeforeItemEditResult}
    */

   /**
    * @event Controls/interface/IEditInPlace#beforeItemAdd Happens before start of adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {AddItemOptions} Options of adding.
    * @returns {AddItemResult}
    */

   /**
    * @event Controls/interface/IEditInPlace#afterItemEdit Happens after start of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    */

   /**
    * @event Controls/interface/IEditInPlace#beforeItemEndEdit Happens before the end of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Boolean} commit If it is true editing ends with saving.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    * @returns {ItemEndEditResult}
    */

   /**
    * @event Controls/interface/IEditInPlace#afterItemEndEdit Happens after the end of editing\adding.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {WS.Data/Entity/Record} item Editing record.
    * @param {Boolean} isAdd Flag which allows to differentiate between editing and adding.
    */

   /**
    * @cfg {Object} editingConfig
    * @name Controls/interface/IEditInPlace#editingConfig Configuration for editing in place.
    * @property {Boolean} [editingConfig.editOnClick=false] If true, click on list item starts editing in place.
    * @property {Boolean} [editingConfig.autoAdd=false] If true, after the end of editing of the last list item, new item adds automatically and its editing begins.
    * @property {Boolean} [editingConfig.singleEdit=false] If true, after the end of editing of any list item but the last, editing of the next list item begins automatically.
    * @property {Boolean} [editingConfig.showToolbar=false] If true, item actions will be shown while editing.
    * @property {WS.Data/Entity/Record} editingConfig.item If present, editing of this item will begin on first render.
    */

});
