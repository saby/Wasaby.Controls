define('js!SBIS3.CORE.TreeView/design/DesignPlugin',
   [
      "js!SBIS3.CORE.TreeView"
   ],
   function(TreeView){
      
      //endregion

   /**
    * @class $ws.proto.TreeView.DesignPlugin
    * @extends $ws.proto.TreeView
    * @plugin
    */
   $ws.proto.TreeView.DesignPlugin = TreeView.extendPlugin({
      setDisplay: function(data) {
        this._options.display = data;
        this._columnMap = [];
        this._colgroupCache = undefined;
        this._mapColumns();
        this._initialColumns =  this._options.display.columns;
        this._container.html("");
        this._createContainer();
      }
   });
});