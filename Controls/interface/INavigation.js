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
    * @typedef {String} NavigationSource
    * @variant position Position-based navigation (cursor).
    * @variant page Page-based navigation.
    */

   /**
    * @typedef {String} NavigationView
    * @variant infinity Infinite scroll.
    * @variant pages Pages with paging control.
    * @variant demand Load next when requested (for example, hasMore button clicked).
    */

   /**
    * @typedef {Object} PositionSourceConfig Source configuration for position-based (cursor) navigation.
    * @property {String|Array} field Field (fields array) used for position-based navigation.
    * @property {String|Array} position Value of field (fields array) used for position-based navigation.
    * @property {String} direction Loading direction.
    * The following values are supported:
    * <ul>
    *    <li><b>after</b> -  loading data after positional record.
    *    <li><b>before</b> -  loading data before positional record.
    *    <li><b>both</b> -  loading data in both directions relative to the positional record.
    * </ul>
    * @property {Number} limit Limit of records requested for a single load.
    */

   /**
    * @typedef {Object} PageSourceConfig Source configuration for page-based navigation.
    * @property {Number} page Loading page number.
    * @property {Number} pageSize Loading page size.
    * @property {Boolean} hasMore If hasMore field has false value, similar parameter is added to request. In response instead of receiving a flag for the presence of records (boolean value), the total count of records is expected (number value).
    */

   /**
    * @typedef {Object} NavigationViewConfig
    * @property {String} pagingMode Paging display mode.
    * The following values are supported:
    * <ul>
    *    <li><b>direct</b> - paging is displayed in the forward direction: from the first page to the last.</li>
    * </ul>
    */

   /**
    * @typedef {Object} Navigation
    * @property {NavigationSource} source Algorithm with which the data source works.
    * @property {NavigationView} view Visual interface for navigation (paging buttons, etc.).
    * @property {PositionSourceConfig|PageSourceConfig} sourceConfig Configuration for data source.
    * @property {NavigationViewConfig} viewConfig Configuration for navigation view.
    */

   /**
    * @name Controls/interface/INavigation#navigation
    * @cfg {Navigation} List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.)
    * @example
    * In this example, 2 items will be displayed in the list.
    * TMPL:
    * <pre>
    *    <Controls.list:View
    *       keyProperty="id"
    *       source="{{_source}}"
    *       navigation="{{_navigation}}"/>
    * </pre>
    * JS:
    * <pre>
    *    this._source = new Memory({
    *      idProperty: 'id',
    *      data: [
    *         {
    *            id: '1',
    *            title: 'Yaroslavl'
    *         },
    *         {
    *            id: '2',
    *            title: 'Moscow'
    *         },
    *         {
    *            id: '3',
    *            title: 'St-Petersburg'
    *         }
    *      ]
    *    });
    *    this._navigation = {
    *       source: 'page',
    *       view: 'pages',
    *       sourceConfig: {
    *          pageSize: 2,
    *          page: 0
    *       }
    *    };
    * </pre>
    */

});
