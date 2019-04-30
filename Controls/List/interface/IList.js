define('Controls/List/interface/IList', ['Controls/_list/interface/IList'], function(Control) {
   /**
    * Interface for lists.
    *
    * @interface Controls/_list/interface/IList
    * @private
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/_list/interface/IList#contextMenuVisibility
    * @cfg {Boolean} Determines whether context menu should be shown on right-click.
    * <a href="/materials/demo-ws4-list-item-actions">Example</a>.
    * @default true
    */

   /**
    * @name Controls.list:View/interface/IList#emptyTemplate
    * @cfg {Function} Template for the empty list.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    * @remark
    * We recommend to use default template for emptyTemplate: wml!Controls/_list/emptyTemplate
    * The template accepts the following options:
    * - contentTemplate content of emptyTemplate
    * - topSpacing Spacing between top border and content of emptyTemplate
    * - bottomSpacing Spacing between bottom border and content of emptyTemplate
    * @example
    * <pre>
    *    <Controls.list:View>
    *       <ws:emptyTemplate>
    *          <ws:partial template="wml!Controls/_list/emptyTemplate" topSpacing="xl" bottomSpacing="l">
    *             <ws:contentTemplate>Нет данных</ws:contentTemplate>
    *          </ws:partial>
    *       </ws:emptyTemplate>
    *    </Controls.list:View
    * </pre>
    */

   /**
    * @name Controls/_list/interface/IList#footerTemplate
    * @cfg {Function} Template that will be rendered below the list.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    */

   /**
    * @name Controls/_list/interface/IList#resultsTemplate
    * @cfg {Function} Results row template.
    */

   /**
    * @name Controls/_list/interface/IList#resultsPosition
    * @cfg {String} Results row position.
    * @variant top Show results above the list.
    * @variant bottom Show results below the list.
    */

   /**
    * @typedef {Object} VirtualScrollConfig
    * @property {Number} maxVisibleItems Maximum number of rendered items.
    */

   /**
    * @name Controls/_list/interface/IList#virtualScrollConfig
    * @cfg {VirtualScrollConfig} Virtual scroll config.
    */

   /**
    * @name Controls/_list/interface/IList#sorting
    * @cfg {Array} Determinates sorting for list.
    * @example
    * [
    *    { price: 'desc' },
    *    { balance: 'asc' }
    * ]
    */

   /**
    * @name Controls/_list/interface/IList#multiSelectVisibility
    * @cfg {String} Whether multiple selection is enabled.
    * <a href="/materials/demo-ws4-list-multiselect">Example</a>.
    * @variant visible Show.
    * @variant hidden Do not show.
    * @variant onhover Show on hover.
    * @default hidden
    */

   /**
    * @typedef {Object} ItemAction
    * @property {String} id Identifier of operation.
    * @property {String} title Operation name.
    * @property {String} icon Operation icon.
    * @property {Number} showType Location of operation.
    * @property {String} style Operation style.
    * @property {String} iconStyle Style of the action's icon. (secondary | warning | danger | success).
    * @property {Function} handler Operation handler.
    */

   /**
    * @name Controls/_list/interface/IList#itemActions
    * @cfg {Array.<ItemAction>} Array of configuration objects for buttons which will be shown when the user hovers over an item.
    * <a href="/materials/demo-ws4-list-item-actions">Example</a>.
    */

   /**
    * @name Controls/_list/interface/IList#itemActionsPosition
    * @cfg {String} Position of item actions.
    * <a href="/materials/demo-ws4-list-item-actions">Example</a>.
    * @variant inside Item actions will be positioned inside the item's row.
    * @variant outside Item actions will be positioned under the item's row.
    */

   /**
    * @event Controls/_list/interface/IList#itemActionsClick
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {ItemAction} action Object with configuration of the clicked action.
    * @param {Types/entity:Model} item Instance of the item whose action was clicked.
    * @param {HTMLElement} itemContainer Container of the item whose action was clicked.
    */

   /**
    * @name Controls/_list/interface/IList#itemActionVisibilityCallback
    * @cfg {function} item operation visibility filter function
    * @param {ItemAction} action Object with configuration of an action.
    * @param {Types/entity:Model} item Instance of the item whose action is being processed.
    * @returns {Boolean} Determines whether the action should be rendered.
    */

   /**
    * @name Controls/_list/interface/IList#itemActionsProperty
    * @cfg {String} Name of the item's property that contains item actions.
    */

   /**
    * @name Controls/_list/interface/IList#markedKey
    * @cfg {Number} Identifier of the marked collection item.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    */

   /**
    * @name Controls/_list/interface/IList#markerVisibility
    * @cfg {String} Determines when marker is visible.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    * @variant visible The marker is always displayed, even if the marked key entry is not specified.
    * @variant hidden The marker is always hidden.
    * @variant onactivated - The marker is displayed on List activating. For example, when user mark a record.
    * @default onactivated
    */

   /**
    * @name Controls/_list/interface/IList#uniqueKeys
    * @cfg {String} Strategy for loading new list items.
    * @remark
    * true - Merge, items with the same identifier will be combined into one.
    * false - Add, items with the same identifier will be shown in the list.
    */

   /**
    * @name Controls/_list/interface/IList#itemsReadyCallback
    * @cfg {Function} Callback function that will be called when list data instance is ready.
    */

   /**
    * @name Controls/_list/interface/IList#dataLoadCallback
    * @cfg {Function} Callback function that will be called when list data loaded by source
    */

   /**
    * @name Controls/_list/interface/IList#dataLoadErrback
    * @cfg {Function} Callback function that will be called when data loading fail
    */

   /**
    * @function Controls/_list/interface/IList#reload
    * Reloads list data and view.
    */

   /**
    * @function Controls/_list/interface/IList#reloadItem
    * Loads model from data source, merges changes into the current data and renders the item.
    */

   /**
    * @event Controls/_list/interface/IList#itemClick Occurs when list item is clicked.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    */

   /**
    * @event Controls/_list/interface/IList#itemSwipe Occurs when list item is swiped.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} item Instance of the swiped item.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} originalEvent Descriptor of the original event. It is useful if you want to get direction or target.
    * @remark
    * This event fires only if the list doesn't do anything on swipe (e.g., if the list supports selection - it will toggle checkbox and that's it). This behavior is in line with the {@link Controls/_list/interface/IList#itemClick itemClick}.
    */

   /**
    * @event Controls/_list/interface/IList#hoveredItemChanged The event fires when the user hovers over a list item with a cursor.
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Model} item Instance of the item whose action was clicked.
    * @param {HTMLElement} itemContainer Container of the item.
    */

   /**
    * @event  Controls/_list/interface/IList#markedKeyChanged Occurs when list item was selected (marked).
    * <a href="/materials/demo-ws4-list-base">Example</a>.
    * @param {Number} key Key of the selected item.
    */

   /**
    * @typedef {Object} VerticalItemPaddingEnum
    * @variant null Without padding.
    * @variant S Small padding.
    * @default S
    */

   /**
    * @typedef {Object} HorizontalItemPaddingEnum
    * @variant null without padding.
    * @variant XS Extra small padding.
    * @variant S Small padding.
    * @variant M Medium padding.
    * @variant L Large padding.
    * @variant XL Extra large padding.
    * @variant XXL Extra extra large padding.
    * @default M
    */

   /**
    * @typedef {Object} ItemPadding
    * @property {VerticalItemPaddingEnum} [top] Padding from item content to top item border.
    * @property {VerticalItemPaddingEnum} [bottom] Padding from item content to bottom item border.
    * @property {HorizontalItemPaddingEnum} [left] Padding from item content to left item border.
    * @property {HorizontalItemPaddingEnum} [right] Padding from item content to right item border.
    */

   /**
    * @cfg {ItemPadding} Configuration inner paddings in the item.
    * @name Controls/_list/interface/IList#itemPadding
    */

   return Control;
});
