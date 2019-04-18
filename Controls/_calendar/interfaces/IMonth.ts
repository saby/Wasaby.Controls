import dateFormat = require('Core/helpers/Date/format');
import {descriptor} from 'Types/entity';
import dateUtil = require('Controls/Utils/Date');

/**
 * Интерфейс контролов отображающих месяц
 * mixin Controls/_calendar/interfaces/IMonth
 */

export default {
    getDefaultOptions: function () {
        return {

            /**
             * @name Controls/_calendar/interface/IMonth#month
             * @cfg {Date|String} Месяц с которого откроется календарь
             * @remark
             * Строка должна быть формата ISO 8601.
             * Дата игнорируется.
             * @example
             * <pre class="brush:xml">
             *     <option name="month">2015-03-07T21:00:00.000Z</option>
             * </pre>
             */
            month: dateUtil.getStartOfMonth(new Date()),

            /**
             * @name Controls/_calendar/interface/IMonth#showCaption
             * @cfg {String} Тип заголовка "text"|null
             */
            showCaption: false,

            /**
             * @name Controls/_calendar/interface/IMonth#captionFormat
             * @cfg {String} Формат заголовка
             * @remark
             * Строка должна быть в формате поддерживаемым Core/helpers/Date/format.
             */
            captionFormat: dateFormat.FULL_MONTH,

            /**
             * @name Controls/_calendar/interface/IMonth#showWeekdays
             *  @cfg {Boolean} Если true, то дни недели отображаются
             */
            showWeekdays: true,

            /**
             * @name Controls/_calendar/interface/IMonth#dayFormatter
             * @cfg {Function} Возможность поменять конфигурацию для дня. В функцию приходит объект даты. Опция необходима для производственных каледнадрей.
             */
            dayFormatter: undefined,

            /**
             * @name Controls/_calendar/interface/IMonth#mode
             * @cfg {String} Month view mode
             * @variant current Only the current month is displayed
             * @variant extended 6 weeks are displayed. The first week of the current month is complete,
             * the last week is complete and if the current month includes less than 6 weeks, then the weeks
             * of the next month are displayed.
             */
            mode: 'current'
        };
    },


    getOptionTypes: function () {
        return {

            // month: types(Date),
            showCaption: descriptor(Boolean),
            captionFormat: descriptor(String),
            showWeekdays: descriptor(Boolean),
            dayFormatter: descriptor(Function),
            mode: descriptor(String).oneOf([
                'current',
                'extended'
            ])
        };
    }
};
