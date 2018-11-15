/**
 * Created by as.krasilnikov on 25.10.16.
 */
define(['SBIS3.CONTROLS/Action/List/Sum', 'WS.Data/Collection/RecordSet', 'WS.Data/Format/Format', 'WS.Data/Format/Field'], function (Sum, RecordSet, Format, FormatField) {

   'use strict';
   describe('SBIS3.CONTROLS/Action/List/Sum', function () {
      var sum;
      before(function() {
         if (typeof $ !== 'undefined') {
            sum = new Sum({
               fields: {
                  number: 'number'
               }
            });
         }
      });
      after(function () {
         if (typeof $ !== 'undefined') {
            sum.destroy();
         }
         sum = undefined;
      });

      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });

      it('Sum float with bug', function() {
         assert.equal(Sum._private.sum(1.6, 2.2), 3.8);
         assert.equal(Sum._private.sum(0.1, 0.7), 0.8);
         assert.equal(Sum._private.sum(0.000000001, 0.000000007), 0.000000008);
         assert.equal(Sum._private.sum(0.11, 0.7), 0.81);
      });

      it('getDecimalCount', function() {
         assert.equal(Sum._private.getDecimalCount(0.1), 1);
         assert.equal(Sum._private.getDecimalCount(3), 0);
         assert.equal(Sum._private.getDecimalCount(3.00), 0);
         assert.equal(Sum._private.getDecimalCount(3.070), 2);
      });

      it('Sum without fields', function (done) {
         var forSum = new RecordSet({
            rawData: [ { number: undefined }, { number: 2.2 } ]
         });
         sum._sumByRecordSet(forSum, forSum.getFormat()).addCallback(function(sumRecord) {
            assert.equal(sumRecord.get('number'), 2.2);
            done();
         });
      });

   });
});