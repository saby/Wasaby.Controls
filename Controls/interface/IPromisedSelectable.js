define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Selection interface for collections with unknown number of items.
    *
    * @interface Controls/interface/IPromisedSelectable
    * @public
    */

   /**
    * @typedef {Object} Selection
    * @param {Array} selection.selected Array of selected keys.
    * @param {Array} selection.excluded Array of excluded keys.
    */

   /**
    * @name Controls/interface/IPromisedSelectable#selectedKeys
    * @cfg {Array} Array of selected items' keys.
    * @variant [null] Everything selected.
    * @variant [] Nothing selected.
    */

   /**
    * @name Controls/interface/IPromisedSelectable#excludedKeys
    * @cfg {Array} Array of keys for items that should be excluded from the selection.
    */

   /**
    * Returns selection.
    * @function Controls/interface/IPromisedSelectable#getSelection
    * @returns {Selection} Selection.
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectionChanged Occurs when selection was changed.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Selection} Selection.
    */

});
