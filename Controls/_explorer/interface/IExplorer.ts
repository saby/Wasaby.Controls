/**
 * Interface for hierarchical lists that can open folders.
 *
 * @interface Controls/_explorer/interface/IExplorer
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
 * @name Controls/_explorer/interface/IExplorer#viewMode
 * @cfg {explorerViewMode} List view mode.
 */

/**
 * @name Controls/_explorer/interface/IExplorer#root
 * @cfg {String} Identifier of the root node.
 */

/**
 * @event Controls/_explorer/interface/IExplorer#itemOpen Occurs before opening a folder.
 */
/**
 * @event Controls/_explorer/interface/IExplorer#itemOpened Occurs after the folder was opened.
 */

/**
 * @event Controls/_explorer/interface/IExplorer#rootChanged Происходит при смене корня. 
 */

/**
 * @name Controls/_explorer/interface/IExplorer#backButtonStyle
 * @cfg {String} Back heading display style.
 * @default secondary
 * @see Controls/_heading/Back#style
 */

/**
 * @name Controls/_explorer/interface/IExplorer#showActionButton
 * @cfg {Boolean} Determines whether the arrow near "back" button should be shown.
 * @default
 * true
 */
