define('Controls/interface/IGroupedView', [
], function() {

   /**
    * Interface for components implementing item grouping.
    *
    * @mixin Controls/interface/IGroupedView
    * @public
    */


   /**
    * @typedef {Object} TItemsGroup
    * @property {Function} method Function that returns group identifier for a given item.
    * @property {String} template Group template.
    */

   /**
    * @name Controls/interface/IGroupedView#itemsGroup
    * @cfg {TItemsGroup} Configuration for item grouping. Includes grouping function and group template.
    */

});
