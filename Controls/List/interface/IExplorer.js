define('Controls/List/interface/IExplorer', ['Controls/_lists/interface/IExplorer'], function(Control) {
/**
 * Interface for hierarchical lists that can open folders.
 *
 * @interface Controls/List/interface/IExplorer
 * @public
 * @author Авраменко А.С.
 */
   /**
 * @typedef {String} explorerViewMode
 * @variant table Table.
 * @variant search Search.
 * @variant tile Tiles.
 */
   /**
 * @name Controls/List/interface/IExplorer#viewMode
 * @cfg {explorerViewMode} List view mode.
 */
   /**
 * @name Controls/List/interface/IExplorer#root
 * @cfg {String} Identifier of the root node.
 */
   /**
 * @event Controls/List/interface/IExplorer#itemOpen Occurs before opening a folder.
 */
   /**
 * @event Controls/List/interface/IExplorer#itemOpened Occurs after the folder was opened.
 */
   /**
 * @name Controls/List/interface/IExplorer#backButtonStyle
 * @cfg {String} Back heading display style.
 * @default secondary
 * @see Controls/_heading:Back#style
 */
   /**
 * @name Controls/List/interface/IExplorer#showActionButton
 * @cfg {Boolean} Determines whether the arrow near "back" button should be shown.
 * @default true
 */
   return Control;
});
