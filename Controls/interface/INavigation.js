define('Controls/interface/INavigation', [
], function() {

   /**
    * Interface for list navigation.
    *
    * @interface Controls/interface/INavigation
    * @public
    * @author Крайнов Д.О.
    */

   /**
    * @typedef {String} ListNavigationSource
    * @variant position Position-based navigation (cursor).
    * @variant offset Offset-based navigation.
    * @variant page Page-based navigation.
    */

   /**
    * @typedef {String} ListNavigationView
    * @variant infinity Infinite scroll.
    * @variant pages Pages with aging control.
    * @variant demand Load next when requested (button clicked).
    */

   /**
    * @typedef {Object} ListNavigationPositionSourceConfig
    * @property {String} field Field used for position-based navigation.
    * @property {String} direction Direction.
    */

   /**
    * @typedef {Object} ListNavigationOffsetSourceConfig
    * @property {Number} limit Number of items in data portion.
    */

   /**
    * @typedef {Object} ListNavigationInfinityViewConfig
    * @property {String} pagingMode Paging display mode.
    */

   /**
    * @typedef {Object} ListNavigationPagesViewConfig
    * @property {Boolean} pagesCountSelector Configure number of items on a page.
    */

   /**
    * @typedef {Object} ListNavigation
    * @property {ListNavigationSource} source Type of data source.
    * @property {ListNavigationView} view Visual interface for navigation (paging buttons, etc.)
    * @property {ListNavigationPositionSourceConfig|ListNavigationOffsetSourceConfig} sourceConfig Configuration for data source.
    * @property {ListNavigationInfinityViewConfig|ListNavigationPagesViewConfig} viewConfig Configuration for navigation view.
    */

   /**
    * @name Controls/interface/INavigation#navigation
    * @cfg {ListNavigation} List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.)
    */

});
