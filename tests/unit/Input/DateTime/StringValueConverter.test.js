define([
   'Core/core-merge',
   'Core/helpers/Date/format',
   'Controls/Input/DateTime/StringValueConverter',
   'Controls/Utils/Date'
], function(
   cMerge,
   formatDate,
   StringValueConverter,
   dateUtils
) {
   'use strict';

   let
      options = {
         mask: 'DD.MM.YYYY',
         value: new Date(2018, 0, 1),
         replacer: '_',
      },
      now = new Date();

   describe('Controls/Input/DateTime/StringValueConverter', function() {

      describe('.update', function() {

         it('should update mask and replacer options', function() {
            let converter = new StringValueConverter(),
               mask = 'HH:mm',
               replacer = '-';
            converter.update(options);
            converter.update({ mask: mask, replacer: replacer });

            assert.strictEqual(converter._mask, mask);
            assert.strictEqual(converter._replacer, replacer);
         });

      });

      describe('.getStringByValue', function() {
         [{
            date: null,
            dateStr: ''
         }, {
            date: new Date('Invalid'),
            dateStr: ''
         }, {
            date: new Date(2018, 0, 1),
            dateStr: '01.01.2018'
         }].forEach(function(test) {
            it(`should return "${test.dateStr}" if "${test.date}" is passed`, function() {
               let converter = new StringValueConverter();
               converter.update(options);
               assert.strictEqual(converter.getStringByValue(test.date), test.dateStr);
            });
         });
      });

      describe('.getValueByString', function() {
         let year = now.getFullYear(),
            month = now.getMonth(),
            date = now.getDate(),
            shortYearStr = formatDate(now, 'YY'),
            monthStr = formatDate(now, 'MM'),
            dateStr = formatDate(now, 'DD');

         [
            // The day and month are filled
            // We substitute the current year
            { mask: 'DD.MM.YY', stringValue: '11.12.__', value: new Date(year, 11, 11) },
            // Automatically fill the current month and year
            { mask: 'DD.MM.YY', stringValue: '11.__.__', value: new Date(year, month, 11) },
            // Current year is filled
            // Autofill current month
            { mask: 'DD.MM.YY', stringValue: `11.__.${shortYearStr}`, value: new Date(year, month, 11) },
            // The current day and month are auto-charged
            { mask: 'DD.MM.YY', stringValue: `__.__.${shortYearStr}`, value: new Date(year, month, date) },
            // Current year and month are filled
            // Autofill current day
            { mask: 'DD.MM.YY', stringValue: `__.${monthStr}.${shortYearStr}`, value: new Date(year, month, date) },
            // A year is different from the current one
            // Autofill 01
            { mask: 'DD.MM.YY', stringValue: '11.__.00', value: new Date(2000, 0, 11) },
            // Autofill 01.01
            { mask: 'DD.MM.YY', stringValue: '__.__.00', value: new Date(2000, 0, 1) },
            // The year is different from the current year and month
            // Autofill 1
            { mask: 'DD.MM.YY', stringValue: '__.01.00', value: new Date(2000, 0, 1) },
            // [[2000, month + 1, null, null, null], new Date(2000, month + 1, 1), 'DD.MM.YY', []], // Подставляем 1
            // The field is completely empty
            { mask: 'DD.MM.YY', stringValue: '__.__.__', value: null },
            // [[null, null, null, null, null], now, 'DD.MM.YY', requiredValidator],
            // other cases
            { mask: 'DD.MM.YY', stringValue: '__.01.__', value: new Date('Invalid') },
            { mask: 'DD.MM', stringValue: '__.__', value: null },
            { mask: 'HH.mm', stringValue: '10.__', value: new Date(1900, 0, 1, 10) },
            { mask: 'HH.mm', stringValue: '__.10', value: new Date('Invalid') },
         ].forEach(function(test) {
            it(`should return ${test.value} if "${test.stringValue}" is passed`, function() {
               let converter = new StringValueConverter(),
                  rDate;
               converter.update(cMerge({ mask: test.mask }, options, { preferSource: true }));
               rDate = converter.getValueByString(test.stringValue, null, true);
               assert(dateUtils.isDatesEqual(rDate, test.value), `${rDate} is not equal ${test.value}`);
            });
         });
      });

   });
});
