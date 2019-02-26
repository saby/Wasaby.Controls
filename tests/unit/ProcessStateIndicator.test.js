define([
   'Controls/ProcessStateIndicator'
], function(ProcessStateIndicator) {
   describe('Controls.ProcessStateIndicator', function() {
      it('calculateColorState 10 sectors, 1 values', function() {
         var psi, data, colors;
         psi = new ProcessStateIndicator({});
         colors = ProcessStateIndicator._private.setColors([],1);
         data = ProcessStateIndicator._private.calculateColorState(10,1,[0],colors);
         assert.deepEqual([], data, 'calculateColorState 10 1 test case 1: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,1,[1],colors);
         assert.deepEqual([1], data, 'calculateColorState 10 1 test case 2: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(10,1,[19],colors);
         assert.deepEqual([1], data, 'calculateColorState 10 1 test case 3: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(10,1,[20],colors);
         assert.deepEqual([1,1], data, 'calculateColorState 10 1 test case 4: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,1,[99],colors);
         assert.deepEqual([1,1,1,1,1,1,1,1,1], data, 'calculateColorState 10 1 test case 5: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,1,[100],colors);
         assert.deepEqual([1,1,1,1,1,1,1,1,1,1], data, 'calculateColorState 10 1 test case 6: WrongResult');
      });

      it('calculateColorState 10 sectors, 2 values', function() {
         var psi, data, colors;
         psi = new ProcessStateIndicator({});
         colors = ProcessStateIndicator._private.setColors([],2);
         data = ProcessStateIndicator._private.calculateColorState(10,2,[0,0],colors);
         assert.deepEqual([], data, 'calculateColorState 10 2 test case 1: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,2,[1,0],colors);
         assert.deepEqual([1], data, 'calculateColorState 10 2 test case 2: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(10,2,[1,1],colors);
         assert.deepEqual([1,2], data, 'calculateColorState 10 2 test case 3: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(10,2,[50,50],colors);
         assert.deepEqual([1,1,1,1,1,2,2,2,2,2], data, 'calculateColorState 10 2 test case 4: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,2,[99,1],colors);
         assert.deepEqual([1,1,1,1,1,1,1,1,1,2], data, 'calculateColorState 10 2 test case 5: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,2,[1,99],colors);
         assert.deepEqual([1,2,2,2,2,2,2,2,2,2], data, 'calculateColorState 10 2 test case 6: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(10,2,[33,33],colors);
         assert.deepEqual([1,1,1,2,2,2], data, 'calculateColorState 10 2 test case 7: WrongResult');
      });

      it('calculateColorState 20 sectors, 3 values', function() {
         var psi, data, colors;
         psi = new ProcessStateIndicator({});
         colors = ProcessStateIndicator._private.setColors([],3);
         data = ProcessStateIndicator._private.calculateColorState(20,3,[0,0,0],colors);
         assert.deepEqual([], data, 'calculateColorState 20 3 test case 1: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(20,3,[1,0,1],colors);
         assert.deepEqual([1,3], data, 'calculateColorState 20 3 test case 2: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(20,3,[1,1,1],colors);
         assert.deepEqual([1,2,3], data, 'calculateColorState 20 3 test case 3: WrongResult');
         
         data = ProcessStateIndicator._private.calculateColorState(20,3,[0,0,10],colors);
         assert.deepEqual([3,3], data, 'calculateColorState 20 3 test case 4: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(20,3,[34,33,33],colors);
         assert.deepEqual([1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3], data, 'calculateColorState 20 3 test case 5: WrongResult');

         data = ProcessStateIndicator._private.calculateColorState(20,3,[50,25,25],colors);
         assert.deepEqual([1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3], data, 'calculateColorState 20 3 test case 6: WrongResult');
      });
   })
});