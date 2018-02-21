/* global Array, Object, Date, define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'SBIS3.CONTROLS/Utils/DateUtil'
], function (DateUtil) {
   'use strict';

   describe('SBIS3.CONTROLS/Utils/DateUtil', function () {

      describe('.dateFromIsoString', function () {
         let timezoneOffset = new Date().getTimezoneOffset()/60,
            tests = [
            {str: '2018', date: new Date(2018, 0, 1, -timezoneOffset)},
            {str: '2018-01', date: new Date(2018, 0, 1, -timezoneOffset)},
            {str: '2018-01-02', date: new Date(2018, 0, 2, -timezoneOffset)},
            // {str: '2018-01-02T03', date: new Date(2018, 0, 2, 10)},
            // {str: '2018-01-02 03', date: new Date(2018, 0, 2, 10)},
            {str: '2018-01-02T03:04', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4)},
            {str: '2018-01-02 03:04', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4)},
            {str: '2018-01-02T03:04:05', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5)},
            {str: '2018-01-02 03:04:05', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5)},
            {str: '2018-01-02T03:04:05.678', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5, 678)},
            {str: '2018-01-02 03:04:05.678', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5, 678)},
            {str: '2018-01-02T03:04:05.678Z', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5, 678)},
            {str: '2018-01-02 03:04:05.678Z', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4, 5, 678)},
            {str: '2018-01-02T03:04:05.678+08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset - 8, 4, 5, 678)},
            {str: '2018-01-02 03:04:05.678+08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset - 8, 4, 5, 678)},
            {str: '2018-01-02T03:04:05.678-08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset + 8, 4, 5, 678)},
            {str: '2018-01-02 03:04:05.678-08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset + 8, 4, 5, 678)},
            {str: '2018-01-02T03:04Z', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4)},
            {str: '2018-01-02 03:04Z', date: new Date(2018, 0, 2, 3 - timezoneOffset, 4)},
            {str: '2018-01-02T03:04+08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset - 8, 4)},
            {str: '2018-01-02 03:04+08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset - 8, 4)},
            {str: '2018-01-02T03:04-08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset + 8, 4)},
            {str: '2018-01-02 03:04-08:00', date: new Date(2018, 0, 2, 3 - timezoneOffset + 8, 4)},
            {str: '03:04:05-08:00', date: new Date(1900, 0, 1, 3 - timezoneOffset + 8, 4, 5)},
            {str: '03:04:05+08:00', date: new Date(1900, 0, 1, 3 - timezoneOffset - 8, 4, 5)},
            {str: '03:04:05.678-08:00', date: new Date(1900, 0, 1, 3 - timezoneOffset + 8, 4, 5, 678)},
            {str: '03:04:05.678+08:00', date: new Date(1900, 0, 1, 3 - timezoneOffset - 8, 4, 5, 678)}
         ];

         tests.forEach(function (test, index) {
            it(`should return "${test.date}" for "${test.str}"`, function () {
               let ret = DateUtil.dateFromIsoString(test.str);
               assert(ret && ret.getTime() === test.date.getTime(), `expected ${ret} to equal ${test.date}`);
            });
         });

      });
   });
});
