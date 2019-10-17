/**
 * Библиотека контролов, которые служат для задания и отображения диапазона дат в рамках одного или нескольких месяцев. 
 * @library Controls/calendar
 * @includes Month Controls/_calendar/Month
 * @includes MonthList Controls/_calendar/MonthList
 * @includes MonthSlider Controls/_calendar/MonthSlider
 * @includes MonthModel Controls/_calendar/Month/Model
 * @includes MonthViewDayTemplate wml!Controls/_calendar/MonthView/dayTemplate
 * @includes MonthViewTemplate wml!Controls/_calendar/MonthView/MonthView
 * @includes MonthViewTableBodyTemplate wml!Controls/_calendar/MonthView/MonthViewTableBody
 * @includes MonthViewModel Controls/_calendar/MonthView/MonthViewModel
 * @includes MonthView Controls/_calendar/MonthView
 * @includes IMonthListCustomDays Controls/_calendar/interfaces/IMonthListCustomDays
 * @includes IMonth Controls/_calendar/interfaces/IMonth
 * @public
 * @author Крайнов Д.О.
 */

/*
 * calendar library
 * @library Controls/calendar
 * @includes Month Controls/_calendar/Month
 * @includes MonthList Controls/_calendar/MonthList
 * @includes MonthSlider Controls/_calendar/MonthSlider
 * @includes MonthModel Controls/_calendar/Month/Model
 * @includes MonthViewDayTemplate wml!Controls/_calendar/MonthView/dayTemplate
 * @includes MonthViewTemplate wml!Controls/_calendar/MonthView/MonthView
 * @includes MonthViewTableBodyTemplate wml!Controls/_calendar/MonthView/MonthViewTableBody
 * @includes MonthViewModel Controls/_calendar/MonthView/MonthViewModel
 * @includes MonthView Controls/_calendar/MonthView
 * @includes IMonthListCustomDays Controls/_calendar/interfaces/IMonthListCustomDays
 * @includes IMonth Controls/_calendar/interfaces/IMonth
 * @public
 * @author Крайнов Д.О.
 */

import MonthViewDayTemplate = require('wml!Controls/_calendar/MonthView/dayTemplate');
import MonthViewTemplate = require('wml!Controls/_calendar/MonthView/MonthView');
import MonthViewTableBodyTemplate = require('wml!Controls/_calendar/MonthView/MonthViewTableBody');

import MonthListYearTemplate = require('wml!Controls/_calendar/MonthList/YearTemplate');
import MonthListMonthTemplate = require('wml!Controls/_calendar/MonthList/MonthTemplate');

export {default as Month} from './_calendar/Month';
export {default as MonthList} from './_calendar/MonthList';
export {default as MonthSlider} from './_calendar/MonthSlider';
export {Base as MonthSliderBase} from './_calendar/MonthSlider';
export {default as MonthModel} from './_calendar/Month/Model';
export {default as MonthViewModel} from './_calendar/MonthView/MonthViewModel';
export {default as MonthView} from './_calendar/MonthView';

export {default as IMonth} from './_calendar/interfaces/IMonth';

export {
   MonthViewDayTemplate,
   MonthViewTemplate,
   MonthViewTableBodyTemplate,
   MonthListYearTemplate,
   MonthListMonthTemplate
}
