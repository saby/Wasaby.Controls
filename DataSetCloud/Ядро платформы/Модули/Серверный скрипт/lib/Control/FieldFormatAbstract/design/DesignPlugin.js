define('js!SBIS3.CORE.FieldFormatAbstract/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FieldFormatAbstract"
   ],
   function(FieldFormatAbstract){
      $ws.proto.FieldFormatAbstract.DesignPlugin = FieldFormatAbstract.extendPlugin({
         setMask: function(mask) {
            this._options.mask = mask;
            this.setActive(false);
            this._initInputControl();
         }
      });
   });