define('js!SBIS3.CORE.FieldRadio/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FieldRadio"
   ],
   function(FieldRadio){
      $ws.proto.FieldRadio.DesignPlugin = FieldRadio.extendPlugin({
         setTextAlign: function(textAlign) {
            var formContainer = this._container.find('form');
            formContainer.removeClass('ws-field-radio-align-' + this._options.textAlign);
            formContainer.addClass('ws-field-radio-align-' + textAlign);
            this._options.textAlign = textAlign;
         },

         setAlign: function(align) {
            this._options.align = align;
            this._container.find('.radio-group-col').width('auto');
            this._calculateWidth();
         },

         setWordWrap: function(wordWrap) {
            this._options.wordWrap = wordWrap;
            var fieldContainer = this._container.find('.ws-field');
            fieldContainer.removeClass("ws-prewrap ws-nowrap");
            fieldContainer.addClass(wordWrap ? "ws-prewrap" : "ws-nowrap");
         },

         setColumnsCount: function(columnsCount) {
            this._options.columnsCount = columnsCount;
            this._wrapColumns();
         },

         setMode: function(mode) {
            this._options.mode = mode;
            this._redraw();
         },

         setButtonDirection: function(buttonDirection) {
            this._options.buttonDirection = buttonDirection;
            this._redraw();
         },

         setName: function(name) {
            this._options.name = name;
            var
               length = this._options.data.length,
               children = this._container.find('.radio-group-col').children();
            for(var i = 0; i < length; ++i){
               var nameObj = this._options.data[i].name;
               $(children[i])
                  .attr('id', 'fld-' + name)
                  .find('input')
                  .attr('id', name + '-' + nameObj)
                  .attr('name', name);
            }
         }
      });
   });