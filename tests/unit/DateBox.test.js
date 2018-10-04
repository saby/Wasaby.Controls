define(['Core/constants', 'SBIS3.CONTROLS/Date/Box', 'SBIS3.CONTROLS/Utils/ControlsValidators'], function (constants, DateBox, ControlsValidators) {
   'use strict';

   let requiredValidator = [{validator: ControlsValidators.required}],
      now = new Date(2017, 0, 1);

   var controlTestCase = function (withClock) {
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


   describe('SBIS3.CONTROLS/Date/Box', function () {

      describe('._createAutocomplitedDate ', function () {

         let year = now.getFullYear(), month = now.getMonth(), date = now.getDate(),
            tests = [
               // Заполнен день, месяц
               [[null, 11, 11, null, null], new Date(year, 11, 11), 'DD.MM.YY', []], // Подставляем текущий год
               [[null, null, 11, null, null], new Date(year, month, 11), 'DD.MM.YY', []], // Подставляем текущий месяц и год
               // Заполнен текущий год
               [[year, null, 11, null, null], new Date(year, month, 11), 'DD.MM.YY', []], // Подставляем текущий месяц
               [[year, null, null, null, null], new Date(year, month, date), 'DD.MM.YY', []], // Подставляем текущий день и месяц
               // Заполнен текущий год и месяц
               [[year, month, null, null, null], new Date(year, month, date), 'DD.MM.YY', []], // Подставляем текущий день
               // Заполнен год, отличный от текущего
               [[2000, null, 11, null, null], new Date(2000, 0, 11), 'DD.MM.YY', []], // Подставляем 01
               [[2000, null, null, null, null], new Date(2000, 0, 1), 'DD.MM.YY', []], // Подставляем 01.01
               // Заполнен год, отличный от текущего и месяц
               [[2000, month + 1, null, null, null], new Date(2000, month + 1, 1), 'DD.MM.YY', []], // Подставляем 1
               // Поле полностью не заполнено
               [[null, null, null, null, null], null, 'DD.MM.YY', []],
               [[null, null, null, null, null], now, 'DD.MM.YY', requiredValidator],
               // остальные случаи
               [[null, 1, null, null, null], null, 'DD.MM.YY', []],

               [[null, null, null, null, null], null, 'DD.MM', []],

               [[2000, 1, 1, 10, null], new Date(2000, 1, 1, 10, 0), 'HH:II', []],
               [[null, null, null, null, 10], null, 'HH:II', []],
               [[2000, 1, 1, null, 10], null, 'HH:II', []],
         ];
         DateBox.prototype._options = {};

         let clock;
         beforeEach(() => {
            clock = sinon.useFakeTimers(now.getTime(), 'Date');
         });
         afterEach(() => {
            clock && clock.restore();
         });

         tests.forEach(function (test, index) {
            it('should return "' + (test[1] ? test[1].toISOString() : 'null') + '" for year=' + test[0][0] +
                  ', month=' + test[0][1] + ', date=' + test[0][2] + ', hours=' + test[0][3] +
                  ', minutes=' + test[0][4] + ', mask= ' + test[2], function () {
               DateBox.prototype._options.mask = test[2];
               DateBox.prototype._options.validators = test[3];
               var ret = DateBox.prototype._createAutocomplitedDate(
                 test[0][0], test[0][1], test[0][2], test[0][3], test[0][4], null, null
               );
               // console.log(ret.toString());
               assert.deepEqual(ret, test[1]);
            });
         });
      });

      // this.ctx.initialDate = new Date(2016, 1, 2, 3, 4, 5, 6);
      //
      // Добавляем опции нужные конкретно этим тестам.
      // Подумать как можно переиспользовать настройки DateBox и базовые общие тесты для DatePicker.
      // this.ctx.controlConfig = {
      //    date: this.ctx.initialDate
      // };

      before(function() {
         this.controlClass = DateBox;
      });

      beforeEach(function() {
         this.controlConfig = {};
      });

      describe('initialization', function () {
         before(function() {
            this.controlConfig.validators = [];
         });
         // Этот вызов должен быть во внешнем describe, но тогда мы не сможем модифицировать опции во внутренних describe.
         controlTestCase();

         it('should add 2 validators', function () {
            assert.lengthOf(this.testControl._options.validators, 2);
         });

         it('should not modify validators array from options', function () {
            assert.notStrictEqual(this.testControl._options.validators, this.controlConfig.validators);
         });
      });

      describe('auto set century with YY year mask', function () {
         before(function() {
            this.controlConfig.mask = 'DD.MM.YY';
         });
         // Этот вызов должен быть во внешнем describe, но тогда мы не сможем модифицировать опции во внутренних describe.
         controlTestCase();

         it('should be current century if short year less then current year + 10', function () {
            var date = new Date();
            date.setYear(date.getFullYear() + 9);
            this.testControl.setText('01.02.00');
            assert.equal(this.testControl.getDate().getFullYear(), 2000);
            this.testControl.setText('01.02.05');
            assert.equal(this.testControl.getDate().getFullYear(), 2005);
            this.testControl.setText(date.strftime('%d.%m.%y'));
            assert.equal(this.testControl.getDate().getFullYear(), date.getFullYear());
         });

         it('should be last century if short year greater than current year + 10', function () {
            var date = new Date();
            date.setYear(date.getFullYear() + 11);
            this.testControl.setText(date.strftime('%d.%m.%y'));
            assert.equal(this.testControl.getDate().getFullYear(), date.getFullYear() - 100);
         });
      });

      describe('_getDateByText mask = "DD.MM.YYYY"', function() {
         controlTestCase();

         it('should return null if year is equal 0', function() {
            this.testControl.setMask('DD.MM.YYYY');
            assert.isNull(this.testControl._getDateByText('01.01.0000', null, false));
         });
      });

      describe('.setText', function () {
         controlTestCase(true);
         it('should generate onTextChange and onDateChange events', function () {
            let onTextChange = sinon.spy(),
               onDateChange = sinon.spy(),
               onPropertiesChanged = sinon.spy(),
               onPropertyChanged = sinon.spy();
            this.testControl.subscribe('onTextChange', onTextChange);
            this.testControl.subscribe('onDateChange', onDateChange);
            this.testControl.subscribe('onPropertiesChanged', onPropertiesChanged);
            this.testControl.subscribe('onPropertyChanged', onPropertyChanged);
            this.testControl.setText('11.11.11');
            assert(onTextChange.calledOnce, `onTextChange called ${onTextChange.callCount}`);
            assert(onDateChange.calledOnce, `onDateChange called ${onDateChange.callCount}`);
            // onPropertiesChanged вызывается 2 раза. Если будет актуально, то в будущем можно оптимизировать избавившись от лишних вызовов.
            assert(onPropertiesChanged.calledTwice, `onPropertiesChanged called ${onPropertiesChanged.callCount}`);
            assert(onPropertyChanged.calledTwice, `onPropertyChanged called ${onPropertyChanged.callCount}`);
         });
      });

      describe('.setDate', function () {
         controlTestCase(true);
         it('should generate "onDateChange" in case dateBox.setDate(date, true); dateBox.setDate(null);', function () {
            let onDateChange = sinon.spy();
            this.testControl.setDate(new Date(), true);
            this.testControl.subscribe('onDateChange', onDateChange);
            this.testControl.setDate(null);
            assert.isNull(this.testControl.getDate());
            assert(onDateChange.calledOnce, `onDateChange called ${onDateChange.callCount}`);
         });
      });

      describe('._onKeyDown', function () {
         controlTestCase(true);
         it('should not change control properties if control disabled', function () {
            let sandbox = sinon.sandbox.create(),
               date = this.testControl.getDate(),
               text = this.testControl.getText();
            sandbox.stub(this.testControl, 'setDate');
            sandbox.stub(this.testControl, 'setText');
            this.testControl.setEnabled(false);
            this.testControl._onKeyDown();
            assert(this.testControl.setDate.notCalled, `setDate called ${this.testControl.setDate.callCount}`);
            assert(this.testControl.setText.notCalled, `setText called ${this.testControl.setText.callCount}`);
            assert.strictEqual(this.testControl.getDate(), date);
            assert.strictEqual(this.testControl.getText(), text);
            sandbox.restore();
         });

         let dateMasks = ['DD.MM.YYYY', 'DD.MM.YY', 'DD.MM', 'YYYY-MM-DD', 'YY-MM-DD', 'DD.MM.YYYY HH:II:SS.UUU',
               'DD.MM.YYYY HH:II:SS', 'DD.MM.YYYY HH:II', 'DD.MM.YY HH:II:SS.UUU', 'DD.MM.YY HH:II:SS',
               'DD.MM.YY HH:II', 'DD.MM HH:II:SS.UUU', 'DD.MM HH:II:SS', 'DD.MM HH:II', 'YYYY-MM-DD HH:II:SS.UUU',
               'YYYY-MM-DD HH:II:SS', 'YYYY-MM-DD HH:II', 'YY-MM-DD HH:II:SS.UUU', 'YY-MM-DD HH:II:SS', 'YY-MM-DD HH:II'],
         timeMasks = ['HH:II:SS.UUU', 'HH:II:SS', 'HH:II'];

         describe('+ key click', function () {
            dateMasks.forEach(function (mask) {
               it(`should increase date if mask = ${mask}`, function () {
                  let date = 1;
                  this.testControl._options.mask = mask;
                  this.testControl._options.date = new Date(2017, 0, date);
                  this.testControl._keyDownBind({which: constants.key.plus, preventDefault: function () {}});
                  assert.equal(this.testControl.getDate().toSQL(), (new Date(2017, 0, date + 1)).toSQL());
               });
            });

            timeMasks.forEach(function (mask) {
               it(`should not increase date if mask = ${mask}`, function () {
                  let date = 1;
                  this.testControl._options.mask = mask;
                  this.testControl._options.date = new Date(2017, 0, date);
                  this.testControl._keyDownBind({which: constants.key.plus, preventDefault: function () {}});
                  assert.equal(this.testControl.getDate().toSQL(), (new Date(2017, 0, date)).toSQL());
               });
            });
         });
         describe('- key click', function () {
            dateMasks.forEach(function (mask) {
               it(`should decrease date if mask = ${mask}`, function () {
                  let date = 1;
                  this.testControl._options.mask = mask;
                  this.testControl._options.date = new Date(2017, 0, date);
                  this.testControl._keyDownBind({which: constants.key.minus, preventDefault: function () {}});
                  assert.equal(this.testControl.getDate().toSQL(), (new Date(2017, 0, date - 1)).toSQL());
               });
            });

            timeMasks.forEach(function (mask) {
               it(`should not decrease date if mask = ${mask}`, function () {
                  let date = 1;
                  this.testControl._options.mask = mask;
                  this.testControl._options.date = new Date(2017, 0, date);
                  this.testControl._keyDownBind({which: constants.key.minus, preventDefault: function () {}});
                  assert.equal(this.testControl.getDate().toSQL(), (new Date(2017, 0, date)).toSQL());
               });
            });
         });
      });

      describe('._onKeyPress', function () {
         controlTestCase(true);
         it('should not change control properties if control disabled', function () {
            let sandbox = sinon.sandbox.create(),
               date = this.testControl.getDate(),
               text = this.testControl.getText();
            sandbox.stub(this.testControl, 'setDate');
            sandbox.stub(this.testControl, 'setText');
            this.testControl.setEnabled(false);
            this.testControl._onKeyPress();
            assert(this.testControl.setDate.notCalled, `setDate called ${this.testControl.setDate.callCount}`);
            assert(this.testControl.setText.notCalled, `setText called ${this.testControl.setText.callCount}`);
            assert.strictEqual(this.testControl.getDate(), date);
            assert.strictEqual(this.testControl.getText(), text);
            sandbox.restore();
         });
      });

      describe('.getDate', function () {
         let date = new Date();
         beforeEach(function () {
            this.controlConfig.mask = 'HH:II';
            this.controlConfig.date = date;
         });

         afterEach(function () {
            delete this.controlConfig.mask;
         });
         controlTestCase();
         it('should return new Date object if serialisation mode set incorrectly', function () {

            assert.notStrictEqual(date, this.testControl.getDate());
            assert.equal(date.getTime(), this.testControl.getDate().getTime());
         });
      });

      describe('.setDate + .getDate', function () {
         beforeEach(function () {
            this.controlConfig.mask = 'DD.MM.YY HH:II';
         });

         afterEach(function () {
            delete this.controlConfig.mask;
         });
         controlTestCase();
         it('should not change date object from setDate if serializationMode is wrong', function () {
            let date = new Date(), date2;
            this.testControl.setDate(date);
            date2 = this.testControl.getDate();
            assert.equal(date.getTime(), date2.getTime());
            assert.notEqual(date, date2);
         });
         it('should set properly serializationMode', function () {
            let date = new Date(), date2;
            this.testControl.setDate(date);
            date2 = this.testControl.getDate();
            assert.equal(date.getSQLSerializationMode(), Date.SQL_SERIALIZE_MODE_DATE);
            assert.equal(date2.getSQLSerializationMode(), Date.SQL_SERIALIZE_MODE_DATETIME);
         });
      });
   });
});
