define(['Controls/List/Grid/GridView'], function(GridView) {
   var
      gridColumns = [
         {
            displayProperty: 'title'
         },
         {
            displayProperty: 'price',
            width: 'auto'
         },
         {
            displayProperty: 'balance',
            width: '100px'
         },
         {
            displayProperty: 'rest',
            width: '1fr'
         }
      ],
      preparedColumnsWithMultiselect = 'auto 1fr auto 100px 1fr ',
      preparedColumnsWithoutMiltiselect = '1fr auto 100px 1fr ';

   describe('Controls.List.Grid.GridView', function() {
      it('GridView.prepareGridTemplateColumns', function() {
         assert.equal(preparedColumnsWithMultiselect, GridView._private.prepareGridTemplateColumns(gridColumns, true),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, true)".');
         assert.equal(preparedColumnsWithoutMiltiselect, GridView._private.prepareGridTemplateColumns(gridColumns, false),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, false)".');
      });
      
   });
});
