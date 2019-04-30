/**
 * Interface for lists.
 *
 * @interface Controls/_list/interface/IList
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_list/interface/IList#contextMenuVisibility
 * @cfg {Boolean} Determines whether context menu should be shown on right-click.
 * <a href="/materials/demo-ws4-list-item-actions">Example</a>.
 * @default true
 */

/**
 * @name Controls/_list/interface/IList#emptyTemplate
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
 *    <Controls.List>
 *       <ws:emptyTemplate>
 *          <ws:partial template="wml!Controls/_list/emptyTemplate" topSpacing="xl" bottomSpacing="l">
 *             <ws:contentTemplate>Нет данных</ws:contentTemplate>
 *          </ws:partial>
 *       </ws:emptyTemplate>
 *    </Controls.List>
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
 * <pre>
 * [
 *    { price: 'desc' },
 *    { balance: 'asc' }
 * ]
 * </pre>
 * You can also define null-policy by set 3-members array for each field where the 3rd member of an array defines a null
 * policy. So you can choose between two of them: false - NULLS in the beginning, true - NULLS in the end:
 * <pre>
 * [
 *    ['price', 'desc', false],
 *    ['balance', 'asc', true]
 * ]
 * </pre>
 * See topic about {@link /doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/#javascript declarative method signature} for details.
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
 * @property {String} parent Key of the action's parent.
 * @property {boolean|null} parent@ Field that describes the type of the node (list, node, hidden node).
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
 * @event Controls/_list/interface/IList#actionClick
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {ItemAction} action Object with configuration of the clicked action.
 * @param {Types/entity:Model} item Instance of the item whose action was clicked.
 * @param {HTMLElement} itemContainer Container of the item whose action was clicked.
 */

/**
 * @name Controls/_list/interface/IList#actionAlignment
 * @cfg {String} Determines how item actions will be aligned on swipe.
 * <a href="/demo/demo-ws4-swipe">Example</a>.
 * @variant horizontal Actions will be displayed in a line.
 * @variant vertical Actions will be displayed in a line.
 */

/**
 * @name Controls/_list/interface/IList#actionCaptionPosition
 * @cfg {String} Determines where the caption of an item action will be displayed on swipe.
 * <a href="/demo/demo-ws4-swipe">Example</a>.
 * @variant right Title will be displayed to the right of the action's icon.
 * @variant bottom Title will be displayed under the action's icon.
 * @variant none Title will not be displayed.
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
 * @typedef {String} reloadType
 * @variant query Item will be reloaded with query method
 * @variant read Item will be reloaded with read method
 * @default read
 */

/**
 * @function Controls/_list/interface/IList#reloadItem
 * Loads model from data source, merges changes into the current data and renders the item.
 * @param {String} key Identifier of the collection item, that should be reloaded from source.
 * @param {Object} readMeta Meta information, that which will be passed to the query/read method.
 * @param {Boolean} replaceItem Determine, how the loaded item will be applied to collection.
 * If the parameter is set to true, item from collection will replaced with loaded item.
 * if the parameter is set to false (by default), loaded item will merged to item from collection.
 * @param {reloadType} Determine how the item will be reloaded.
 * @example
 *  <pre>
 *      _itemUpdated: function(id) {
 *          var list = this._children.myList;
 *          list.reloadItem(id);
 *      }
 * </pre>
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
