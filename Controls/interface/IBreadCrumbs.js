define('Controls/interface/IBreadCrumbs', [
], function() {

   /**
    * Interface for breadcrumbs.
    *
    * @mixin Controls/interface/IBreadCrumbs
    * @public
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
    * @name Controls/interface/IBreadCrumbs#displayProperty
    * @cfg {String="title"} Name of the item property which content will be displayed.
    */

   /**
    * @event Controls/interface/IBreadCrumbs#beforeItemEdit Happens after clicking on breadcrumb.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} item Clicked item.
    */

});
