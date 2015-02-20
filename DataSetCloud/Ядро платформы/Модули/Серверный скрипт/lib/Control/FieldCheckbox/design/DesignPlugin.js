define('js!SBIS3.CORE.FieldCheckbox/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FieldCheckbox"
   ],
   function(FieldCheckbox){

      /**
       * @class $ws.proto.FieldCheckbox.DesignPlugin
       * @extends $ws.proto.FieldCheckbox
       * @plugin
       */
      $ws.proto.FieldCheckbox.DesignPlugin = FieldCheckbox.extendPlugin({
         setIsThirdPosition: function(isThirdPosition) {
            this._options.isThirdPosition = isThirdPosition;
            if(!isThirdPosition && this.getValue() === null) {
               this._changeState();
            }
         }
      });
   });