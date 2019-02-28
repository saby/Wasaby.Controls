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
      it('GridView.detectLayoutFixed', function() {
         var
            columns1 = [
               { width: '1fr'   },
               { width: '100px' },
               { width: '30%'   }
            ],
            columns2 = [
               { width: '1fr'   },
               { width: '100px' },
               { width: '30%'   },
               {}
            ],
            columns3 = [
               { width: '1fr'   },
               { width: '100px' },
               { width: '30%'   },
               { width: 'auto'  }
            ],
            columns4 = [
               { width: '1fr'   },
               { width: '100px' },
               { width: '30%'   },
               { width: 'auto'  },
               {}
            ],
            result1 = {}, result2 = {}, result3 = {}, result4 = {};
         GridView._private.detectLayoutFixed(result1, columns1);
         GridView._private.detectLayoutFixed(result2, columns2);
         GridView._private.detectLayoutFixed(result3, columns3);
         GridView._private.detectLayoutFixed(result4, columns4);
         assert.isTrue(result1._layoutFixed);
         assert.isTrue(!result2._layoutFixed);
         assert.isTrue(!result2._layoutFixed);
         assert.isTrue(result4._layoutFixed);
      });
      it('Footer', function() {
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_withCheckboxes',
            GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'onhover', itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: onhover, itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_withCheckboxes',
            GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'visible', itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: visible, itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_s',
            GridView._private.calcFooterPaddingClass({ itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_default',
            GridView._private.calcFooterPaddingClass({ }),
            'Incorrect result "calcFooterPaddingClass({ })".');
      });
      it('beforeUpdate', function() {
         var
            superclassBeforeUpdateCalled = false,
            cfg = {
               columns: [
                  { displayProperty: 'field1', template: 'column1' },
                  { displayProperty: 'field2', template: 'column2' }
               ]
            },
            gridView = new GridView(cfg),
            superclassBeforeUpdate = GridView.superclass._beforeUpdate;
         gridView.saveOptions(cfg);
         GridView.superclass._beforeUpdate = function() {
            superclassBeforeUpdateCalled = true;
            superclassBeforeUpdate.apply(this, arguments);
         };
         gridView._beforeUpdate(cfg);
         GridView.superclass._beforeUpdate = superclassBeforeUpdate;
         assert.isTrue(superclassBeforeUpdateCalled, 'Superclass method not called in "_beforeUpdate".');
      });
   });
});
