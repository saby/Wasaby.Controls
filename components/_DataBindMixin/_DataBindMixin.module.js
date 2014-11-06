define('js!SBIS3.CONTROLS._DataBindMixin', ['js!SBIS3.CORE.AttributeCfgParser'], function(attributeCfgParser){
   'use strict';
   return {
      $protected : {
         _dataBind : {}
      },

      $constructor : function() {
         var attr = this._container.attr('data-bind');
         if (attr) {
            this._dataBind = attributeCfgParser(attr) || {};
         }
      },

      saveToContext: function(field, value){
         if (this._dataBind[field]) {
            this.getLinkedContext().setValue(this._dataBind[field], value, false, this);
         }
      },

      /**
       * Привязка свойств комопнента к полям конекста
       * @private
       */
      _propertyDataBinding : function(){
         var
            self = this,
            context = this.getLinkedContext(),
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

                     //Переопределяем setter
                     this[setter] = (function(method, property, ctxField){
                        //При изменении нужного поля контекста вызываем исходный сеттер
                        context.subscribe('onFieldChange', function(e, f, v, o){
                           if (f == ctxField && self._options[property] !== v && o !== self){
                              method.apply(self, [v]);
                           }
                        });

                        return function(){
                           method.apply(self, arguments);
                           context.setValue(ctxField, self._options[property]);
                        };
                     })(this[setter], i, dataBind[i]);
                  }
               }
            }
         }
      }
   };
});