define(['SBIS3.CONTROLS/Date/Picker'], function (DatePicker) {
   'use strict';

   describe('SBIS3.CONTROLS/Date/Picker', function () {

      describe('._modifyOptions', function () {
         let time = 'time',
            calendar = 'calendar',
            sandbox = sinon.sandbox.create();

         beforeEach(function () {
            sandbox.stub(DatePicker.superclass, '_modifyOptions').returnsArg(0);
         });

         afterEach(function () {
            sandbox.restore();
         });

         let tests = [
            ['HH:II', time],
            ['HH:II:SS', undefined],
            ['HH:II:SS.UUU', undefined],
            ['DD.MM.YYYY', calendar],
            ['DD.MM.YY', calendar],
            ['YYYY-MM-DD', calendar],
            ['YY-MM-DD', calendar],
            ['DD.MM.YYYY HH:II:SS.UUU', calendar],
            ['DD.MM.YYYY HH:II:SS', calendar],
            ['DD.MM.YYYY HH:II', calendar],
            ['DD.MM.YY HH:II:SS.UUU', calendar],
            ['DD.MM.YY HH:II:SS', calendar],
            ['DD.MM.YY HH:II', calendar],
            ['DD.MM HH:II:SS.UUU', calendar],
            ['DD.MM HH:II:SS', calendar],
            ['DD.MM HH:II', calendar],
            ['YYYY-MM-DD HH:II:SS.UUU', calendar],
            ['YYYY-MM-DD HH:II:SS', calendar],
            ['YYYY-MM-DD HH:II', calendar],
            ['YY-MM-DD HH:II:SS.UUU', calendar],
            ['YY-MM-DD HH:II:SS', calendar],
            ['YY-MM-DD HH:II', calendar],
            ['YYYY', calendar],
            ['MM/YYYY', calendar]
         ];
         tests.forEach(function (test, index) {
            it(`should set _pickerName options to "${test[1]}" if mask options is equal "${test[0]}"`, function () {
               let options = {mask: test[0]};
               DatePicker.prototype._modifyOptions(options);
               assert.strictEqual(options._pickerName, test[1]);
            });
         });
      });

      describe('tests with dom', function () {
         var
         testControl,
         container,
         initialDate = new Date(2016, 1, 2, 3, 4, 5, 6);

         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            else {
               container = $('<div id="component"></div>').appendTo('#mocha');
               testControl = new DatePicker({
                  element: container,
                  date: initialDate
               });
            }
         });

         afterEach(function () {
            testControl.destroy();
            testControl = undefined;
            container && container.remove();
            container = undefined;
         });

         it('should be leave unchanged time after date has been chosen in picker', function () {
            var date,
               newDate = new Date(2011, 1, 11);
            testControl._onChooserChange(null, newDate);
            date = testControl.getDate();
            assert.instanceOf(date, Date);
            assert.equal(date.getYear(), newDate.getYear());
            assert.equal(date.getMonth(), newDate.getMonth());
            assert.equal(date.getDate(), newDate.getDate());
            assert.equal(date.getHours(), initialDate.getHours());
            assert.equal(date.getMinutes(), initialDate.getMinutes());
            assert.equal(date.getSeconds(), initialDate.getSeconds());
            assert.equal(date.getMilliseconds(), initialDate.getMilliseconds());
         });
      });

   });
});
