define('js!SBIS3.CONTROLS._DataBindMixin', [], function(){
   'use strict';
   function ctxFieldChange(e, field, value, init) {
      function changeInit(field, value)  {
         var prop = this._dataBind[field];
         if (prop) {
            var method = 'set' + prop.slice(0, 1).toUpperCase() + prop.slice(1);
            this[method](value);
         }
      }
      if (init != this) {
         if (field) {
            changeInit.call(this, field, value)
         }
         else {
            var ctx = this.getLinkedContext();
            for (var j in this._dataBind) {
               if (this._dataBind.hasOwnProperty(j)) {
                  changeInit.call(this, j, ctx.getVlaue(j));
               }
            }
         }
      }
   }
   return {
      $protected : {
         _dataBind : {},
         _ctxFieldChangeHandler : null
      },
      $constructor : function() {
         var
            dataBindStr = this.getContainer().attr('data-ctx'),
            dataBindArr = dataBindStr ? dataBindStr.split(';') : [];

         for (var i = 0; i < dataBindArr.length; i++) {
            dataBindArr[i] = dataBindArr[i].split(':');
            this._dataBind[dataBindArr[i][1]] = dataBindArr[i][0];
         }
         this._ctxFieldChangeHandler = ctxFieldChange.bind(this);
         if (!(Object.isEmpty(this._dataBind))) {
            this._contentSubscribe();
         }
      },

      _contentSubscribe : function() {
         this.getLinkedContext().subscribe('onFieldChange', this._ctxFieldChangeHandler);
         //this.getLinkedContext().subscribe('onDataBind', this._ctxFieldChangeHandler);
      },

      /*set : function(option, value, ctxFlag) {
         var method = 'set' + option.slice(0, 1).toUpperCase() + option.slice(1);
         this[method](value);

         if (!ctxFlag) {
            for (var i in this._dataBind) {
               if (this._dataBind.hasOwnProperty(i) && this._dataBind[i] == option) {
                  this.getLinkedContext().setValue(option, value, undefined, this);
               }
            }
         }
      },*/

      after : {
         destroy : function() {
            this.getLinkedContext().unsubscribe('onFieldChange', this._ctxFieldChangeHandler);
            //this.getLinkedContext().unsubscribe('onDataBind', this._ctxFieldChangeHandler);
         }
      }
   }
});