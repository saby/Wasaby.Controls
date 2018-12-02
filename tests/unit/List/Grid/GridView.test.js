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
         assert.equal(preparedColumnsWithMultiselect, GridView._private.prepareGridTemplateColumns(gridColumns, 'visible'),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, true)".');
         assert.equal(preparedColumnsWithoutMiltiselect, GridView._private.prepareGridTemplateColumns(gridColumns, 'hidden'),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, false)".');
      });
      it('Footer', function() {
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_S',
            GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'onhover', paddingLeft: 'S' }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: onhover, paddingLeft: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_withCheckboxes',
            GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'visible', paddingLeft: 'S' }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: visible, paddingLeft: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_S',
            GridView._private.calcFooterPaddingClass({ paddingLeft: 'S' }),
            'Incorrect result "calcFooterPaddingClass({paddingLeft: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_default',
            GridView._private.calcFooterPaddingClass({ }),
            'Incorrect result "calcFooterPaddingClass({ })".');
      });
      
   });
});
