define('Controls/interface/IBreadCrumbs', [
], function() {

   /**
    * Interface for breadcrumbs.
    *
    * @interface Controls/interface/IBreadCrumbs
    * @public
    * @author Зайцев А.С.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#items
    * @cfg {Array.<Object>} Array of breadcrumbs to draw.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#keyProperty
    * @cfg {String="id"} Name of the item property that uniquely identifies collection item.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#parentProperty
    * @cfg {String} Name of the field that contains information about parent node..
    */

   /**
    * @name Controls/interface/IBreadCrumbs#displayProperty
    * @cfg {String="title"} Name of the item property which content will be displayed.
    */

   /**
    * @event Controls/interface/IBreadCrumbs#itemClick Happens after clicking on breadcrumb.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {String} itemId Key of the clicked item.
    */

});
