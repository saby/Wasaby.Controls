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
         assert.equal(Util.getCellStyles({rowStart: 1, columnStart: 9}), 'grid-column-start: 10; grid-column-end: 11; grid-row-start: 2; grid-row-end: 3;');
      });

      describe('detect grid support', () => {
         let nativeDetection = cClone(Env.detection);
         afterEach(()=>{
            Env.detection = nativeDetection;
         });

         it('modern chrome is full grid support', () => {
            Env.detection.isNotFullGridSupport = false;
            assert.isTrue(Util.isFullGridSupport());
         });
         it('safari ver >=12 is full grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               IOSVersion: 12,
               isWinXP: false,
               isIE: false,
               isModernIE: false,
               safari: true,
               isMacOSDesktop: false,
               isNoGridSupport: true
            };
            assert.isTrue(Util.isFullGridSupport());
         });
         it('safari desktop is full grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: false,
               isIE: false,
               isModernIE: false,
               safari: true,
               isMacOSDesktop: true,
               isNoGridSupport: true
            };
            assert.isTrue(Util.isFullGridSupport());
         });
         it('safari ver <12 is partial grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: false,
               isIE: false,
               IOSVersion: 11,
               isModernIE: false,
               safari: true,
               isMacOSDesktop: false,
               isNoGridSupport: true
            };
            assert.isFalse(Util.isFullGridSupport());
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
         });
         it('chrome in xp is no grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: true,
               yandex: false,
               isIE: false,
               isModernIE: false,
               safari: false,
               isNoGridSupport: true
            };
            assert.isFalse(Util.isFullGridSupport());
         });
         it('yandex in xp is partial grid support', () => {
            Env.detection = {
               isNotFullGridSupport: true,
               isWinXP: true,
               yandex: true,
               isIE: false,
               isModernIE: false,
               safari: false,
               isNoGridSupport: false
            };
            assert.isFalse(Util.isFullGridSupport());
         });
         it('mozila in xp is no grid support', () => {
            Env.detection = {
               isNotFullGridSupport: false,
               isWinXP: true,
               yandex: false,
               isIE: false,
               isModernIE: false,
               safari: false,
               isNoGridSupport: false,
               firefox: true
            };
            assert.isFalse(Util.isFullGridSupport());
         });

      });
   });

});
