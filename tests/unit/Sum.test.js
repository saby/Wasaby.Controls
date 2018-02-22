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

      it('Sum float with bug', function (done) {
         var forSum = new RecordSet({
            rawData: [ { number: 1.6 }, { number: 2.2 } ]
         });
         sum._sumByRecordSet(forSum, forSum.getFormat()).addCallback(function(sumRecord) {
            assert.equal(sumRecord.get('number'), 3.8);
            done();
         });
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