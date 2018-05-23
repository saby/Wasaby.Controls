define('Controls/interface/IMultiSelectable', [
], function() {

   /**
    * Interface for item selection in list.
    *
    * @mixin Controls/interface/IMultiSelectable
    * @public
    */

   /**
    * @name Controls/interface/IMultiSelectable#selectedKeys
    * @cfg {Array} Array of selected items' keys.
    * @variant [null] Everything selected.
    * @variant [] Nothing selected.
    */

   /**
    * @event Controls/interface/IMultiSelectable#selectedKeysChanged Occurs when selected keys were changed.
    * @param {Array} keys Array of selected items' keys.
    * @param {Array} added Array of added keys in selection.
    * @param {Array} deleted Array of deleted keys in selection.
    */
});
