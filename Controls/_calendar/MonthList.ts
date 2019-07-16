import {Base as BaseSource} from 'Types/source';
import {date as formatDate} from 'Types/formatter';
import {IoC} from 'Env/Env';
import {Control} from 'UI/Base';
import coreMerge = require('Core/core-merge');
import {SyntheticEvent} from 'Core/vdom/Synchronizer/resources/SyntheticEvent';
import YearsSource from './MonthList/YearsSource';
import MonthsSource from './MonthList/MonthsSource';
import monthListUtils from './MonthList/Utils';
import dateUtils = require('Controls/Utils/Date');
import scrollToElement = require('Controls/Utils/scrollToElement');
import template = require('wml!Controls/_calendar/MonthList/MonthList');
import monthTemplate = require('wml!Controls/_calendar/MonthList/MonthTemplate');
import yearTemplate = require('wml!Controls/_calendar/MonthList/YearTemplate');

/**
 * Прокручивающийся список с месяцами. Позволяет выбирать период.
 *
 * @class Controls/_calendar/MonthList
 * @extends Core/Control
 * @mixes Controls/_calendar/interface/IMonthListSource
 * @control
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/Date/MonthList
 */

/**
 * @event Controls/_calendar/MonthList#positionChanged Происходит когда меняется год или месяц. Т.е. когда
 * год или месяц пересекают верхнюю границу.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
 * @param {date} Date отображаемый в самом верху год или месяц.
 * @example
 * Обновляем заголовок в зависимости от отображаемого года.
 * <pre>
 *    <Controls.calendar:MonthList startPosition="_date" on:positionChanged="_positionChangedHandler()"/>
 * </pre>
 * <pre>
 *    class  ModuleComponent extends Control {
 *       ...
 *       _positionChangedHandler(e, date) {
 *          this.setTitle(date);
 *       }
 *       ...
 *    }
 * </pre>
 */

const
    sourceMap = {
        year: YearsSource,
        month: MonthsSource
    },
    ITEM_BODY_SELECTOR = {
        year: '.controls-MonthList__year-months',
        month: '.controls-MonthList__month-body'
    };

class  ModuleComponent extends Control {
    private _template: Function = template;
    private _viewSource: BaseSource;
    private _startPositionId: string;
    private _scrollToPosition: Date;
    private _displayedPosition: Date;

    private _itemTemplate: Function;

    private _lastNotifiedPositionChangedDate: Date;

    protected _beforeMount(options) {
        const position = options.startPosition || options.position;
        if (options.startPosition) {
            IoC.resolve('ILogger').warn('MonthList', 'Используется устаревшая опция startPosition, используйте опцию position');
        }
        this._updateItemTemplate(options);
        this._updateSource(options);
        this._startPositionId = monthListUtils.dateToId(this._normalizeStartPosition(position));
        this._scrollToPosition = position;
        this._displayedPosition = position;
    }

    protected _afterMount(): void {
        this._updateScrollAfterViewModification();
    }

    protected _afterMount() {
        // TODO: We need another api to control the shadow visibility
        // https://online.sbis.ru/opendoc.html?guid=1737a12a-9dd1-45fa-a70c-bc0c9aa40a3d
        this._children.scroll.setShadowMode({ top: 'visible', bottom: 'visible' });
    }

    protected _beforeUpdate(options) {
        this._updateItemTemplate(options);
        this._updateSource(options);
        if (!dateUtils.isMonthsEqual(options.position, this._displayedPosition)) {
            this._updatePosition(options.position, this._options.position);
        }
    }

    protected _afterUpdate(options) {
        this._updateScrollAfterViewModification();
    }

    startValueChangedHandler(event: SyntheticEvent, value: Date): void {
        this._notify('startValueChanged', [value]);
    }

    endValueChangedHandler(event: SyntheticEvent, value: Date): void {
        this._notify('endValueChanged', [value]);
    }

    selectionChangedHandler(event: SyntheticEvent, start: Date, end: Date): void {
        this._notify('selectionChanged', [start, end]);
    }

    protected _getMonth(year: number, month: number): Date {
        return new Date(year, month, 1);
    }

    protected _drawItemsHandler(): void {
        this._updateScrollAfterViewModification();
    }

    private _updateItemTemplate(options: object): void {
        this._itemTemplate = options.viewMode === 'year' ?
            options.yearTemplate : this._itemTemplate = options.monthTemplate;

    }
    private _updateSource(options: object): void {
        if (options.viewMode !== this._options.viewMode) {
            this._viewSource = new sourceMap[options.viewMode]();
        }
    }
    private _updatePosition(position: Date): void {
        if (!position) {
            return;
        }

        const newPosition = dateUtils.getStartOfMonth(position);

        this._displayedPosition = newPosition;
        this._scrollToPosition = newPosition;

        if (this._container && !this._findElementByDate(newPosition)) {
            this._startPositionId = monthListUtils.dateToId(this._normalizeStartPosition(position));
        }
    }

    private _normalizeStartPosition(date: Date): Date {
        return this._options.viewMode === 'year' ?
            dateUtils.getStartOfYear(date) : dateUtils.getStartOfMonth(date);
    }

    private _intersectHandler(event: SyntheticEvent, entries: object): void {
        let date;
        for (const entry of entries) {
            if (entry.boundingClientRect.top - entry.rootBounds.top <= 0) {
                if (entry.boundingClientRect.bottom - entry.rootBounds.top >= 0) {
                    date = entry.data;
                } else if (entry.rootBounds.top - entry.boundingClientRect.bottom < entry.target.offsetHeight) {
                    if (this._options.viewMode === 'year') {
                        date = new Date(entry.data.getFullYear() + 1, entry.data.getMonth());
                    } else {
                        date = new Date(entry.data.getFullYear(), entry.data.getMonth() + 1);
                    }
                }
            }
            if (date && !dateUtils.isMonthsEqual(date, this._lastNotifiedPositionChangedDate)) {
                this._lastNotifiedPositionChangedDate = date;
                this._displayedPosition = date;
                this._notify('positionChanged', [date]);
            }
        }
    }

    protected _getItem(data: object): object {
        return {
            date: monthListUtils.idToDate(data.getId()),
            extData: data.get('extData')
        };
    }
    protected  _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }

    private _updateScrollAfterViewModification(): void {
        if (this._scrollToPosition) {
            if (this._scrollToDate(this._scrollToPosition)) {
                this._scrollToPosition = null;
            }
        }
    }

    private _scrollToDate(date: Date): boolean {
        const containerToScroll: HTMLElement = this._findElementByDate(date);

        if (containerToScroll) {
            scrollToElement(containerToScroll);
            return true;
        }
        return false;
    }

    private _findElementByDate(date: Date): HTMLElement {
        let element: HTMLElement;

        element = this._getElementByDate(
            ITEM_BODY_SELECTOR.month,
            monthListUtils.dateToId(dateUtils.getStartOfMonth(date)));

        if (!element) {
            element = this._getElementByDate(
                ITEM_BODY_SELECTOR.year,
                monthListUtils.dateToId(dateUtils.getStartOfYear(date)));
        }
        return element;
    }

    private _getElementByDate(selector: string, dateId: string): HTMLElement {
        return this._container.querySelector(selector + '[data-date="' + dateId + '"]');
    }

    protected _dateToDataString(date: Date): string {
        return monthListUtils.dateToId(date);
    }
}

ModuleComponent.getDefaultOptions = function () {
    return coreMerge({
        viewMode: 'year',
        yearTemplate: yearTemplate,
        monthTemplate: monthTemplate
    }, {});
};

// ModuleComponent.getOptionTypes = function() {
//    return coreMerge({
//       // itemTemplate: types(String)
//    }, {});
// };

export default ModuleComponent;
