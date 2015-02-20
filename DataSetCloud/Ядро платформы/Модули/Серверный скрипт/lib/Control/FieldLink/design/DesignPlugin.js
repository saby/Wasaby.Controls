define('js!SBIS3.CORE.FieldLink/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FieldLink"
   ],
   function(FieldLink){
   /**
    * @class $ws.proto.FieldLink.DesignPlugin
    * @extends $ws.proto.FieldLink
    * @plugin
    */
   $ws.proto.FieldLink.DesignPlugin = FieldLink.extendPlugin({
      setImgTitle: function(imgTitle) {
         this._options.imgTitle = imgTitle;
         var titleLink = this._options.title;
         if(this._options.renderStyle !== 'linkOnly' && this._options.imgTitle){
            titleLink = this._addImgTitle();
         }
         this.setTitle(titleLink);
      },
      setRenderStyle: function(renderStyle) {
         this._options.renderStyle = renderStyle;
         var inputFieldContainer = this._inputField.getContainer(),
             isLinkOnly = this._options.renderStyle === 'linkOnly',
             isInputFieldNotCreated = this._inputField === null;
         if(!isLinkOnly && isInputFieldNotCreated) {
            this._addField();
         }
         inputFieldContainer.toggleClass('ws-hidden', isLinkOnly && !isInputFieldNotCreated);
         inputFieldContainer.toggleClass('ws-FieldLink__inputContainer', !isLinkOnly && !isInputFieldNotCreated);
         this._container.toggleClass('ws-FieldLink__linkOnly', isLinkOnly );
      },
      setLinkTextAlign: function(linkTextAlign) {
         this._options.linkTextAlign = linkTextAlign;
         this._container.toggleClass('ws-FieldLink__linkOnly__textAlign-right',linkTextAlign === 'right' ? true : false );
         if(linkTextAlign === 'right' && this._link) {
            this._link.parent().css('width', '');
         } else {
            this._onResizeHandler();
         }
      },
      setLabelPosition: function(labelPosition){
         this._options.labelPosition = labelPosition;
         if(this._options.renderStyle ==='inputAndLink') {
            this._container.find('.ws-FieldLink__link').toggleClass('ws-FieldLink__topLabel', labelPosition === 'top' ? true : false);
         }
      }
   });
});