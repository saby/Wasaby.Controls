define([
   'Core/i18n',
   'js!SBIS3.CONTROLS.DateRangeChoose'
   ], function (
      i18n,
      DateRangeChoose
   ) {
   'use strict';

   describe('SBIS3.CONTROLS.DateRangeChoose', function () {
      describe('._modifyOptions', function () {
         describe('localization', function () {
            let saveI18nEnabled = i18n.isEnabled(),
               saveI18nLang = i18n.getLang();

            before(function() {
               i18n.setEnable(true);
            });

            after(function() {
               i18n.setLang(saveI18nLang);
               i18n.setEnable(saveI18nEnabled);
            });

            let locales = {
               'ru-RU': [
                  {
                     name: 'I',
                     quarters: [
                        {name: 'I', months: ['Январь', 'Февраль', 'Март']},
                        {name: 'II', months: ['Апрель', 'Май', 'Июнь']}
                     ]
                  },
                  {
                     name: 'II',
                     quarters: [
                        {name: 'III', months: ['Июль', 'Август', 'Сентябрь']},
                        {name: 'IV', months: ['Октябрь', 'Ноябрь', 'Декабрь']}
                     ]
                  }
               ],
               'en-US': [
                  {
                     name: 'I',
                     quarters: [
                        {name: 'I', months: ['January', 'February', 'March']},
                        {name: 'II', months: ['April', 'May', 'June']}
                     ]
                  },
                  {
                     name: 'II',
                     quarters: [
                        {name: 'III', months: ['July', 'August', 'September']},
                        {name: 'IV', months: ['October', 'November', 'December']}
                     ]
                  }
               ]
            };
            Object.keys(locales).forEach(function(locale) {
               context('for locale"' + locale + '"', function () {
                  before(function() {
                     if (i18n.isEnabled()) {
                        i18n.setLang(locale);
                        if (i18n.getLang() !== locale) {
                           this.skip();
                        }
                     } else {
                        this.skip();
                     }
                  });
                  it('should set proper month names', function () {
                     let opts = DateRangeChoose.prototype._modifyOptions({});
                     assert.deepEqual(opts._months, locales[locale]);
                  });
               });
            });
         });
      });


      describe('current date 2017-01-01', function () {
         // this.timeout(1500000);
         let oldDate = Date;

         let fakeDate = function (fake) {
            return new oldDate('2017-01-01');
         };

         beforeEach(function () {
            Date = fakeDate;
         });

         afterEach(function () {
            Date = oldDate;
         });

         describe('._getDefaultYear', function () {
            let yearsOnlyConfig = {showYears: true, showHalfyears: false, showQuarters: false, showMonths:false},
               tests = [
               [{startValue: new Date(2000, 0)}, 2000],
               [{startValue: new Date(2016, 0)}, 2016],
               [{startValue: new Date(2017, 0)}, 2017],
               [{startValue: new Date(2018, 0)}, 2018],
               [{startValue: new Date(2030, 0)}, 2030],

               [Object.assign({startValue: new Date(2000, 0)}, yearsOnlyConfig), 2004],
               [Object.assign({startValue: new Date(2012, 0)}, yearsOnlyConfig), 2016],
               [Object.assign({startValue: new Date(2013, 0)}, yearsOnlyConfig), 2017],
               [Object.assign({startValue: new Date(2014, 0)}, yearsOnlyConfig), 2017],
               [Object.assign({startValue: new Date(2016, 0)}, yearsOnlyConfig), 2017],
               [Object.assign({startValue: new Date(2017, 0)}, yearsOnlyConfig), 2017],
               [Object.assign({startValue: new Date(2018, 0)}, yearsOnlyConfig), 2018],
               [Object.assign({startValue: new Date(2030, 0)}, yearsOnlyConfig), 2030]

            ];
            tests.forEach(function (test, index) {
               it('should return "' + test[1] + '" for options ' + test[0].startValue, function () {
                  assert.strictEqual(DateRangeChoose.prototype._getDefaultYear(test[0]), test[1]);
               });
            });
         });
      });
   });
});
