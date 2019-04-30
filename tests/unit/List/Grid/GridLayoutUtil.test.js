define([
   'Controls/_list/utils/GridLayoutUtil'
], function (Util) {

   describe('Controls/_grid/GridLayoutUtil', function () {
      it('toCssString', function () {

         assert.equal(Util.toCssString([
            {
               name: 'qwe',
               value: 'zxc'
            },
            {
               name: 'rty',
               value: 12
            },
            {
               name: 'rty',
               value: '12/2'
            }
         ]), 'qwe: zxc; rty: 12; rty: 12/2;');
      });

      it('getTemplateColumnsStyle', function () {

         assert.equal(Util.getTemplateColumnsStyle(['1fr', '228px', 'auto', '1488fr']),
             'grid-template-columns: 1fr 228px auto 1488fr;'
         );
      });

      it('getCellStyles', function () {
         assert.equal(Util.getCellStyles(1, 9), 'grid-column: 10; grid-column-start: 10; grid-row: 2;');
      });

      it('getCellStyles', function () {
         assert.equal(Util.getCellStyles(1, 9), 'grid-column: 10; grid-column-start: 10; grid-row: 2;');
      });

   });

});



