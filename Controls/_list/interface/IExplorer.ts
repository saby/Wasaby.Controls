/**
 * Interface for hierarchical lists that can open folders.
 *
 * @interface Controls/_list/interface/IExplorer
 * @public
 * @author Авраменко А.С.
 */

/**
 * @typedef {String} explorerViewMode
 * @variant grid Table.
 * @variant list List.
 * @variant tile Tiles.
 */
/**
 * @name Controls/_list/interface/IExplorer#viewMode
 * @cfg {explorerViewMode} List view mode.
 */

/**
 * @name Controls/_list/interface/IExplorer#root
 * @cfg {String} Identifier of the root node.
 */

/**
 * @event Controls/_list/interface/IExplorer#itemOpen Occurs before opening a folder.
 */
/**
 * @event Controls/_list/interface/IExplorer#itemOpened Occurs after the folder was opened.
 */

/**
 * @name Controls/_list/interface/IExplorer#backButtonStyle
 * @cfg {String} Back heading display style.
 * @default secondary
 * @see Controls/Heading/Back#style
 */

/**
 * @name Controls/_list/interface/IExplorer#showActionButton
 * @cfg {Boolean} Determines whether the arrow near "back" button should be shown.
 * @default
 * true
 */
