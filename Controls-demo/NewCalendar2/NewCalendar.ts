import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/NewCalendar2/NewCalendar');

import 'css!Controls-demo/NewCalendar2/NewCalendar';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    _date = new Date();
    _viewport = null;
    _startScrollTop = 67760;
    _currentDate = new Date();
    _renderedMonths = [
        {year: new Date(2020, 1, 1), position: 67480},
        {year: this._currentDate, position: 67760},
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
        this._children.scroll.scrollTo(this._startScrollTop);
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
        const elementPosition = Math.round(this._children.scroll._scrollTop / this._heightYearBlock);
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
