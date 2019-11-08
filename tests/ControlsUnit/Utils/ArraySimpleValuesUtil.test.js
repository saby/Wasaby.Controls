/**
 * Created by kraynovdo on 19.03.2018.
 */
define([
   'Controls/Utils/ArraySimpleValuesUtil'
], function(Util){
   describe('Controls.Utils.ArraySimpleValuesUtil', function () {

      it('invertTypeIndexOf', function () {
         arr = [1, 2, 3];
         assert.equal(0, Util.invertTypeIndexOf(arr, 1), 'invertTypeIndexOf: incorrect result');
         arr = [1, 2, 3];
         assert.equal(0, Util.invertTypeIndexOf(arr, '1'), 'invertTypeIndexOf: incorrect result');
         var arr = ['1', '2', '3'];
         assert.equal(0, Util.invertTypeIndexOf(arr, 1), 'invertTypeIndexOf: incorrect result');

         var toStringCalled = false;
         var obj = {
            toString: () => {
               toStringCalled = true;
            }
         };
         assert.equal(Util.invertTypeIndexOf(arr, obj), -1);
         assert.isFalse(toStringCalled);
      });

      it('hasInArray', function () {
         arr = [1, 2, 3];
         assert.isTrue(Util.hasInArray(arr, 1), 'hasInArray: incorrect result');
         arr = [1, 2, 3];
         assert.isTrue(Util.hasInArray(arr, '1'), 'hasInArray: incorrect result');
         var arr = ['1', '2', '3'];
         assert.isTrue(Util.hasInArray(arr, 1), 'hasInArray: incorrect result');
      });

      it('addSubArray', function () {
         var arr1, arr2;

         arr1 = []; arr2 = [1, 2];
         Util.addSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [];
         Util.addSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [3, 4];
         Util.addSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2, 3, 4], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [2, 3];
         Util.addSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2, 3], 'addSubArray: incorrect result');

      });

      it('removeSubArray', function () {
         var arr1, arr2;

         arr1 = []; arr2 = [1, 2];
         Util.removeSubArray(arr1, arr2);
         assert.deepEqual(arr1, [], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [];
         Util.removeSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [3, 4];
         Util.removeSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2], 'addSubArray: incorrect result');

         arr1 = [1, 2]; arr2 = [2, 3];
         Util.removeSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1], 'addSubArray: incorrect result');

         arr1 = [1, 2, 3, 4]; arr2 = [4, 3];
         Util.removeSubArray(arr1, arr2);
         assert.deepEqual(arr1, [1, 2], 'addSubArray: incorrect result');
      });

      it('getArrayDifference', function () {
         var arr1, arr2, diff;

         arr1 = []; arr2 = [1, 2];
         diff = Util.getArrayDifference(arr1, arr2);
         assert.deepEqual({removed:[], added:[1, 2]}, diff, 'getArrayDifference: incorrect result');

         arr1 = [1, 2]; arr2 = [];
         diff = Util.getArrayDifference(arr1, arr2);
         assert.deepEqual({removed:[1, 2], added:[]}, diff, 'getArrayDifference: incorrect result');

         arr1 = [1, 2]; arr2 = [3, 4];
         diff = Util.getArrayDifference(arr1, arr2);
         assert.deepEqual({removed:[1, 2], added:[3, 4]}, diff, 'getArrayDifference: incorrect result');

         arr1 = [1, 2]; arr2 = [2, 3];
         diff = Util.getArrayDifference(arr1, arr2);
         assert.deepEqual({removed:[1], added:[3]}, diff, 'getArrayDifference: incorrect result');

         arr1 = [1, 2]; arr2 = [1, 2];
         diff = Util.getArrayDifference(arr1, arr2);
         assert.deepEqual({removed:[], added:[]}, diff, 'getArrayDifference: incorrect result');
      });
   })
});