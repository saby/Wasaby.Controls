define('Controls/List/interface/IListControl', [
], function() {

   /**
    * Interface for lists.
    *
    * @interface Controls/List/interface/IListControl
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/List/interface/IListControl#contextMenuEnabled
    * @cfg {Boolean} Determines whether context menu should be shown on right-click.
    */

   /**
    * @name Controls/List/interface/IListControl#emptyTemplate
    * @cfg {Function} Template for the empty list.
    */

   /**
    * @name Controls/List/interface/IListControl#footerTemplate
    * @cfg {Function} Template that will be rendered below the list.
    */

   /**
    * @typedef {String} ResultsPosition
    * @variant top Show results above the list.
    * @variant bottom Show results below the list.
    */

   /**
    * @typedef {Object} Results
    * @property {Function} template Results template.
    * @property {ResultsPosition} position Results position.
    */

   /**
    * @name Controls/List/interface/IListControl#results
    * @cfg {Results} Results row config.
    */

   /**
    * @typedef {Object} VirtualScrollConfig
    * @property {Number} maxVisibleItems Maximum number of rendered items.
    */

   /**
    * @name Controls/List/interface/IListControl#virtualScrollConfig
    * @cfg {VirtualScrollConfig} Virtual scroll config.
    */

   /**
    * @name Controls/List/interface/IListControl#sorting
    * @cfg {Object} Sorting config (object keys - field names; values - sorting type: 'ASC' - ascending or 'DESC' - descending).
    */

   /**
    * @name Controls/List/interface/IListControl#multiSelectVisibility
    * @cfg {String} Whether multiple selection is enabled.
    * @variant visible Show.
    * @variant hidden Do not show.
    * @variant onhover Show on hover.
    * @default hidden
    */

   /**
    * @typedef {Array} ItemActions
    * @property {String} id Identifier of operation.
    * @property {String} title Operation name.
    * @property {String} icon Operation icon.
    * @property {Number} showType Location of operation.
    * @property {String} style Operation style.
    * @property {String} iconStyle Style operation icons (default | attention | error | done ).
    * @property {Function} handler Operation handler.
    */

   /**
    * @name Controls/List/interface/IListControl#itemActions
    * @cfg {ItemActions[]} item operations
    */

   /**
    * @name Controls/List/interface/IListControl#itemActionsPosition
    * @cfg {String} item operations display type
    * @variant inside
    * @variant outside
    */

   /**
    * @name Controls/List/interface/IListControl#itemActionVisibilityCallback
    * @cfg {function} item operation visibility filter function
    * @param {Object} action
    * @param {Record} item
    * @return {Boolean} action visibility
    */

   /**
    * @name Controls/List/interface/IListControl#markedKey
    * @cfg {Number} Identifier of the marked collection item.
    */

   /**
    * @name Controls/List/interface/IListControl#markerVisibility
    * @cfg {String} Determines when marker is visible.
    * @variant always The marker is always displayed, even if the marked key entry is not specified.
    * @variant '' Behavior not defined.
    * @default ''
    */

   /**
    * @name Controls/List/interface/IListControl#uniqueKeys
    * @cfg {String} Strategy for loading new list items.
    * @variant true Merge, items with the same identifier will be combined into one.
    * @variant false Add, items with the same identifier will be shown in the list.
    */

   /**
    * @name Controls/List/interface/IListControl#itemsReadyCallback
    * @cfg {Function} Callback function that will be called when list data instance is ready.
    */

   /**
    * @name Controls/List/interface/IListControl#dataLoadCallback
    * @cfg {Function} Callback function that will be called when list data loaded by source
    */

   /**
    * @name Controls/List/interface/IListControl#dataLoadErrback
    * @cfg {Function} Callback function that will be called when data loading fail
    */

   /**
    * @function Controls/List/interface/IListControl#reload
    * Reloads list data and view.
    */

   /**
    * @function Controls/List/interface/IListControl#reloadItem
    * Loads model from data source, merges changes into the current data and renders the item.
    */

   /**
    * @function Controls/List/interface/IListControl#scrollToTop
    * Scrolls list to the top.
    */

   /**
    * @function Controls/List/interface/IListControl#scrollToBottom
    * Scrolls list to the bottom.
    */

   /**
    * @function Controls/List/interface/IListControl#scrollToItem
    * Scrolls list to the specified item.
    */

   /**
    * @event Controls/List/interface/IListControl#itemClick Occurs when list item is clicked.
    */

   /**
    * @event Controls/List/interface/IListControl#hoveredItemChanged The event fires when the user hovers over a list item with a cursor.
    */

   /**
    * @event  Controls/List/interface/IListControl#markedKeyChanged Occurs when list item was selected (marked).
    * @param {Number} key Key of the selected item.
    */
});
