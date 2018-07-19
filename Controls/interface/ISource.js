define('Controls/interface/ISource', [
], function() {

   /**
    * Interface for components that use data source.
    *
    * @interface Controls/interface/ISource
    * @public
    */

   /**
    * @name Controls/interface/ISource#source
    * @cfg Object that implements ISource interface for data access.
    */

   /**
    * @name Controls/interface/ISource#itemTemplate
    * @cfg {Function} Template for item render.
    */

   /**
    * @name Controls/interface/ISource#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

   /**
    * @name Controls/interface/ISource#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render. If not set, itemTemplate is used instead.
    */

});
