
define(['Controls/_grid/utils/GridIsEqualUtil'], function(GridIsEqualUtil) {
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
   })
})
