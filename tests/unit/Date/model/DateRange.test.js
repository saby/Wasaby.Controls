define([
   'Controls/Date/model/DateRange'
], function(
   DateRange
) {
   'use strict';

   describe('Controls/Date/model/DateRange', function() {
      describe('.update', function() {

         it('should update [start|end]Value and _options.[start|end]Value fields', function() {
            let model = new DateRange(),
               options = {
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 0, 3)
               };

            model.update(options);

            assert.strictEqual(model.startValue, options.startValue);
            assert.strictEqual(model._options.startValue, options.startValue);
            assert.strictEqual(model.endValue, options.endValue);
            assert.strictEqual(model._options.endValue, options.endValue);
         });

         it('should not update [start|end]Value fields if they were not updated from the outside', function() {
            let model = new DateRange(),
               options = {
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 0, 3)
               };

            model._options.startValue = options.startValue;
            model._options.endValue = options.endValue;
            model.update(options);

            assert.isNull(model.startValue);
            assert.isNull(model.endValue);
         });
      });

      ['startValue', 'endValue'].forEach(function(field) {
         describe(`.${field}`, function() {
            it(`should update ${field} if value changed`, function() {
               let model = new DateRange(),
                  value = new Date(2018, 0, 1),
                  callback = sinon.spy();

               model.subscribe(`${field}Changed`, callback);
               model[field] = value;

               assert.strictEqual(model[field], value);
               assert(callback.calledOnce, `${field}Changed callback called ${callback.callCount} times`);
               assert.isUndefined(model._options[field]);
            });

            it(`should not update ${field} if value did not changed`, function() {
               let model = new DateRange(),
                  value = new Date(2018, 0, 1),
                  callback = sinon.spy(),
                  options = {};

               options[field] = value;
               model.update(options);

               model.subscribe(`${field}Changed`, callback);
               model[field] = value;

               assert.strictEqual(model[field], value);
               assert(callback.notCalled, `${field}Changed callback called ${callback.callCount} times`);
               assert.strictEqual(model._options[field], value);
            });
         });
      });

      describe('.shiftForward', function() {
         [
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 0, 31),
               rStart: new Date(2018, 1, 1),
               rEnd: new Date(2018, 1, 28)
            }, {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 2, 31),
               rStart: new Date(2018, 3, 1),
               rEnd: new Date(2018, 5, 30)
            }, {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 5, 30),
               rStart: new Date(2018, 6, 1),
               rEnd: new Date(2018, 11, 31)
            }
         ].forEach(function(test) {
            it('should shift period forward', function() {
               let model = new DateRange();

               model.update({ startValue: test.start, endValue: test.end });
               model.shiftForward();

               assert.equal(model.startValue.getTime(), test.rStart.getTime());
               assert.equal(model.endValue.getTime(), test.rEnd.getTime());
            });
         });
      });

      describe('.shiftBack', function() {
         [
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 0, 31),
               rStart: new Date(2017, 11, 1),
               rEnd: new Date(2017, 11, 31)
            }, {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 2, 31),
               rStart: new Date(2017, 9, 1),
               rEnd: new Date(2017, 11, 31)
            }, {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 5, 30),
               rStart: new Date(2017, 6, 1),
               rEnd: new Date(2017, 11, 31)
            }
         ].forEach(function(test) {
            it('should shift period back', function() {
               let model = new DateRange();

               model.update({ startValue: test.start, endValue: test.end });
               model.shiftBack();

               assert.equal(model.startValue.getTime(), test.rStart.getTime());
               assert.equal(model.endValue.getTime(), test.rEnd.getTime());
            });
         });
      });

   });
});
