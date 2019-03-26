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
    * @name Controls/FormController#record
    * @cfg {Types/entity:Model} Sets the entry that produced the data initialization dialogue
    */

   /**
    * @name Controls/FormController#key
    * @cfg {String} The key by which the record will be received
    */

   /**
    * @name Controls/FormController#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item
    */

   /**
    * @name Controls/FormController#isNewRecord
    * @cfg {Boolean} "New record" flag, which means that the record is initialized in the data source, but not saved.
    */

   /**
    * @name Controls/FormController#createMetaData
    * @cfg {Object} Initial values what will be argument of create method called when key option and record option are not exist.
    * Also its default value for create method.
    */

   /**
    * @name Controls/FormController#readMetaData
    * @cfg {Object} Additional meta data what will be argument of read method called when key option is exists.
    * Also its default value for read method.
    */

   /**
    * @name Controls/FormController#destroyMetaData
    * @cfg {Object} Additional meta data what will be argument of destroying of draft record.
    * Also its default value for destroy method.
    */
});
