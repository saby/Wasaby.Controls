import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/NewCalendar/NewCalendar');

import 'css!Controls-demo/NewCalendar/NewCalendar';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    _date = new Date();
    _viewport = null;
    _startScrollTop = 12480;
    _currentDate = new Date();
    _renderedYears = [
        {year: new Date(2019, 0, 1), position: 12064},
        {year: this._currentDate, position: 12480},
        {year: new Date(2021, 0, 1), position: 12896}
    ];
    _heightYearBlock = 416;
    _minYear = 1990;

    protected _afterMount(cfg: any): void {
        this._load();

    }

    private _load() {
        this._children.scroll.scrollTo(this._startScrollTop);
    }

    private _calcYearByPosition(topPosition: number) {
        return topPosition + this._minYear;
    }

    private _diffArrays(arr1: object[], arr2: object[]) {
        return arr1.filter((obj: any) => !arr2.some((obj2: any) => obj.year.getFullYear() === obj2.year.getFullYear()));

    }

    private _changeRenderedArrays(arr1: object[], arr2: object[]) {
        this._diffArrays(arr1, arr2).forEach((item: any) => { this._renderedYears.push(item);});
        this._diffArrays(arr2, arr1).forEach((item: any) => {
            const index = arr2.map((val) => val.year.getFullYear()).indexOf(item.year.getFullYear());
            if (index !== -1) { arr2.splice(index, 1); }
        });
    }

    private _scrollHandler() {
        const elementPosition = Math.round(this._children.scroll._scrollTop / this._heightYearBlock);
        const newRenderedYears = [];
        for (let i = elementPosition - 2; i <= elementPosition + 2; i++) {
            if (i >= 0) {
                newRenderedYears.push({year: this._currentDate.getFullYear() !== new Date(this._calcYearByPosition(i)).getFullYear() ? new Date(this._calcYearByPosition(i), 0, 1) : this._currentDate, position: i * this._heightYearBlock});
            }
        }
        this._changeRenderedArrays(newRenderedYears, this._renderedYears);
        // this._renderedYears = [];
        // newRenderedYears.forEach((item) => this._renderedYears.push(item));
    }
}
