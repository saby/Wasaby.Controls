define('Controls/Event/Registrar',
   [
      'Core/core-simpleExtend'
   ],
   function(cExtend) {
      var _private = {

      };
      var Registrar = cExtend.extend({

         _registry: null,

         constructor: function(cfg) {
            Registrar.superclass.constructor.apply(this, arguments);
            this._registry = {};
            this._options = cfg;
         },

         register: function(event, component, callback) {
            this._registry[component.getInstanceId()] = {
               component: component,
               callback: callback
            };
            event.stopPropagation();
         },
         unregister: function(event, component) {
            delete this._registry[component.getInstanceId()];
            event.stopPropagation();
         },
         start: function() {
            if (!this._registry) {
               return;
            }
            for (var i in this._registry) {
               if (this._registry.hasOwnProperty(i)) {
                  var obj = this._registry[i];
                  obj && obj.callback.apply(obj.component, arguments);
               }
            }
         },

         startOnceTarget: function(target) {
            var argsClone;
            if (!this._registry) {
               return;
            }
            for (var i in this._registry) {
               if (this._registry.hasOwnProperty(i)) {
                  var obj = this._registry[i];
                  if (obj.component === target) {
                     argsClone = Array.prototype.slice.call(arguments);
                     argsClone.splice(0, 1);
                     obj && obj.callback.apply(obj.component, argsClone);
                  }
               }
            }
         },

         destroy: function() {
            this._options = {};
            this._registry = {};
         }

      });

      return Registrar;
   });
