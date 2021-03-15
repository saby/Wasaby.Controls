import rk = require('i18n!Controls');
import {SyntheticEvent} from 'Vdom/Vdom';
import {Control as BaseControl} from 'UI/Base';
import coreMerge = require('Core/core-merge');
import {descriptor, Date as WSDate} from 'Types/entity';
import {IRangeSelectable} from 'Controls/dateRange';
import {DateRangeModel, IDateRangeSelectable} from 'Controls/dateRange';
import {Range, Base as dateUtils} from 'Controls/dateUtils';
import EventProxyMixin from './_datePopup/Mixin/EventProxy';
import periodDialogUtils from './_datePopup/Utils';
import componentTmpl = require('wml!Controls/_datePopup/DatePopup');
import headerTmpl = require('wml!Controls/_datePopup/header');
import dayTmpl = require('wml!Controls/_datePopup/day');
import {MonthViewDayTemplate} from 'Controls/calendar';
import {Controller as ManagerController} from 'Controls/popup';
import {IntersectionObserverSyntheticEntry} from './scroll';
import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {constants} from 'Env/Env';

const HEADER_TYPES = {
        link: 'link',
        input: 'input'
};

const STATES = {
        year: 'year',
        month: 'month'
};

const MONTH_STATE_SELECTION_DAYS = 30;
const popupMask = coreMerge({auto: 'auto'}, Range.dateMaskConstants);

/**
 * @event Происходит при завершении ввода (поле ввода периода потеряло фокус или пользователь нажал клавишу "Enter").
 * @name Controls/datePopup#inputCompleted
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} startValue Начальное значение периода.
 * @param {Date} endValue Конечное значение периода.
 * @param {String} displayedStartValue Текстовое значение начала периода.
 * @param {String} displayedEndValue Текстовое значение конца периода.
 * @remark
 * Это событие можно использовать в качестве триггера для проверки периода или отправки введенных данных в какой-либо другой контрол.
 * @example
 * В этом примере мы подписываемся на событие inputCompleted и сохраняем значение периода в первой базе данных и отображаемое значение периода во второй базе данных.
 * <pre>
 *    <Controls.datePopup on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       _inputCompletedHandler(event, startValue, endValue, displaydStartValue, displaydEndValue) {
 *          this._saveEnteredValueToDabase1(startValue, endValue);
 *          this._saveEnteredValueToDabase2(displaydStartValue, displaydEndValue);
 *       }
 *    })
 * </pre>
 */

/**
 * Диалоговое окно, которое позволяет выбрать даты и периоды произвольной длительности.
 *
 * @class Controls/datePopup
 * @extends UI/Base:Control
 * @mixes Controls/_interface/IResetValues
 * @mixes Controls/_dateRange/interfaces/IDateRangeSelectable
 * @mixes Controls/_interface/IDayTemplate
 * @mixes Controls/_interface/IDateMask
 * @mixes Controls/_dateRange/interfaces/IDateRange
 * @mixes Controls/_interface/IDateRangeValidators
 * @mixes Controls/_dateRange/interfaces/ICaptionFormatter
 *
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/datePopup/datePopup
 *
 */

/*
 * A dialog that allows you to choose dates and periods of arbitrary duration.
 *
 * @class Controls/datePopup
 * @extends UI/Base:Control
 * @mixes Controls/_dateRange/interfaces/IDateRangeSelectable
 * @mixes Controls/_interface/IDayTemplate
 * @mixes Controls/_interface/IDateMask
 * @mixes Controls/_dateRange/interfaces/IDateRange
 * @mixes Controls/_interface/IDateRangeValidators
 *
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/datePopup/datePopup
 */
export default class DatePopup extends Control implements EventProxyMixin {
    _template: TemplateFunction = componentTmpl;
    _headerTmpl: TemplateFunction = headerTmpl;
    _dayTmpl: TemplateFunction = dayTmpl;
    _defaultDayTemplate: TemplateFunction = MonthViewDayTemplate;
    protected _today: number;

    _rangeModel: object = null;
    _headerRangeModel: object = null;
    _yearRangeModel: object = null;

    _displayedDate: Date = null;

    _HEADER_TYPES: object = HEADER_TYPES;
    _headerType: string = HEADER_TYPES.link;
    _activateInputField: boolean = false;

    _todayCalendarEnabled: boolean = true;

    _STATES: object = STATES;
    _state: string = STATES.year;

    _monthRangeSelectionProcessing: boolean = false;
    _yearsRangeSelectionProcessing: boolean = false;

    _dateRangeSelectionProcessing: boolean = false;

    _yearStateEnabled: boolean = true;
    _monthStateEnabled: boolean = true;

    _yearRangeSelectionType: object = null;

    _mask = null;

    _startValueValidators = null;
    _endValueValidators = null;

    _keyboardActive: boolean = false;

    _beforeMount(options: IControlOptions): void {
        /* Опция _displayDate используется только(!) в тестах, чтобы иметь возможность перемотать
         календарь в нужный период, если startValue endValue не заданы.
         https://online.sbis.ru/opendoc.html?guid=e7dc54f8-1b15-4c93-9d38-e6f33022b53d */
        this._displayedDate = dateUtils.getStartOfMonth(options._displayDate ?
            options._displayDate :
            (dateUtils.isValidDate(options.startValue) ?
                options.startValue :
                new Date()));
        // Опция _date используется только на демках для тестирования. В заголовке у нас указывается сегодняшний день.
        // https://online.sbis.ru/opendoc.html?guid=e7dc54f8-1b15-4c93-9d38-e6f33022b53d
        this._today = options._date ? options._date.getDate() : new Date().getDate();
        this._rangeModel = new DateRangeModel({dateConstructor: options.dateConstructor});
        this._rangeModel.update(options);

        this._startValueValidators = [];
        this._endValueValidators = [];
        this.updateValidators(options);
        this._rangeModel.subscribe('rangeChanged', () => {
            this.updateValidators();
        });

        this._prepareTheme();
        this._headerRangeModel = new DateRangeModel({dateConstructor: options.dateConstructor});
        this._headerRangeModel.update(options);

        this._yearRangeModel = new DateRangeModel({dateConstructor: options.dateConstructor});
        this.updateYearsRangeModel(options.startValue, options.endValue);

        this._monthStateEnabled = periodDialogUtils.isMonthStateEnabled(options);
        this._yearStateEnabled = periodDialogUtils.isYearStateEnabled(options);

        this._state = this.getViewState(options, this._monthStateEnabled, this._yearStateEnabled);
        if (this._state === STATES.year) {
            this._displayedDate = dateUtils.getStartOfYear(this._displayedDate);
        }

        this._yearRangeSelectionType = options.selectionType;
        this._yearRangeQuantum = {};
        this._monthRangeSelectionType = options.selectionType;
        this._monthRangeQuantum = {};

        if (options.mask === popupMask.auto) {
            this._mask = options.minRange === IDateRangeSelectable.minRange.month ? popupMask.MM_YYYY : popupMask.DD_MM_YY;
        } else {
            this._mask = options.mask;
        }

        if (options.selectionType === 'quantum') {
            if ('years' in options.ranges) {
                this._yearRangeSelectionType = options.selectionType;
                this._yearRangeQuantum = {'years': options.ranges.years};
            } else {
                this._yearRangeSelectionType = IDateRangeSelectable.SELECTION_TYPES.disable;
            }
            const monthsRangeQuantums = ['months', 'quarters', 'halfyears'];
            for (const quantumRange of monthsRangeQuantums) {
                if (quantumRange in options.ranges) {
                    this._monthRangeQuantum[quantumRange] = options.ranges[quantumRange];
                }
            }
            if (!Object.keys(this._monthRangeQuantum).length) {
                this._monthRangeSelectionType = IDateRangeSelectable.SELECTION_TYPES.disable;
            }
        }

        if (!this._yearStateEnabled) {
            this._yearRangeSelectionType = IDateRangeSelectable.SELECTION_TYPES.disable;
            this._monthRangeSelectionType = IDateRangeSelectable.SELECTION_TYPES.disable;
        }

        if (options.readOnly) {
            this._yearRangeSelectionType = IDateRangeSelectable.SELECTION_TYPES.disable;
        }

        this._updateTodayCalendarState();

        this._updateResetButtonVisible(options);

        this._headerType = options.headerType;
    }

    _afterUpdate(): void {
        if (this._activateInputField) {
            this.activate();
            this._activateInputField = false;
        }
    }

    _beforeUnmount(): void {
        this._rangeModel.destroy();
        this._headerRangeModel.destroy();
        this._yearRangeModel.destroy();
    }

    _prepareTheme(): void {
        this._headerTheme = ManagerController.getPopupHeaderTheme();
    }

    _toggleStateClick(): void {
        this.toggleState();
        this._updateTodayCalendarState();
    }

    _stateButtonKeyDownHandler(event: SyntheticEvent): void {
        if (event.nativeEvent.keyCode === constants.key.enter) {
            this.toggleState();
            this._updateTodayCalendarState();
        }
    }

    _todayCalendarClick(): void {
        this._scrollToCurrentMonth();
    }

    _scrollToCurrentMonth(): void {
        if (this._todayCalendarEnabled) {
            if (this._state === STATES.year) {
                this._displayedDate = dateUtils.getStartOfYear(new Date());
            } else {
                this._displayedDate = dateUtils.getStartOfMonth(new Date());
            }
        }
    }

    _updateTodayCalendarState(): void {
        if ((this._state === STATES.year && this._displayedDate.getFullYear() === new Date().getFullYear()) ||
            (this._state === STATES.month && this._displayedDate.getMonth() === new Date().getMonth() &&
                this._displayedDate.getFullYear() === new Date().getFullYear())) {
            this._todayCalendarEnabled = false;
        } else {
            this._todayCalendarEnabled = true;
        }
    }

    _currentDayIntersectHandler(event: SyntheticEvent, entry: IntersectionObserverSyntheticEntry): void {
        this._todayCalendarEnabled = !entry.nativeEntry.isIntersecting;
    }

    _unregisterCurrentDayIntersectHandler(): void {
        // Если в IntersectionObserverContainer, который сделит за сегодняшним днём, происходит событие unregister -
        // значит текущий день точно не отображается. Обновляем состояние домика.
        this._updateTodayCalendarState();
    }

    _yearsRangeChanged(e: SyntheticEvent, start: Date, end: Date): void {
        this.rangeChanged(start, end ? dateUtils.getEndOfYear(end) : null);
    }

    _headerLinkClick(e: SyntheticEvent): void {
        if (this._headerType === this._HEADER_TYPES.link) {
            this._headerType = this._HEADER_TYPES.input;
            this._activateInputField = true;
        } else {
            this._headerType = this._HEADER_TYPES.link;
        }
    }

    _onHeaderLinkRangeChanged(e: SyntheticEvent, startValue: Date, endValue: Date): void {
        this.rangeChanged(startValue, endValue);
    }

    _startValuePickerChanged(e: SyntheticEvent, value: Date): void {
        this.rangeChanged(
            value,
            this._options.selectionType === IRangeSelectable.SELECTION_TYPES.single ? value : this._rangeModel.endValue
        );
    }

    _endValuePickerChanged(e: SyntheticEvent, value: Date): void {
        let startValue = this._rangeModel.startValue,
            endValue = value;
        if (this._options.selectionType === IRangeSelectable.SELECTION_TYPES.single) {
            startValue = value;
        } else if (dateUtils.isValidDate(value) && !this.isMaskWithDays(this._mask)) {
            endValue = dateUtils.getEndOfMonth(value);
        }
        this.rangeChanged(startValue, endValue);
    }

    _yearsSelectionChanged(e: SyntheticEvent, start: Date, end: Date): void {
        const endYear = end ? dateUtils.getEndOfYear(end) : null;
        this.selectionChanged(start, endYear);
        this._rangeModel.startValue = start;
        this._rangeModel.endValue = endYear;
    }

    _onYearsSelectionHoveredValueChanged(e: SyntheticEvent, value: Date): void {
        // We update the displayed date only during the selection process.
        if (value) {
            this._displayedDate = value;
        }
    }

    _yearsSelectionStarted(e: SyntheticEvent, start: Date, end: Date): void {
        this._monthRangeSelectionProcessing = false;
    }

    _yearsRangeSelectionEnded(e: SyntheticEvent, start: Date, end: Date): void {
        const endOfYear = dateUtils.getEndOfYear(end);
        const ranges = this._calculateRangeSelectedCallback(start, endOfYear);
        const startValue = ranges[0];
        const endValue = ranges[1];
        this.sendResult(startValue, endValue);
    }

    _onYearsItemClick(e: SyntheticEvent, item: Date): void {
        this._displayedDate = item;
    }

    _monthsRangeChanged(e: SyntheticEvent, start: Date, end: Date): void {
        this.rangeChanged(start, end ? dateUtils.getEndOfMonth(end) : null);
    }

    _monthsRangeSelectionStarted(e: SyntheticEvent, start: Date, end: Date): void {
        this._yearsRangeSelectionProcessing = false;
    }

    _monthsSelectionChanged(e: SyntheticEvent, start: Date, end: Date): void {
        this.selectionChanged(start, end ? dateUtils.getEndOfMonth(end) : null);
    }

    _monthsRangeSelectionEnded(e: SyntheticEvent<Event>, start: Date, end: Date): void {
        const endOfMonth: Date = dateUtils.getEndOfMonth(end);
        const ranges = this._calculateRangeSelectedCallback(start, endOfMonth);
        const startValue = ranges[0];
        const endValue = ranges[1];
        this.rangeChanged(startValue, endValue);
        this.sendResult(startValue, endValue);
    }

    private _calculateRangeSelectedCallback(startValue: Date, endValue: Date): Date[] {
        if (this._options.rangeSelectedCallback) {
            const ranges = this._options.rangeSelectedCallback(startValue, endValue);
            startValue = ranges[0];
            endValue = ranges[1];
        }
        return [startValue, endValue];
    }

    _monthRangeMonthClick(e: SyntheticEvent, date: Date): void {
        this.toggleState(date);
    }

    _monthRangeFixedPeriodClick(e: SyntheticEvent, start: Date, end: Date): void {
        this.fixedPeriodClick(start, end);
    }

    _dateRangeChanged(e: SyntheticEvent, start: Date, end: Date): void {
        this.rangeChanged(start, end);
        this._monthRangeSelectionProcessing = false;
    }

    _dateRangeSelectionChanged(e: SyntheticEvent, start: Date, end: Date): void {
        this.selectionChanged(start, end);
    }

    _dateRangeSelectionEnded(e: SyntheticEvent, start: Date, end: Date): void {
        this.sendResult(start, end);
    }

    _dateRangeFixedPeriodClick(e: SyntheticEvent, start: Date, end: Date): void {
        this.fixedPeriodClick(start, end);
    }

    _keyDownHandler(event: SyntheticEvent): void {
        switch (event.nativeEvent.keyCode) {
            case constants.key.home:
                this._scrollToCurrentMonth();
                break;
            case constants.key.esc:
                this._applyResult();
                break;
            case constants.key.tab:
                // Если управление происходит через клавиатуру,
                // то мы включаем режим, при котором фокус на элементах будет выделять их.
                this._keyboardActive = true;
                break;
        }
    }

    _onClickHandler(): void {
        this._keyboardActive = false;
    }

    _applyClick(e: SyntheticEvent): Promise<void> {
        return this._applyResult();
    }

    _applyResult(): Promise<void> {
        return this.isInputsValid().then((valid: boolean) => {
            if (valid) {
                this.sendResult();
            }
        });
    }

    _closeClick(): void {
        this._notify('close');
    }

    _inputControlHandler(event: SyntheticEvent, value: Date, displayValue: Date, selection: any): void {
        if (selection.end === displayValue.length &&
            this._options.selectionType !== IRangeSelectable.SELECTION_TYPES.single) {
            this._children.endValueField.activate({enableScreenKeyboard: true});
        }
    }

    _inputFocusOutHandler(event: SyntheticEvent): Promise<boolean> {
        if (this._headerType === this._options.headerType) {
            return;
        }
        return new Promise((resolve) => {
            if (!this._children.inputs.contains(event.nativeEvent.relatedTarget)) {
                return this.isInputsValid().then((valid: boolean) => {
                    if (valid) {
                        this._headerType = this._options.headerType;
                    }
                    resolve(valid);
                });
            }
            resolve(false);
        });
    }

    _resetButtonClickHandler(): void {
        this._resetValues();
    }

    _resetButtonKeyDownHandler(event: SyntheticEvent): void {
        if (constants.key.enter === event.nativeEvent.keyCode) {
            this._resetValues();
        }
    }

    _resetValues(): void {
        this.rangeChanged(this._options.resetStartValue || null, this._options.resetEndValue || null);
        this._resetButtonVisible = false;
    }

    _updateResetButtonVisible(options): void {
        const hasResetStartValue = options.resetStartValue || options.resetStartValue === null;
        const hasResetEndValue = options.resetEndValue || options.resetEndValue === null;
        this._resetButtonVisible = (hasResetStartValue &&
            (!dateUtils.isDatesEqual(this._rangeModel.startValue, options.resetStartValue) ||
            this._rangeModel.startValue !== options.resetStartValue)) ||
            (hasResetEndValue && (!dateUtils.isDatesEqual(this._rangeModel.endValue, options.resetEndValue)
            || this._rangeModel.startValue !== options.resetEndValue));
    }

    fixedPeriodClick(start: Date, end: Date): void {
        this.rangeChanged(start, end);
        this._monthRangeSelectionProcessing = false;
        this.sendResult(start, end);
    }

    selectionChanged(start: Date, end: Date): void {
        this._headerRangeModel.startValue = start;
        this._headerRangeModel.endValue = end;
    }

    rangeChanged(start: Date, end: Date): void {
        let startValue = start;
        let endValue = end;
        // Если передать null в качестве начала и конца периода, то выделится
        // период от -бесконечности до +бесконечности.
        // В режиме выбора одного дня мы не должны выбирать ни один день.
        if (this._options.selectionType === IRangeSelectable.SELECTION_TYPES.single) {
            if (start === null || end === null) {
                startValue = undefined;
                endValue = undefined;
            }
        }
        this._rangeModel.startValue = startValue;
        this._rangeModel.endValue = endValue;
        this._headerRangeModel.startValue = startValue;
        this._headerRangeModel.endValue = endValue;
        this.updateYearsRangeModel(start, endValue);
        this._updateResetButtonVisible(this._options);
    }

    updateYearsRangeModel(start: Date, end: Date): void {
        if ((dateUtils.isStartOfYear(start) || start === null) && (dateUtils.isEndOfYear(end) || end === null)) {
            this._yearRangeModel.startValue = start;
            this._yearRangeModel.endValue = end;
        } else {
            this._yearRangeModel.startValue = undefined;
            this._yearRangeModel.endValue = undefined;
        }
    }

    sendResult(start: Date, end: Date): void {
        this._notify(
            'sendResult',
            [start || this._rangeModel.startValue, end || this._rangeModel.endValue],
            {bubbling: true}
        );
    }

    getViewState(options: IControlOptions, monthStateEnabled: boolean, yearStateEnabled: boolean): string {
        if (monthStateEnabled) {
            if (yearStateEnabled) {
                if (((dateUtils.isValidDate(options.startValue) && dateUtils.isValidDate(options.endValue)) &&
                    (!dateUtils.isStartOfMonth(options.startValue) || !dateUtils.isEndOfMonth(options.endValue)) &&
                    Range.getPeriodLengthInDays(options.startValue, options.endValue) <= MONTH_STATE_SELECTION_DAYS)) {
                    return STATES.month;
                }
            } else {
                return STATES.month;
            }
        }
        return STATES.year;
    }

    toggleState(date?: Date): void {
        this._state = this._state === STATES.year ? STATES.month : STATES.year;
        let displayedDate;
        if (date) {
            displayedDate = date;
        } else if (dateUtils.isValidDate(this._options.startValue)) {
            displayedDate = this._options.startValue;
        } else if (dateUtils.isValidDate(this._options.endDate)) {
            displayedDate = this._options.endDate;
        } else {
            displayedDate = new Date();
        }
        this._displayedDate = this._state === STATES.year ?
            dateUtils.getStartOfYear(displayedDate) : dateUtils.getStartOfMonth(displayedDate);
    }

    isMaskWithDays(mask: string): boolean {
        return mask.indexOf('D') !== -1;
    }

    isInputsValid(): Promise<boolean> {
        return this._children.formController.submit().then((results: object) => {
            return !Object.keys(results).find((key) => Array.isArray(results[key]));
        });
    }

    updateValidators(options?: IControlOptions): void {
        this.updateStartValueValidators(options?.startValueValidators);
        this.updateEndValueValidators(options?.endValueValidators);
    }

    updateStartValueValidators(validators?: Function[]): void {
        const startValueValidators: Function[] = validators || this._options.startValueValidators;
        this._startValueValidators = Range.getRangeValueValidators(startValueValidators, this._rangeModel, this._rangeModel.startValue);
    }

    updateEndValueValidators(validators?: Function[]): void {
        const endValueValidators: Function[] = validators || this._options.endValueValidators;
        this._endValueValidators = Range.getRangeValueValidators(endValueValidators, this._rangeModel, this._rangeModel.endValue);
    }

    static _theme: string[] = ['Controls/datePopup'];

    static getDefaultOptions(): object {
        return coreMerge({
            /**
             * @name Controls/datePopup#emptyCaption
             * @cfg {String} Отображаемый текст, когда в контроле не выбран период.
             */

            /*
             * @name Controls/datePopup#emptyCaption
             * @cfg {String} Text that is used if the period is not selected
             */
            emptyCaption: rk('Не указан'),

            /**
             * @name Controls/datePopup#headerType
             * @cfg {String} Тип заголовка.
             * @variant link Заголовок отображает выбранный период. При клике по заголовку он преобразуется в поле ввода периода.
             * @variant input Заголовок по умолчанию отображается в виде поля ввода периода.
             */

            /*
             * @name Controls/datePopup#headerType
             * @cfg {String} Type of the header.
             * @variant link
             * @variant input
             */
            headerType: HEADER_TYPES.link,

            minRange: IDateRangeSelectable.minRange.day,
            mask: popupMask.auto,

            dateConstructor: WSDate,

            dayTemplate: MonthViewDayTemplate,

            startValueValidators: [],
            endValueValidators: []
        }, IRangeSelectable.getDefaultOptions());
    }

    static getOptionTypes(): object {
        return coreMerge({
            headerType: descriptor(String).oneOf([
                HEADER_TYPES.link,
                HEADER_TYPES.input
            ])
        }, IDateRangeSelectable.getOptionTypes());
    }
}

Object.defineProperty(DatePopup, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return DatePopup.getDefaultOptions();
   }
});
