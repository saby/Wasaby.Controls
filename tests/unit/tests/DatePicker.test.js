define(['js!SBIS3.CONTROLS.DatePicker'], function (DatePicker) {
   'use strict';

   describe('SBIS3.CONTROLS.DatePicker', function () {
      var
         testControl,
         container,
         initialDate = new Date(2016, 1, 2, 3, 4, 5, 6);

      beforeEach(function () {
         container = $('<div id="component"></div>').appendTo('#mocha');
         testControl = new DatePicker({
            element: container,
            date: initialDate
         });
      });

      afterEach(function () {
         testControl.destroy();
         testControl = undefined;
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
