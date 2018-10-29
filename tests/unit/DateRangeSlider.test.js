define([
   'SBIS3.CONTROLS/Date/RangeSlider'
], function (DateRangeSlider) {
   'use strict';

   let controlTestCase = function (withClock) {
      let clock;

      // Попытка вынести общую логику тестов, не уверен что правильная.. Пусть пока полежит здесь.
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
            return;
         }

         if (withClock) {
            clock = sinon.useFakeTimers(now.getTime(), 'Date');
         }

         var cfg = this.controlConfig || {};
         this.container = $('<div id="component"></div>').appendTo('#mocha');
         cfg.element = this.container;
         this.testControl = new this.controlClass(this.controlConfig);
      });

      afterEach(function () {
         withClock && clock && clock.restore();

         this.testControl.destroy();
         this.testControl = undefined;
         this.container && this.container.remove();
         this.container = undefined;
      });
   };

   describe('SBIS3.CONTROLS.DateRangeSlider', function () {
      // this.timeout(1500000);
      before(function() {
         this.controlClass = DateRangeSlider;
      });

      beforeEach(function() {
         this.controlConfig = {};
      });

      describe('AutoValue tests', function () {
         controlTestCase();

         it('should generate only "startValueChanged" event if period changed from 01.01.2018-31.01.2018 to 01.01.2018-31.12.2018.', function () {
            let startValueChanged = sinon.spy(),
               endValueChanged = sinon.spy(),
               rangeChanged = sinon.spy();

            this.testControl.setRange(new Date(2018, 0, 1), new Date(2018, 0, 31));
            this.testControl.subscribe('onStartValueChange', startValueChanged);
            this.testControl.subscribe('onEndValueChange', endValueChanged);
            this.testControl.subscribe('onRangeChange', rangeChanged);
            this.testControl.setRange(new Date(2018, 0, 1), new Date(2018, 11, 31));
            assert(startValueChanged.notCalled, `startValueChanged called ${startValueChanged.callCount}`);
            assert(endValueChanged.calledOnce, `endValueChanged called ${endValueChanged.callCount}`);
            assert(rangeChanged.calledOnce, `rangeChanged called ${rangeChanged.rangeChanged}`);
         });

         it('should generate only "endValueChanged" event if period changed from 01.12.2018-31.12.2018 to 01.01.2018-31.12.2018.', function () {
            let startValueChanged = sinon.spy(),
               endValueChanged = sinon.spy(),
               rangeChanged = sinon.spy();

            this.testControl.setRange(new Date(2018, 11, 1), new Date(2018, 11, 31));
            this.testControl.subscribe('onStartValueChange', startValueChanged);
            this.testControl.subscribe('onEndValueChange', endValueChanged);
            this.testControl.subscribe('onRangeChange', rangeChanged);
            this.testControl.setRange(new Date(2018, 0, 1), new Date(2018, 11, 31));
            assert(startValueChanged.calledOnce, `startValueChanged called ${startValueChanged.callCount}`);
            assert(endValueChanged.notCalled, `endValueChanged called ${endValueChanged.callCount}`);
            assert(rangeChanged.calledOnce, `rangeChanged called ${rangeChanged.rangeChanged}`);
         });

         it('should generate all events if period changed from one year to another.', function () {
            let startValueChanged = sinon.spy(),
               endValueChanged = sinon.spy(),
               rangeChanged = sinon.spy();

            this.testControl.setRange(new Date(2018, 0, 1), new Date(2018, 11, 31));
            this.testControl.subscribe('onStartValueChange', startValueChanged);
            this.testControl.subscribe('onEndValueChange', endValueChanged);
            this.testControl.subscribe('onRangeChange', rangeChanged);
            this.testControl.setRange(new Date(2019, 0, 1), new Date(2019, 11, 31));
            assert(startValueChanged.calledOnce, `startValueChanged called ${startValueChanged.callCount}`);
            assert(endValueChanged.calledOnce, `endValueChanged called ${endValueChanged.callCount}`);
            assert(rangeChanged.calledOnce, `rangeChanged called ${rangeChanged.rangeChanged}`);
         });
      });
   });
});
