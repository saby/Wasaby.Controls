define('js!SBIS3.CONTROLS._DataBindMixin', ['js!SBIS3.CORE.AttributeCfgParser'], function(attributeCfgParser){
   'use strict';
   return {
      $protected : {
         _dataBind : {}
      },

      $constructor : function() {
         var attr = this._container.attr('data-bind');
         if (attr) {
            this._dataBind = attributeCfgParser(attr);
         }
      },

      saveToContext: function(field, value){
         this.getLinkedContext().setValue(this._dataBind[field], value, false, this);
      }
   };
});