define('Controls/interface/IRemovable', [], function() {


   /**
    * Interface for item removal in collections.
    *
    * @interface Controls/interface/IRemovable
    * @public
    * @author Волоцкой В.Д.
    */

   /**
    * @event Controls/interface/IRemovable#beforeItemsRemove Fires before items are removed.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of identifiers of items to be removed.
    * @returns {*} result If result=false then canceled the logic of removing the items by default.
    */

   /**
    * @event Controls/interface/IRemovable#afterItemsRemove Fires after items were removed.
    * @param {Core/EventObject} eventObject The event descriptor.
    * @param {Array.<String>|Array.<Number>} idArray Array of identifiers of removed items.
    * @param {*} result The result of item removal from the data source.
    */

   /**
    * Removes items from the data source by identifiers of the items in the collection.
    * @function Controls/interface/IRemovable#removeItems
    * @param {Array} items Array with the identifiers of the items in the collection.
    */

});
