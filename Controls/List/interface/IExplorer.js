define('Controls/List/interface/IExplorer', [
], function() {
   /**
    * Interface for hierarchical lists that can open folders.
    *
    * @interface Controls/List/interface/IExplorer
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

});
