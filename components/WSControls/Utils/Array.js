/**
 * Created by am.gerasimov on 08.08.2017.
 */
define('js!WSControls/Utils/Array', [], function() {
   
   var checkArray = function(array) {
      if(!Array.isArray(array)) {
         throw new Error('Argument must be instance of Array');
      }
   };
   
   return {
      remove: function(array, toRemove) {
         checkArray(array);
         checkArray(toRemove);
         
         var newArray = array.slice(),
             index;
   
         toRemove.forEach(function(key) {
            index = newArray.indexOf(key);
      
            if(index !== -1) {
               newArray.splice(index, 1);
            }
         });
         
         return newArray;
      },
      
      add: function(array, toAdd) {
         checkArray(array);
         checkArray(toAdd);
   
         var newArray = array.slice();
   
         toAdd.forEach(function(key) {
            if(newArray.indexOf(key) === -1) {
               newArray.push(key);
            }
         });
         
         return newArray;
      },
      
      toggle: function(array, toToggle) {
         checkArray(array);
         checkArray(toToggle);
   
         var newArray = array.slice(),
             index;
   
         toToggle.forEach(function(key) {
            index = newArray.indexOf(key);
      
            if(index === -1) {
               newArray.push(key);
            } else {
               newArray.splice(index, 1);
            }
         });
         
         return newArray;
      },
      
      getDifference: function(array, newArray) {
         return {
            added: newArray.filter(function (elem) {
               return array.indexOf(elem) === -1;
            }),
            removed: array.filter(function(elem) {
               return newArray.indexOf(elem) === -1;
            })
         }
      }
   }
});