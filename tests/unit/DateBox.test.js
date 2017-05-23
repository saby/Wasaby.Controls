define(['js!SBIS3.CONTROLS.DateBox'], function (DateBox) {
   'use strict';

   var controlTestCase = function () {
      // Попытка вынести общую логику тестов, не уверен что правильная.. Пусть пока полежит здесь.
      beforeEach(function () {
         var cfg = this.controlConfig || {};
         this.container = $('<div id="component"></div>').appendTo('#mocha');
         cfg.element = this.container;
         this.testControl = new this.controlClass(this.controlConfig);
      });

      afterEach(function () {
         this.testControl.destroy();
         this.testControl = undefined;
         this.container = undefined;
      });
   };

   describe('SBIS3.CONTROLS.DateBox', function () {
      // this.ctx.initialDate = new Date(2016, 1, 2, 3, 4, 5, 6);
      //
      this.ctx.controlClass = DateBox;
      // Добавляем опции нужные конкретно этим тестам.
      // Подумать как можно переиспользовать настройки DateBox и базовые общие тесты для DatePicker.
      // this.ctx.controlConfig = {
      //    date: this.ctx.initialDate
      // };
      this.ctx.controlConfig = {};

      describe('auto set century with YY year mask', function () {
         this.ctx.controlConfig.mask = 'DD.MM.YY';
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
   });
});
