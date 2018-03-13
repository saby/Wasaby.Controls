define('Controls/Event/Registrar',
   [
      'Core/core-simpleExtend'
   ],
   function(cExtend) {
      var _private = {

      };
      var Registrar = cExtend.extend({

         _registry: null,

         constructor: function (cfg) {
            Registrar.superclass.constructor.apply(this, arguments);
            this._registry = {};
            this._options = cfg;
         },


         _beforeMount: function(){

         },

         register: function(event, component, callback){
            this._registry[component.getInstanceId()] = {
               component: component,
               callback: callback
            };
            event.stopPropagation();
         },
         unregister: function(event, component){
            this._registry[component.getInstanceId()] = null;
            event.stopPropagation();
         },
         start: function(){
            if (!this._registry)
               return;
            for(var i in this._registry){
               if (this._registry.hasOwnProperty(i)) {
                  var obj = this._registry[i];
                  obj && obj.callback.apply(obj.component, arguments);
               }
            }
         },

         destroy: function() {
            this._options = {};
            this._registry = {};
         }

      });
      //для тестов
      Registrar._private = _private;

      return Registrar;
   });
