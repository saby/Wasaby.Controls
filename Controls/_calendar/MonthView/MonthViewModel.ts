import {IDateRangeSelectable, Utils as calendarUtils} from 'Controls/dateRange';
import {VersionableMixin, Date as WSDate} from 'Types/entity';
import {date as formatDate} from 'Types/formatter';
import {Base as DateUtil} from 'Controls/dateUtils';
import * as coreMerge from 'Core/core-merge';

/**
 * Модель для представления месяца.
 * @class Controls/_calendar/MonthView/MonthViewModel
 * @author Красильников А.С.
 * @public
 */

export default class MonthViewModel extends VersionableMixin {
    _state: object;
    _modelArray: object[] = [];
    _singleDayHover: boolean = true;

    constructor(cfg) {
        super(cfg);

        // Нет необходимости каждый раз обовлять стили месяца при наведении,
        // если хавер работает только по одной ячейке дня, а не по нескольким.
        const isQuantumSelection = cfg.selectionType === 'quantum' && cfg.ranges;
        if (isQuantumSelection) {
            const isSingleDayQuantum = 'days' in cfg.ranges && cfg.ranges.days.indexOf(1) !== -1;
            this._singleDayHover = isSingleDayQuantum;
        }

        this._state = this._normalizeState(cfg);
        this._validateWeeksArray();
    }

    updateOptions(options) {
        let state = this._normalizeState(options),
            changed = this._isStateChanged(state);
        this._state = state;
        if (changed) {
            this._validateWeeksArray();
            this._nextVersion();
        }
    }

    getMonthArray() {
        return this._modelArray;
    }

    _prepareClass(scope, theme, fontColorStyle, backgroundStyle, borderStyle, fontWeight): string {

        let textColorClass = 'controls-MonthView__textColor',
            backgroundColorClass = 'controls-MonthView__backgroundColor',
            backgroundColorClassRangeHovered,
            css = [];

        if (scope.isCurrentMonth) {
            textColorClass += '-currentMonthDay';
            backgroundColorClass += '-currentMonthDay';
        } else {
            textColorClass += '-otherMonthDay';
            backgroundColorClass += '-otherMonthDay';
        }

        if (scope.today) {
            textColorClass += '-today';
        } else {
            textColorClass += scope.weekend ? '-weekend' : '-workday';
        }

        if (scope.selected && (scope.isCurrentMonth || scope.mode === 'extended')) {
            backgroundColorClass += '-selected';
            if (scope.selectedStart || scope.selectedEnd) {
                if (scope.selectionProcessing) {
                    backgroundColorClass += '-startend-unfinished';
                }
                if (fontWeight !== 'normal') {
                    css.push('controls-MonthView__fontWeight_theme-' + theme);
                }
            }

            let borderColorClass = 'controls-MonthViewVDOM__item-border';

            const borderStylePostfix = borderStyle ? '_style-' + borderStyle : '';
            css.push(`${borderColorClass}${borderStylePostfix}_theme-${theme}`);

            borderColorClass = 'controls-MonthView__item-border';
            if (scope.selectedStart && scope.selectedEnd && !scope.selectionProcessing) {
                borderColorClass += '-start-end';
            } else if (scope.selectedStart && !scope.selectedUnfinishedStart) {
                borderColorClass += '-start';
            } else if (scope.selectedEnd && (!scope.selectionProcessing ||
                (scope.selectedEnd !== scope.selectedStart && !scope.selectedUnfinishedEnd))) {
                borderColorClass += '-end';
            }
            css.push(`${borderColorClass}${borderStylePostfix}`);
            css.push(`${borderColorClass}${borderStylePostfix}_theme-${theme}`);
        } else {
            backgroundColorClass += '-unselected';
        }

        if (scope.readOnly) {
            backgroundColorClass += '-readOnly';
        }
        backgroundColorClassRangeHovered = backgroundColorClass + '-hovered';
        textColorClass += '_theme-' + theme;
        backgroundColorClass += '_theme-' + theme;
        backgroundColorClassRangeHovered += '_theme-' + theme;

        if (fontColorStyle) {
            textColorClass += '_style-' + fontColorStyle;
        }

        if (backgroundStyle) {
            backgroundColorClass += '_style-' + backgroundStyle;
            backgroundColorClassRangeHovered += '_style-' + backgroundStyle;
        }
        if (scope.isCurrentMonth || scope.mode === 'extended') {
            css.push(textColorClass, backgroundColorClass);
            if (scope.hovered) {
                css.push(backgroundColorClassRangeHovered);
            }
        }

        // Оставляем старые классы т.к. они используются в большом выборе периода до его редизайна
        // TODO: Выпилить старые классы
        if (scope.isCurrentMonth || scope.mode === 'extended') {
            if (scope.selectionEnabled) {
                css.push('controls-MonthViewVDOM__cursor-item');
            }
            if (!scope.selected) {
                let borderStyle;
                if (scope.selectionEnabled && this._singleDayHover) {
                    borderStyle = 'controls-MonthView__border-currentMonthDay-unselected_theme-' + theme;
                } else if (scope.hovered) {
                    borderStyle = 'controls-MonthView__border-hover_theme-' + theme;
                }
                if (borderStyle) {
                    borderStyle += backgroundStyle ? '_style-' + backgroundStyle : '';
                    css.push(borderStyle);
                }
            }
            css.push('controls-MonthViewVDOM__selectableItem');
            if (scope.enabled && scope.selectionEnabled) {
                css.push('controls-MonthViewVDOM__hover-selectableItem');
            }
            if (scope.selected) {
                css.push('controls-MonthViewVDOM__item-selected');
            }

            if (scope.selectedUnfinishedStart) {
                css.push('controls-MonthViewVDOM__item-selectedStart-unfinished_theme-' + theme);
            }
            if (scope.selectedUnfinishedEnd) {
                css.push('controls-MonthViewVDOM__item-selectedEnd-unfinished_theme-' + theme);
            }
            if (scope.selected) {
                if (scope.selectedStart && scope.selectedEnd && !scope.selectionProcessing) {
                    css.push('controls-MonthViewVDOM__item-selectedStartEnd_theme-' + theme);
                } else if (scope.selectedStart && !scope.selectedUnfinishedStart) {
                    css.push('controls-MonthViewVDOM__item-selectedStart_theme-' + theme);
                    css.push('controls-MonthViewVDOM__item-selectedStart');
                } else if (scope.selectedEnd && (!scope.selectionProcessing ||
                    (scope.selectedEnd !== scope.selectedStart && !scope.selectedUnfinishedEnd))) {
                    css.push('controls-MonthViewVDOM__item-selectedEnd_theme-' + theme);
                    css.push('controls-MonthViewVDOM__item-selectedEnd');
                }
            }
            if (scope.selectedInner) {
                css.push('controls-MonthViewVDOM__item-selectedInner_theme-' + theme);
                css.push('controls-MonthViewVDOM__item-selectedInner');
            }

            if (scope.today) {
                css.push('controls-MonthViewVDOM__today_theme-' + theme);
                css.push('controls-MonthViewVDOM__today');
            }
        }
        css.push(scope.isCalendar ? 'controls-MonthViewVDOM__currentMonthDay_theme-' +
            theme : 'controls-MonthViewVDOM__' + scope.month + '_theme-' + theme);

        if (scope.weekend) {
            css.push('controls-MonthViewVDOM__weekend');
        } else {
            css.push('controls-MonthViewVDOM__workday');
        }

        return css.join(' ');
    }

    protected _normalizeState(state) {
        return {
            month: DateUtil.normalizeDate(state.month),
            mode: state.mode,
            enabled: state.enabled,
            daysData: state.daysData,
            dateConstructor: state.dateConstructor || WSDate,
            readOnly: state.readOnly,
            dayFormatter: state.dayFormatter,
            _date: state._date
        };
    }

    protected _isStateChanged(state) {
        return !DateUtil.isDatesEqual(state.month, this._state.month) || state.daysData !== this._state.daysData;
    }

    protected _getDayObject(date, state) {
        state = state || this._state;
        /* Опция _date устаналивается только(!) в демках, для возможности протестировать
         визуальное отображение текущей даты */
        let obj = {},
            today = this._state._date ?
                DateUtil.normalizeDate(this._state._date) :
                DateUtil.normalizeDate(new this._state.dateConstructor()),
            firstDateOfMonth = DateUtil.getStartOfMonth(date),
            lastDateOfMonth = DateUtil.getEndOfMonth(date);

        obj.readOnly = state.readOnly;
        obj.mode = state.mode;
        obj.date = date;
        obj.id = formatDate(date, 'YYYY-MM-DD');
        obj.day = date.getDate();
        obj.dayOfWeek = date.getDay() ? date.getDay() - 1 : 6;
        obj.isCurrentMonth = DateUtil.isMonthsEqual(date, state.month);
        obj.today = DateUtil.isDatesEqual(date, today);
        obj.month = date.getMonth();
        obj.firstDayOfMonth = DateUtil.isDatesEqual(date, firstDateOfMonth);
        obj.lastDayOfMonth = DateUtil.isDatesEqual(date, lastDateOfMonth);

        obj.selectionEnabled = this._state.selectionType !== IDateRangeSelectable.SELECTION_TYPES.disable &&
            !this._state.readOnly;

        obj.weekend = obj.dayOfWeek === 5 || obj.dayOfWeek === 6;
        obj.enabled = state.enabled;
        obj.clickable = obj.mode === 'extended' || obj.isCurrentMonth;

        obj.hovered = state.hoveredStartValue <= obj.date && state.hoveredStartValue !== null &&
            state.hoveredEndValue >= obj.date && !this._singleDayHover;

        if (state.dayFormatter) {
            coreMerge(obj, state.dayFormatter(date) || {});
        }

        if (state.daysData) {
            obj.extData = state.daysData.at ? state.daysData.at(obj.day - 1) : state.daysData[obj.day - 1];
        }

        return obj;
    }

   private _validateWeeksArray(state?): void {
      this._modelArray = this._getDaysArray(state);
   }

    private _getDaysArray(state?) {
        state = state || this._state;
        const weeks = calendarUtils.getWeeksArray(state.month, state.mode, state.dateConstructor);

        return weeks.map((weekArray) => {
            return weekArray.map((day) => {
                return this._getDayObject(day, state);
            }, this);
        }, this);
    }
}
