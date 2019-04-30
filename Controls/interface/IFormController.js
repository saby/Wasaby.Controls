define('Controls/interface/IFormController', [
], function() {

   /**
    * Interface for record editing controller
    *
    * @interface Controls/interface/IFormController
    * @public
    * @author Красильников А.С.
    */

   /**
    * @name Controls/interface/IFormController#record
    * @cfg {Types/entity:Model} Record that produced the control initialization data.
    */

   /**
    * @name Controls/interface/IFormController#key
    * @cfg {String} The key by which the record will be received
    */

   /**
    * @name Controls/interface/IFormController#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item
    */

   /**
    * @name Controls/interface/IFormController#isNewRecord
    * @cfg {Boolean} "New record" flag, which means that the record is initialized in the data source, but not saved.
    * If the record is marked isNewRecord flag, when saving the record, the request for BL will be executed, even if the record is not changed.
    * Also when control destroying will be called deleting the record.
    */

   /**
    * @name Controls/interface/IFormController#createMetaData
    * @cfg {Object} Initial values what will be argument of create method called when key option and record option are not exist. More {@link Types/source:ICrud#create}
    * Also its default value for create method.
    */

   /**
    * @name Controls/interface/IFormController#readMetaData
    * @cfg {Object} Additional meta data what will be argument of read method called when key option is exists. More {@link Types/source:ICrud#read}
    * Also its default value for read method.
    */

   /**
    * @name Controls/interface/IFormController#destroyMetaData
    * @cfg {Object} Additional meta data what will be argument of destroying of draft record. More {@link Types/source:ICrud#destroy}
    * Also its default value for destroy method.
    */

   /**
    * Updates a record in the data source
    * @function Controls/interface/IFormController#update
    */

   /**
    * Creates an empty record through a data source
    * @function Controls/interface/IFormController#create
    */

   /**
    * Reads an entry from a data source
    * @function Controls/interface/IFormController#read
    */

   /**
    * Removes an record from the data source
    * @function Controls/interface/IFormController#delete
    */

   /**
    * Starts validating process.
    * @function Controls/interface/IFormController#validate
    * @returns {Core/Deferred} deferred of result of validation
    */

   /**
    * @event Controls/interface/IFormController#createSuccessed Happens when record create successful
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} Editable record
    */
   /**
    * @event Controls/interface/IFormController#createFailed Happens when record create failed
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Error} Error
    */

   /**
    * @event Controls/interface/IFormController#readSuccessed Happens when record read successful
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} Editable record
    */
   /**
    * @event Controls/interface/IFormController#readFailed Happens when record read failed
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Error} Error
    */

   /**
    * @event Controls/interface/IFormController#updateSuccessed Happens when record update successful
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} Editable record
    * @param {String} Editable record key
    */
   /**
    * @event Controls/interface/IFormController#updateFailed Happens when record update failed
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Error} Error
    */

   /**
    * @event Controls/interface/IFormController#deleteSuccessed Happens when record delete successful
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} Editable record
    */
   /**
    * @event Controls/interface/IFormController#deleteFailed Happens when record delete failed
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Error} Error
    */
});
