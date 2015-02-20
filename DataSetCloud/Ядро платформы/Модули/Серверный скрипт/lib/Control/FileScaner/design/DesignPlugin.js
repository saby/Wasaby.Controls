define('js!SBIS3.CORE.FileScaner/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FileScaner"
   ],
   function(FileScaner){
      
      //endregion

   /**
    * @class $ws.proto.FileScaner.DesignPlugin
    * @extends $ws.proto.FileScaner
    * необходим для изменения опции renderStyle
    * @plugin
    */
   $ws.proto.FileScaner.DesignPlugin = FileScaner.extendPlugin({
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