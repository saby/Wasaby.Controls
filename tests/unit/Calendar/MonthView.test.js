define([
   'Core/core-merge',
   'Controls/Calendar/MonthView',
   'SBIS3.CONTROLS/Utils/DateUtil'
], function(
   coreMerge,
   MonthView,
   DateUtil
) {
   'use strict';

   let createMonthView = function(cfg) {
      let mv;
      cfg = coreMerge(cfg, MonthView.getDefaultOptions(), {preferSource: true});
      mv = new MonthView(cfg);
      mv.saveOptions(cfg);
      mv._beforeMount(cfg);
      return mv;
   },
   assertMonthView = function(weeks, dayAssertFn) {
      for (let week of weeks) {
         assert.equal(week.length, 7);
         for (let day of week) {
            if (dayAssertFn) {
               dayAssertFn(day);
            }
         }
      }
   };

   let
      // clickDate = new Date(2017, 0, 15),
      // clickDate2 = new Date(2017, 0, 20),
      // clickDate3 = new Date(2017, 0, 17),
      config = {
         month: new Date(2017, 0, 1)
      };

   describe('Controls/Calendar/MonthView', function() {
      describe('Initialisation', function() {
         it('should create the correct model for the month when creating', function() {
            let mv, weeks;
            mv = createMonthView(config);

            weeks = mv._monthViewModel._modelArray;
            assert.equal(weeks.length, 6);
            assertMonthView(weeks);
            assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         });
         // TODO: этот функционал теперь в Controls/Calendar/Month, вынести отсюда.
         // it('should create the correct model for the month with selection when creating', function() {
         //    let mv, weeks, cfg;
         //    cfg = coreMerge({
         //       startValue: new Date(2017, 0, 2),
         //       endValue: new Date(2017, 1, -1)
         //    }, config, {preferSource: true});
         //    mv = createMonthView(cfg);
         //
         //    weeks = mv._weeksArray;
         //    assertMonthView(weeks, function (day) {
         //       if (day.date.getMonth() === 0 && (day.date.getDate() !== 1 && day.date.getDate() !== 31)) {
         //          assert.isTrue(day.selected);
         //       } else {
         //          assert.isFalse(day.selected);
         //       }
         //    });
         //    assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
         // });
      });
      //
      // describe('Selection', function() {
      //    describe('selectionMode = range', function() {
      //       describe('_dayClickHandler', function() {
      //          it('should start selection after day clicked', function () {
      //             let mv,
      //                weeks;
      //
      //             mv = createMonthView(config);
      //
      //             mv._dayClickHandler(null, clickDate);
      //
      //             weeks = mv._weeksArray;
      //             assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
      //
      //             assertMonthView(weeks, function (day) {
      //                if (DateUtil.isDatesEqual(day.date, clickDate)) {
      //                   assert.isTrue(day.selected);
      //                } else {
      //                   assert.isFalse(day.selected);
      //                }
      //             });
      //          });
      //
      //          it('should select period after 2 clicks', function () {
      //             let mv,
      //                weeks;
      //
      //             mv = createMonthView(config);
      //
      //             mv._dayClickHandler(null, clickDate);
      //             mv._dayClickHandler(null, clickDate2);
      //
      //             weeks = mv._weeksArray;
      //             assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
      //
      //             assertMonthView(weeks, function (day) {
      //                if (day.date >= clickDate && day.date <= clickDate2) {
      //                   assert.isTrue(day.selected);
      //                } else {
      //                   assert.isFalse(day.selected);
      //                }
      //             });
      //          });
      //
      //          it('should start new selection after 3 clicks', function () {
      //             let mv,
      //                weeks;
      //
      //             mv = createMonthView(config);
      //
      //             mv._dayClickHandler(null, clickDate);
      //             mv._dayClickHandler(null, clickDate2);
      //             mv._dayClickHandler(null, clickDate3);
      //
      //             weeks = mv._weeksArray;
      //             assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
      //
      //             assertMonthView(weeks, function (day) {
      //                if (DateUtil.isDatesEqual(day.date, clickDate3)) {
      //                   assert.isTrue(day.selected);
      //                } else {
      //                   assert.isFalse(day.selected);
      //                }
      //             });
      //          });
      //       });
      //
      //       // TODO
      //       // describe('_mouseEnterHandler', function() {
      //       //
      //       // });
      //    });
      //
      //    describe('selectionMode = single', function() {
      //       describe('_dayClickHandler', function() {
      //          it('should select day after day clicked', function () {
      //             let cfg = coreMerge({
      //                   selectionType: 'single'
      //                }, config, {preferSource: true}),
      //                mv,
      //                weeks;
      //
      //             mv = createMonthView(cfg);
      //
      //             mv._dayClickHandler(null, clickDate);
      //
      //             weeks = mv._weeksArray;
      //             assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
      //
      //             assertMonthView(weeks, function (day) {
      //                if (DateUtil.isDatesEqual(day.date, clickDate)) {
      //                   assert.isTrue(day.selected);
      //                } else {
      //                   assert.isFalse(day.selected);
      //                }
      //             });
      //          });
      //
      //          it('should select another day after second click', function () {
      //             let cfg = coreMerge({
      //                   selectionType: 'single'
      //                }, config, {preferSource: true}),
      //                mv,
      //                weeks;
      //
      //             mv = createMonthView(cfg);
      //
      //             mv._dayClickHandler(null, clickDate);
      //             mv._dayClickHandler(null, clickDate2);
      //
      //             weeks = mv._weeksArray;
      //             assert.isTrue(DateUtil.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26)));
      //
      //             assertMonthView(weeks, function (day) {
      //                if (DateUtil.isDatesEqual(day.date, clickDate2)) {
      //                   assert.isTrue(day.selected);
      //                } else {
      //                   assert.isFalse(day.selected);
      //                }
      //             });
      //          });
      //       });
      //       // TODO
      //       // describe('_mouseEnterHandler', function() {
      //       //
      //       // });
      //    });
      //    // TODO
      //    // describe('selectionMode = quantum', function() {
      //    //
      //    // });
      // });
   })
});