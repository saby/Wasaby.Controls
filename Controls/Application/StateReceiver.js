define('Controls/Application/StateReceiver', ['Core/core-extend',
   'Core/Serializer',
   'Core/IoC',
   'View/Runner/common'], function(extend, Serializer, IoC, common) {
   function getDepsFromSerializer(slr) {
      var moduleInfo;
      var deps = {};
      var modules = slr._linksStorage;
      var parts;
      for (var key in modules) {
         if (modules.hasOwnProperty(key)) {
            moduleInfo = modules[key];
            if (moduleInfo.module) {
               parts = Serializer.parseDeclaration(moduleInfo.module);
               deps[parts.name] = true;
            }
         }
      }
      return deps;
   }

   var SRec = extend.extend({
      receivedStateObjectsArray: null,
      _deserialized: null,
      constructor: function() {
         this._deserialized = {};
         this.receivedStateObjectsArray = {};
      },
      serialize: function() {
         var slr;
         var serializedMap = {};
         var allAdditionalDeps = {};
         var allRecStates = this.receivedStateObjectsArray;
         for (var key in allRecStates) {
            if (allRecStates.hasOwnProperty(key)) {
               var receivedState = allRecStates[key].getState();
               if (receivedState) {
                  serializedMap[key] = receivedState;
               }
            }
         }

         slr = new Serializer();
         var serializedState = JSON.stringify(serializedMap, slr.serialize);
         common.componentOptsReArray.forEach(function(re) {
            serializedState = serializedState.replace(re.toFind, re.toReplace);
         });
         serializedState = serializedState.replace(/\\"/g, '\\\\"');
         var addDeps = getDepsFromSerializer(slr);
         for (var dep in addDeps) {
            if (addDeps.hasOwnProperty(dep)) {
               allAdditionalDeps[dep] = true;
            }
         }

         return {
            serialized: serializedState,
            additionalDeps: allAdditionalDeps
         };
      },
      deserialize: function(str) {
         var slr = new Serializer();
         try {
            common.componentOptsReArray.forEach(function(re) {
               str = str.replace(re.toReplace, re.toFind);
            });
            this._deserialized = JSON.parse(str, slr.deserialize);
         } catch (e) {
            IoC.resolve('ILogger').error('Deserialize', 'Cant\'t deserialize ' + str);
         }
      },

      register: function(key, inst) {
         if (this._deserialized[key]) {
            inst.setState(this._deserialized[key]);
            delete this._deserialized[key];
         }
         this.receivedStateObjectsArray[key] = inst;
      },

      unregister: function(key) {
         delete this.receivedStateObjectsArray[key];
      }
   });
   return SRec;
});
