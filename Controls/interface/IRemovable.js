define('Controls/interface/IRemovable', [], function() {


   /**
    * Interface for remove instances from collection
    *
    * @mixin Controls/interface/IRemovable
    * @public
    */

   /**
    * @event Controls/interface/IRemovable#beforeItemsRemove Fires before items are removed.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of identifiers of removable items.
    * @returns {*} result If result=false then canceled the logic of removing the items by default.
    */

   /**
    * @event Controls/interface/IRemovable#afterItemsRemove Fires after items are removed.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of identifiers of removable items.
    * @param {*} result The result of removing items from the data source.
    */

   /**
    * @function Controls/interface/IRemovable#removeItems Removes items from the data source by identifiers of the items in the collection.
    * @param {Array} items Array with the identifiers of the items in the collection.
    */

});
