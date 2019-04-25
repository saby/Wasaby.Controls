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
      preparedColumnsWithMultiselect = 'grid-template-columns: auto 1fr auto 100px 1fr;',
      preparedColumnsWithoutMiltiselect = 'grid-template-columns: 1fr auto 100px 1fr;';

   describe('Controls.List.Grid.GridView', function() {
      it('GridView.prepareGridTemplateColumns', function() {
         assert.equal(preparedColumnsWithMultiselect, GridView._private.getGridTemplateColumns(gridColumns, 'visible'),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, true)".');
         assert.equal(preparedColumnsWithoutMiltiselect, GridView._private.getGridTemplateColumns(gridColumns, 'hidden'),
            'Incorrect result "prepareGridTemplateColumns(gridColumns, false)".');
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

      it('should update columns widths only after mount', function () {
         var
             called = false,
             cells = [],
             gv = {
                _listModel: {
                   setCurrentColumnsWidth: function () {
                      called = true;
                   }
                }
             },
             container = {
                getElementsByClassName: function () {
                   return cells
                }
             };
         GridView._private.setCurrentColumnsWidth(gv, container);
         assert.isFalse(called);

         cells = [1,2];
         GridView._private.setCurrentColumnsWidth(gv, container);
         assert.isTrue(called);

      });
   });
});
