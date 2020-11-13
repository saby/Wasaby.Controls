
define(['Controls/Utils/GridIsEqualUtil'], function(GridIsEqualUtil) {
   var header = [
      {
         width: '1fr',
         template: function() {return 1;}
      },
      {
         width: '2fr',
         template: 'myTpl'
      }
   ]
   var newHeader = [
      {
         width: '1fr',
         template: function() {return 2;}
      },
      {
         width: '2fr',
         template: 'myTpl'
      }
   ];

   var Data1 = [
      {},
      {
         template: 'String',
         title: 'By'
      }
   ];

   var Data2 = [
      {
         template: () => {},
         title: 'hello'
      },
      {
         template: 'String',
         title: 'By'
      }
   ]

   describe('Controls.List.Grid.GridIsEqualUtils', function() {
      it('GridIsEqualUtils', function() {
         var isDataChanged = false;
         if (!GridIsEqualUtil.isEqualWithSkip(header, newHeader, { template: true })) {
            isDataChanged = true;
         }
         assert.equal(false, isDataChanged, 'GridIsEqualUtils template ~ Object');
         newHeader[1].template = 'Newtemplate'

         if (!GridIsEqualUtil.isEqualWithSkip(header, newHeader, { template: true })) {
            isDataChanged = true;
         }
         assert.equal(true, isDataChanged, 'GridIsEqualUtils template ~ String');
      })
      it('GridIsEqualUtils with empty object', function() {
         var isDataChanged = false;
         if (!GridIsEqualUtil.isEqualWithSkip(Data1, Data2, { template: true })) {
            isDataChanged = true;
         }
         assert.equal(true, isDataChanged);
      })
   })
})
