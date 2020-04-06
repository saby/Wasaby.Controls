import {Control, TemplateFunction} from 'UI/Base';
import {Date as WSDate} from 'Types/entity';
import {date as formatDate} from 'Types/formatter';
import { SyntheticEvent } from 'Vdom/Vdom';
import EventProxy from './Mixin/EventProxy';
import {DateRangeModel, Utils as DateControlsUtils, dateRangeQuantum as quantumUtils} from 'Controls/dateRange';
import proxyModelEvents from 'Controls/Utils/proxyModelEvents';
import {MonthModel} from 'Controls/calendar';
import dateUtils = require('Controls/Utils/Date');
import datePopupUtils from './Utils';
import componentTmpl = require('wml!Controls/_datePopup/DateRange');
import 'wml!Controls/_datePopup/DateRangeItem';
import 'css!theme?Controls/datePopup';
import 'css!Controls/_datePopup/2.d41dc3a3.chunk'

/**
 * Component that allows you to select periods of multiple days.
 *
 * @class Controls/_datePopup/DateRange
 * @extends Core/Control
 * @control
 * @author Красильников А.С.
 * @private
 */

const _private = {
    updateView: function (self, options, dontUpdateScroll) {
        self._rangeModel.update(options);
        self._monthSelectionEnabled = !options.readOnly && (options.selectionType === 'range' ||
            (options.selectionType === 'quantum' && quantumUtils.monthSelectionEnabled(options.quantum) &&
                options.quantum.months[0] === 1));
        self._position = options.position;
    },

    notifyPositionChanged: function(self, date) {
        self._notify('positionChanged', [date]);
    },

    changeYear: function(self, position, direction) {
        let year: number = null;

        switch (direction) {
            case 'top':
                year = position.getFullYear() + 1;
                break;
            case 'bottom':
                year = position.getFullYear() - 1;
                break;
            default:
                break;
        }

        if (year !== null) {
            const yearDate = new Date(year, 0, 1);
            _private.notifyPositionChanged(self, yearDate);
            self._position = yearDate;
        }
    }
};

export default class Component extends Control {
    protected _template: TemplateFunction = componentTmpl;
    _date = new Date();
    _viewport = null;
    _startScrollTop = 67760;
    _currentDate = new Date();
    _renderedMonths = [
        {year: new Date(2020, 1, 1), position: 67480},
        {year: new Date(2020, 2, 1), position: 67760},
        {year: new Date(2020, 3, 1), position: 68040},
    ];
    _heightYearBlock = 280;
    _monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    protected _afterMount(cfg: any): void {
        this._load();
    }

    private _load() {
        this._children.scroll.scrollTop = this._startScrollTop;
    }

    private _diffArrays(arr1: object[], arr2: object[]) {
        return arr1.filter((obj: any) => !arr2.some((obj2: any) => obj.year.getMonth() === obj2.year.getMonth()));

    }

    private _changeRenderedArrays(arr1: object[], arr2: object[]) {
        this._diffArrays(arr1, arr2).forEach((item: any) => { this._renderedMonths.push(item);});
        this._diffArrays(arr2, arr1).forEach((item: any) => {
            const index = arr2.map((val) => val.year.getMonth()).indexOf(item.year.getMonth());
            if (index !== -1) { arr2.splice(index, 1); }
        });
    }

    private _getDate(position: number) {
        const year = Math.round(position / 12) + 2000;
        const month = position - (Math.round(position / 12) * 12);
        return {year: new Date(year, month, 1), position: position * this._heightYearBlock};
    }

    private _scrollHandler() {
        const elementPosition = Math.round(this._children.scroll.scrollTop / this._heightYearBlock);
        const newRenderedYears = [];
        for (let i = elementPosition - 2; i <= elementPosition + 2; i++) {
            if (i >= 0) {
                newRenderedYears.push(this._getDate(i));
            }
        }
        this._changeRenderedArrays(newRenderedYears, this._renderedMonths);
        // this._renderedMonths = [];
        // newRenderedYears.forEach((item) => this._renderedMonths.push(item));
        //console.log('_renderedMonths: ', this._renderedMonths);

    }
}

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export = Component;
