import {descriptor} from 'Types/entity';
import dateControlsUtils = require('Controls/Calendar/Utils');

/**
 * mixin Controls/_dateRange/interfaces/ILinkView
 * @public
 */
var EMPTY_CAPTIONS = {
    NOT_SPECIFIED: rk('Не указан'),
    NOT_SELECTED: rk('Не выбран'),
    WITHOUT_DUE_DATE: rk('Бессрочно', 'ShortForm'),
    ALL_TIME: rk('Весь период')
};

export default {
    getDefaultOptions: function () {
        return {

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#style
             * @cfg {String} Display style of component.
             * @variant default Component display as default style.
             * @variant linkMain Component display as main link style.
             * @variant linkMain2 Component display as first nonaccent link style.
             * @variant linkAdditional Component display as third nonaccent link style.
             */
            style: 'default',

            linkClickable: true,

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#showNextArrow
             * @cfg {Boolean} Display the control arrow to switch to the next period
             */
            showNextArrow: false,

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#showPrevArrow
             * @cfg {Boolean} Display the control arrow to switch to the previous period
             */
            showPrevArrow: false,

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#showDeleteButton
             * @cfg {Boolean} Enables or disables the display of the period clear button.
             */
            showDeleteButton: true,

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#emptyCaption
             * @cfg {String} Text that is used if the period is not selected.
             */
            emptyCaption: EMPTY_CAPTIONS.NOT_SPECIFIED,

            /**
             * @name Controls/_dateRange/interfaces/ILinkView#captionFormatter
             * @cfg {Function} Caption formatting function.
             */
            captionFormatter: dateControlsUtils.formatDateRangeCaption
        };
    },

    EMPTY_CAPTIONS: EMPTY_CAPTIONS,

    getOptionTypes: function () {
        return {
            style: descriptor(String).oneOf([
                'default',
                'linkMain',
                'linkMain2',
                'linkAdditional',
                'secondary'
            ]),
            showNextArrow: descriptor(Boolean),
            showPrevArrow: descriptor(Boolean),
            showDeleteButton: descriptor(Boolean),
            emptyCaption: descriptor(String),
            captionFormatter: descriptor(Function)
        };
    }
};
