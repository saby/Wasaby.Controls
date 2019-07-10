define([
   'Controls/_grid/utils/GridLayoutUtil',
   'Env/Env',
   'Core/core-clone'
], function (Util, Env, cClone) {

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
         assert.equal(Util.getCellStyles(1, 9), 'grid-column: 10 / 11; grid-row: 2;');
      });

      describe('detect grid support', () => {
         let nativeDetection = cClone(Env.detection);
         afterEach(()=>{
            Env.detection = nativeDetection;
         });

         it('modern chrome is full grid support', () => {
            Env.detection.isNotFullGridSupport = false;
            assert.isTrue(Util.isFullGridSupport());
            assert.isFalse(Util.isPartialGridSupport());
            assert.isFalse(Util.isNoGridSupport());
         });
         it('safari is full grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: false,
               isIE: false,
               isModernIE: false,
               safari: true,
               isNoGridSupport: true
            };
            assert.isTrue(Util.isFullGridSupport());
            assert.isFalse(Util.isPartialGridSupport());
            assert.isFalse(Util.isNoGridSupport());
         });
         it('Edge is partial grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: false,
               isIE: true,
               isModernIE: true,
               safari: false,
               isNoGridSupport: true
            };
            assert.isFalse(Util.isFullGridSupport());
            assert.isTrue(Util.isPartialGridSupport());
            assert.isFalse(Util.isNoGridSupport());
         });
         it('IE>9 is partial grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: false,
               isIE: true,
               isModernIE: true,
               safari: false,
               isNoGridSupport: true
            };
            assert.isFalse(Util.isFullGridSupport());
            assert.isTrue(Util.isPartialGridSupport());
            assert.isFalse(Util.isNoGridSupport());
         });
         it('chrome xp in no grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: true,
               isIE: false,
               isModernIE: false,
               safari: false,
               isNoGridSupport: true
            };
            assert.isFalse(Util.isFullGridSupport());
            assert.isFalse(Util.isPartialGridSupport());
            assert.isTrue(Util.isNoGridSupport());
         });

      });
   });

});



