define('js!SBIS3.CORE.FileBrowse/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FileBrowse"
   ],
   function(FileBrowse){
      
      //endregion

   /**
    * @class $ws.proto.FileBrowse.DesignPlugin
    * @extends $ws.proto.FileBrowse
    * необходим для изменения опции renderStyle
    * @plugin
    */
   $ws.proto.FileBrowse.DesignPlugin = FileBrowse.extendPlugin({
      setRenderStyle: function(renderStyle) {
         this._options.renderStyle = renderStyle;
         this._container
            .toggleClass('ws-button-classic', renderStyle === 'classic')
            .toggleClass('ws-button-link', renderStyle === 'asLink');
         this._container.empty();
         var template = $(this._dotTplFn(this._options)).children();
         this._container.append(template);
         this._setRenderStyleClass();
         this._redraw();
      }
   });
});