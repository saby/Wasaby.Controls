/*TODO Пока не распилят ядро некуда положить тесты на этот хелпер, пока они будут тут*/
describe('$ws.helpers', function () {
   describe('.prepareMoneyByPrecision()', function () {
      it('should add the 0 to the right until the decrease percission', function () {
         assert.strictEqual($ws.helpers.prepareMoneyByPrecision('1.102', 5), '1.10200');
         assert.strictEqual($ws.helpers.prepareMoneyByPrecision('1', 5), '1.00000');
      });
      it('should cut the 0 to the right until the decrease percission', function () {
         var m = '1.1025699999';
         assert.strictEqual($ws.helpers.prepareMoneyByPrecision(m, 5), '1.10256');
      });
      it('should return string as is', function () {
         var m = '1.10256';
         assert.strictEqual($ws.helpers.prepareMoneyByPrecision(m, 5), m);
      });
   });
});
