define('Controls/interface/IPromisedSelectable', [
], function() {

   /**
    * Selection interface for collections with unknown number of items.
    *
    * @interface Controls/interface/IPromisedSelectable
    * @public
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
    * Toggle selection.
    * @function Controls/interface/IPromisedSelectable#toggleSelection
    */

   /**
    * @event Controls/interface/IPromisedSelectable#selectedKeysChanged Occurs when selected keys were changed.
    * @param {Array} keys Array of selected items' keys.
    * @param {Array} added Array of added keys in selection.
    * @param {Array} deleted Array of deleted keys in selection.
    */

   /**
    * @event Controls/interface/IPromisedSelectable#excludedKeysChanged Occurs when excluded keys were changed.
    * @param {Array} keys Array of excluded items' keys.
    * @param {Array} added Array of added keys.
    * @param {Array} deleted Array of deleted keys.
    */

});
