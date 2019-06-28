import {Base as BaseSource} from 'Types/source';
import {date as formatDate} from 'Types/formatter';
import {Control} from 'UI/Base';
import coreMerge = require('Core/core-merge');
import {SyntheticEvent} from 'Core/vdom/Synchronizer/resources/SyntheticEvent';
import YearsSource from './MonthList/YearsSource';
import MonthsSource from './MonthList/MonthsSource';
import monthListUtils from './MonthList/Utils';
import dateUtils = require('Controls/Utils/Date');
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
 * @author Миронов А.Ю.
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
    };

class  ModuleComponent extends Control {
    private _template: Function = template;
    private _viewSource: BaseSource;
    private _position: string;

    private _startValue: Date;
    private _endValue: Date;

    private _itemTemplate: Function;

    private _lastNotifiedPositionChangedDate: Date;

    protected _beforeMount(options) {
        this._updateItemTemplate(options);
        this._updateSource(options);
        this._updatePosition(options);

        // TODO: портировать установку года и подскрол к нужному месяцу когда будет корректно работать навигация по курсору.
        // https://online.sbis.ru/opendoc.html?guid=f01aaceb-2c7e-4a19-9a86-2d59c5419254

        // this._startValue = options.startValue;
        // this._endValue = options.endValue;
        // this.selectionProcessing = options.selectionProcessing;
    }

    protected _beforeUpdate(options) {
        this._updateItemTemplate(options);
        this._updateSource(options);
        this._updatePosition(options);
    }

    startValueChangedHandler(event, value) {
        // this._startValue = value;
        this._notify('startValueChanged', [value]);
    }

    endValueChangedHandler(event, value) {
        // this._endValue = value;
        this._notify('endValueChanged', [value]);
    }

    selectionChangedHandler(event, start, end) {
        this._notify('selectionChanged', [start, end]);
    }

    protected _getMonth(year, month) {
        return new Date(year, month, 1);
    }

    protected _drawItemsHandler() {
        this._notify('drawItems');
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
    private _updatePosition(options: object): void {
        const newPosition = monthListUtils.dateToId(dateUtils.getStartOfYear(options.startPosition || options.date));
        if (newPosition !== this._position) {
            this._position = newPosition;
        }
    }

    private _intersectHandler(event: SyntheticEvent, entries) {
        let date;
        for (const entry of entries) {
            if (entry.boundingClientRect.top - entry.rootBounds.top < 0) {
                if (entry.boundingClientRect.bottom - entry.rootBounds.top >= 0) {
                    date = entry.data;
                } else if (entry.rootBounds.top - entry.boundingClientRect.bottom < entry.target.offsetHeight) {
                    if (this._options.viewMode ==='year') {
                        date = new Date(entry.data.getFullYear() + 1, entry.data.getMonth());
                    } else {
                        date = new Date(entry.data.getFullYear(), entry.data.getMonth() + 1);
                    }
                }
            }
            if (date && date !== this._lastNotifiedPositionChangedDate) {
                this._lastNotifiedPositionChangedDate = date;
                this._notify('positionChanged', [date]);
            }
        }
    }

    protected _getItem(data: object) {
        return {
            date: monthListUtils.idToDate(data.getId()),
            extData: data.get('extData')
        };
    }
    protected  _formatMonth(date) {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }
}

ModuleComponent.getDefaultOptions = function () {
    return coreMerge({
        position: dateUtils.getStartOfMonth(),
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
