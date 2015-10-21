define('js!SBIS3.CONTROLS.DataBindMixin', ['js!SBIS3.CORE.AttributeCfgParser'], function(attributeCfgParser){
   'use strict';
    /**
     * @mixin SBIS3.CONTROLS.DataBindMixin
     * @author Крайнов Дмитрий Олегович
     */
    var DataBindMixin = /**@lends SBIS3.CONTROLS.DataBindMixin.prototype  */{
      $protected : {
         _dataBind : {}
      },

      $constructor : function() {
         var attr = this._container.attr('data-bind');
         if (attr) {
            this._dataBind = attributeCfgParser(attr) || {};
         }
      },

      _getBindingContext : function() {
         var ctx;
         if (this.getParent()) {
            ctx = this.getParent().getContext();
         }
         else {
            ctx = this.getLinkedContext();
         }
         return ctx;
      },
        /**
         * Метод изменения значения поля контекста.
         * Если указать несуществующее поле, то метод ничего не сделает.
         * @param {String} field Поле контекста.
         * @param {String} value Новое значение.
         * @noShow
         */
      saveToContext: function(field, value){
         if (this._dataBind[field]) {
            this._getBindingContext().setValue(this._dataBind[field], value, false, this);
            this.validate();
         }
      },

      /**
       * Привязка свойств комопнента к полям конекста
       * @private
       */
      _propertyDataBinding : function(){
         var
            self = this,
            context = this._getBindingContext(),
            attr = this.getContainer().attr('data-bind'),
            dataBind,
            setter;

         //Проверяет есть ли сеттер, если есть возвращает его найзвание, иначе false
         function getSetter(property){
            var setter = 'set' + property.replace(/^(.)/, function(c){
                  return c.toUpperCase();
               });
            return (setter in self) ? setter : false;
         }

         if(attr){
            dataBind = attributeCfgParser(attr);
            for (var i in dataBind){
               if (dataBind.hasOwnProperty(i)){
                  //Если есть сеттер для указанного поля, то проставляем значение опции из контекста
                  if ((setter = getSetter(i)) !== false){
                     //Проставляем значение из контекста
                     this[setter](context.getValue(dataBind[i]));

                     context.subscribe('onFieldChange', function(e, f, v, o){
                        if (f == dataBind[i] && self._options[i] !== v && o !== self){
                           self[setter].apply(self, [v]);
                        }
                     });

                  }
               }
            }
         }
      }
   };
   return DataBindMixin;
});