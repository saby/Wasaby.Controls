define('js!SBIS3.CORE.TableView/design/DesignPlugin',
   [
      "js!SBIS3.CORE.TableView"
   ],
   function(TableView){
      
      //endregion

   /**
    * @class $ws.proto.TableView.DesignPlugin
    * @extends $ws.proto.TableView
    * необходим для того, чтобы при установке опций секции display, изменялось отображение табличного представления
    * @plugin
    */
   $ws.proto.TableView.DesignPlugin = TableView.extendPlugin({
      setDisplay: function(data) {
        this._options.display = data;
        this._columnMap = [];
        this._colgroupCache = undefined;
        this._mapColumns();
        this._initialColumns =  this._options.display.columns;
        this._container.html("");
        this._createContainer();
        this._initDataSource();
        this.refresh(true);
      }
   });
});