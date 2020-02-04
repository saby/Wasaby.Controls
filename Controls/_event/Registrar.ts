import cExtend = require('Core/core-simpleExtend');

var _private = {

};

var Registrar = cExtend.extend({

   _registry: null,
   _startOverRegistry: null,
   _overRegistry: [],

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
      this._startOverRegistry = true;
      if (this._startOverRegistry) {
         this._overRegistry.push(component.getInstanceId());
      }
      event.stopPropagation();
   },
   unregister: function(event, component) {
      delete this._registry[component.getInstanceId()];
      if (this._startOverRegistry) {
         for (let key in this._overRegistry) {
            delete this._registry[this._overRegistry[key]];
         }
         this._startOverRegistry = false;
         this._overRegistry = [];
      }
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

   startAsync: function() {
      if (!this._registry) {
         return;
      }
      var promises = [];
      for (var i in this._registry) {
         if (this._registry.hasOwnProperty(i)) {
            var obj = this._registry[i];
            var res = obj && obj.callback.apply(obj.component, arguments);
            promises.push(res);
         }
      }

      return Promise.all(promises);
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

export = Registrar;

