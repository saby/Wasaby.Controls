define('tests/resources/ProxyCall',
   [],
   function() {
      'use strict';

      return {

         /**
          *
          * @param {Function} func
          * @param {String} name
          * @param {Object} callStorage
          * @param {Boolean} emptyCall
          */
         apply: function(func, name, callStorage, emptyCall) {
            return new Proxy(func, {
               apply: function(target, contextThis, listArguments) {
                  callStorage.push({
                     name: name,
                     arguments: listArguments
                  });

                  if (!emptyCall) {
                     return target.apply(contextThis, listArguments);
                  }
               }
            });
         },

         set: function(object, names, callStorage, emptyCall) {
            return new Proxy(object, {
               set: function(target, prop, value) {
                  if (names.includes(prop)) {
                     callStorage.push({
                        name: prop,
                        value: value
                     });

                     if (!emptyCall) {
                        target[prop] = value;
                     }
                  } else {
                     target[prop] = value;
                  }

                  return true;
               }
            });
         }
      };
   });
