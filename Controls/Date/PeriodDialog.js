define('Controls/Date/PeriodDialog', [
   'Controls/datePopup'
], function(datePopup) {
   'use strict';

   /**
    * A dialog that allows you to choose dates and periods of arbitrary duration.
    *
    * @class Controls/Date/PeriodDialog
    * @extends Core/Control
    * @mixes Controls/Date/interface/IPeriodDialog
    * @mixes Controls/Date/interface/IDateRangeSelectable
    * @mixes Controls/Date/interface/IMonthListCustomDays
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/datePopup/datePopup
    *
    * @css @background-color_PeriodDialog Background color of dialog.
    * @css @width_PeriodDialog Dialog width.
    * @css @height_PeriodDialog Dialog height.
    * @css @border-width_PeriodDialog Borders width.
    * @css @border-color_PeriodDialog Borders color.
    * @css @background-color__PeriodDialog-header Background color of dialog header.
    * @css @spacing_PeriodDialog-header-between-borderLeft-content Spacing between left border and header content.
    * @css @height_PeriodDialog-header Height of dialog header.
    * @css @spacing_PeriodDialog-header-between-stateButton-date Spacing between state button and date in header.
    * @css @width_PeriodDialog-header-dash Width of the dash between start and end input fields.
    * @css @spacing_PeriodDialog-header-between-dash-date Spacing between dash and input fields.
    * @css @spacing_PeriodDialog-header-between-applyButton-otherElements Spacing between apply button and other header elements.
    * @css @height_PeriodDialog-years Height of the years panel.
    * @css @width_PeriodDialog-years-leftRight Width of the left and right regions in year mode.
    * @css @height_PeriodDialog-years-rangeButton Height of the years range button.
    * @css @color_PeriodDialog-years-rangeButton Color of the years range button.
    * @css @font-size_PeriodDialog-years-rangeButton Font size of the years range button.
    * @css @color_PeriodDialog-years-current-year Color of the text on button with current year.
    * @css @color_PeriodDialog-years-displayed-year Color of the text on button with displayed year.
    * @css @font-size_PeriodDialog-years-displayed-year Font size of the text on button with displayed year.
    * @css @border-width_PeriodDialog-monthRange: Default border width in years mode. For example between months.
    * @css @border-width_PeriodDialog-monthRange-additional: Border width between year end year title, half years or quarters and months in years mode.
    * @css @border-color_PeriodDialog-monthRange Color of borders in month range.
    * @css @height_PeriodDialog-monthRange-header Height of the month range year header.
    * @css @color_PeriodDialog-monthRange-header Color of the month range year header.
    * @css @font-size_PeriodDialog-monthRange-header Font size of the month range year header.
    * @css @color_PeriodDialog-monthRange-halfyearsAndQuarters Color of the text in halfyears and quarters buttons.
    * @css @border-color_PeriodDialog-monthRange-halfyearsAndQuarters_selected Border color of the borders selected halfyears and quarters regions.
    * @css @font-size_PeriodDialog-monthRange-halfYears Font size of the text in halfyears buttons.
    * @css @border-width_PeriodDialog-monthRange-halfYears Border width of the half years block in month range.
    * @css @font-size_PeriodDialog-monthRange-quarters Font size of the text in halfyears buttons.
    * @css @spacing_PeriodDialog-monthRange-monthWrapper-between-content-leftRightBorder Spacing between content and left and right border in month.
    * @css @height_PeriodDialog-monthRange-monthWrapper Height of the months in month range.
    * @css @width_PeriodDialog-monthRange-monthWrapper Width of the months in month range.
    * @css @border-color_PeriodDialog-monthRange-month Color of the border on hovered month in month range.
    * @css @color_PeriodDialog-monthRange-month-title Color of the title in month range.
    * @css @font-size_PeriodDialog-monthRange-month-title Font size of the title in month range.
    * @css @height_PeriodDialog-monthRange-month-title Height of the title in month range.
    * @css @height_PeriodDialog-monthRange-month-date Height of the month body in month range.
    * @css @font-size_PeriodDialog-monthRange-month-date Font size of the month body in month range.
    * @css @width_PeriodDialog-monthRange-month-selectionEdge Width of the edge line in first and end selected month.
    * @css @height_PeriodDialog-dateRange-header Height of date range header.
    * @css @font-size_PeriodDialog-dateRange-header Font size of date range header.
    * @css @width_PeriodDialog-dateRange-monthPanel Width of month panel in date range mode.
    * @css @spacing_PeriodDialog-dateRange-monthPanel-between-content-leftRightBorder Spacing between left border of month button and text in date range mode.
    * @css @color_PeriodDialog-dateRange-header-year Color of year in header in date range mode.
    * @css @font-weight_PeriodDialog-dateRange-header-year Font weight of year in header in date range mode.
    * @css @color_PeriodDialog-dateRange-header-workday Color of the workday in header in date range mode.
    * @css @color_PeriodDialog-dateRange-header-weekend Color of the weekend in header in date range mode.
    * @css @height_PeriodDialog-dateRange-months-button Height of the month button in date range mode.
    * @css @border-color_PeriodDialog-dateRange-months Border color of the month button in date range mode.
    * @css @color_PeriodDialog-dateRange-months-button Color of the month button in date range mode.
    * @css @font-size_PeriodDialog-dateRange-months-button Font size of the month button in date range mode.
    * @css @background-color_PeriodDialog-dateRange-months-button Background color of the month button in date range mode.
    * @css @border-color_PeriodDialog-dateRange-months-button_hover Border color of the hovered month button in date range mode.
    * @css @background-color_PeriodDialog-dateRange-months-button_hover Background color of the hovered month button in date range mode.
    * @css @color_PeriodDialog-dateRange-months-nextYearButton Color of the next year button in date range mode.
    * @css @font-size_PeriodDialog-dateRange-months-nextYearButton Font size of the next year button in date range mode.
    * @css @border-color_PeriodDialog-dateRange-months Border color of the next year button in date range mode.
    * @css @background-color_PeriodDialog-dateRange-months-nextYearButton Background color of the next year button in date range mode.
    * @css @border-color_PeriodDialog-dateRange-months-nextYearButton Border color of the next year button in date range mode.
    * @css @background-color_PeriodDialog-dateRange-months-nextYearButton_hover Background color of the next year hovered button in date range mode.
    * @css @height_PeriodDialog-dateRange-monthsWithDates-title Height of the month title in date range mode.
    * @css @font-size_PeriodDialog-dateRange-monthsWithDates-title Font size of the month title in date range mode.
    * @css @color_PeriodDialog-dateRange-monthsWithDates-title Color of the month title in date range mode.
    * @css @background-color_PeriodDialog-dateRange-monthsWithDates-title Background color of the month title in date range mode.
    * @css @border-color_PeriodDialog-dateRange-monthsWithDates-title_hover Border color of the hovered month title in date range mode.
    * @css @background-color_PeriodDialog-dateRange-monthsWithDates-title_hover Background color of the hovered month title in date range mode.
    *
    */

   return datePopup;
});
